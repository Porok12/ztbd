import argparse
import requests
from enum import Enum
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

import database_injector

target_url = 'https://www.wunderground.com/history/monthly/pl/warsaw'


class Table(Enum):
    TIME = 0
    TEMPERATURE = 1
    HUMIDITY = 3
    WIND_SPEED = 4


def main():
    # https://docs.python.org/3/library/argparse.html
    parser = argparse.ArgumentParser()
    parser.add_argument('--dbms', choices=['mongo', 'postgres', 'cassandra'], required=True, help='DBMS type')
    parser.add_argument('-u', '--username', required=True, help='Username')
    parser.add_argument('-p', '--password', required=True, help='Password')
    args = parser.parse_args()
    print(args)

    # page = requests.get(target_url, timeout=None)
    # soup = BeautifulSoup(page.content, "html.parser")
    # results = soup.find_all('table')
    # print(results)

    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    driver = webdriver.Chrome(
        options=options,
        service=Service(ChromeDriverManager().install()),
    )
    driver.get(target_url)
    html = driver.page_source
    soup = BeautifulSoup(html, features="html.parser")
    table = soup.find('table', {'class': 'days'})

    data = {}
    for tab in Table:
        tmp = table.find_all('table')[tab.value]
        values = [day.contents for day in tmp.find_all('td')]
        data[tab.name] = [v[0] for v in values[0:]]
    print(data)
    driver.quit()
    # TODO: process data and insert to db

    db = database_injector.DatabaseInjector(args.dbms, args.username, args.password)
    db.inset_data('todo')


if __name__ == "__main__":
    main()
