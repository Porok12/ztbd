import logging
import time
from enum import Enum
from typing import Iterator, TypedDict, List
from datetime import date, timedelta

from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.firefox import GeckoDriverManager


class Mode(Enum):
    DAILY = 'daily'
    WEEKLY = 'weekly'
    MONTHLY = 'monthly'


class WeatherData(TypedDict):
    date: str
    time: str
    temperature: int
    dew_point: int
    humidity: int
    wind: str
    wind_speed: int
    wind_gust: int
    pressure: float
    precip: float
    condition: str


class Wunderground:
    def __init__(self, args, city: str = 'warsaw') -> None:
        # Setup basic data
        self.mode: Mode = Mode.DAILY
        self.city: str = city
        self.website_url: str = 'https://www.wunderground.com/history/%s/pl/%s/EPWA/date' % (self.mode.value, city)

        # Instantiate a webdriver
        if args.browser == 'firefox':
            options = webdriver.FirefoxOptions()
            if args.headless:
                options.add_argument('--headless')
            self.driver = webdriver.Firefox(
                options=options,
                service=Service(GeckoDriverManager().install()),
            )
        else:
            options = webdriver.ChromeOptions()
            if args.headless:
                options.add_argument('--headless')
            self.driver = webdriver.Chrome(
                options=options,
                service=Service(ChromeDriverManager().install()),
            )
        self.driver.set_page_load_timeout(10)

    def __del__(self):
        if self.driver is not None:
            self.driver.quit()

    def _get_data(self, d: date) -> List[WeatherData]:
        url = '/'.join([self.website_url, d.strftime('%Y-%-m-%-d')])

        self.driver.get(url)
        time.sleep(0.5)  # Workaround to mitigate missing table
        html = self.driver.page_source
        soup = BeautifulSoup(html, features="html.parser")

        logging.debug('Title: %s' % soup.title)

        # Wait for table to be loaded
        wait = WebDriverWait(self.driver, 20)
        wait.until(
            # EC.presence_of_element_located(
            #     (By.CSS_SELECTOR, 'div.observation-table > table > tbody > tr > td > span'),
            # )
            EC.text_to_be_present_in_element(
                (By.CSS_SELECTOR, 'div.observation-table > table > tbody > tr > td > span'),
                '1:00 AM',
            )
        )

        # Finding table
        table_parent = soup.find('div', class_='observation-table')

        time.sleep(0.5)  # Workaround to mitigate missing table
        if table_parent is None:
            logging.error('Missing table, skipping day %s' % d.strftime('%Y-%m-%d'))
            return []

        # Obtain every title of columns with tag <td>
        table_head = table_parent.find('thead')
        headers = [th.text for th in table_head.find_all('th')]
        logging.debug('Headers: %s' % headers)

        # Obtain data from table
        data = []
        table_body = table_parent.find('tbody')
        for tr in table_body.find_all('tr'):
            row_data = [td.text for td in tr.find_all('td')]
            logging.debug('Data Row: %s' % row_data)
            data.append(WeatherData(
                date=d.strftime('%Y-%m-%d'),
                time=row_data[0],
                temperature=int(''.join(i for i in row_data[1] if i.isdigit())),
                dew_point=int(''.join(i for i in row_data[2] if i.isdigit())),
                humidity=int(''.join(i for i in row_data[3] if i.isdigit())),
                wind=row_data[4],
                wind_speed=int(''.join(i for i in row_data[5] if i.isdigit())),
                wind_gust=int(''.join(i for i in row_data[6] if i.isdigit())),
                pressure=float(''.join(i for i in row_data[7] if i.isdigit() or i == '.')),
                precip=float(''.join(i for i in row_data[8] if i.isdigit() or i == '.')),
                condition=row_data[9],
            ))
        return data

    # Iterate over date range and obtain data from website
    def data_range(self, start: date, end: date) -> Iterator[WeatherData]:
        if self.mode == Mode.DAILY:
            delta_days = (end - start).days
            for i in range(delta_days + 1):
                day = start + timedelta(days=i)
                data = self._get_data(day)
                yield data
        else:
            raise NotImplementedError
