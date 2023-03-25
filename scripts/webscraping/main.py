import csv
import sys
import logging
import argparse
from tqdm import tqdm
from enum import Enum
from datetime import datetime

import database_injector
import weather_website


class Table(Enum):
    TIME = 0
    TEMPERATURE = 1
    HUMIDITY = 3
    WIND_SPEED = 4


def main():
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)

    # https://docs.python.org/3/library/argparse.html
    parser = argparse.ArgumentParser()
    # TODO: Insert data into all databases at once
    parser.add_argument('--dbms', choices=['mongo', 'postgres', 'cassandra'], required=True, type=str, help='DBMS type')
    parser.add_argument('-u', '--username', required=True, type=str, help='Username')
    parser.add_argument('-p', '--password', required=True, type=str, help='Password')
    parser.add_argument('-b', '--browser', required=False, type=str, help='Browser', choices=['firefox', 'chrome'],
                        default='chrome')
    parser.add_argument('--headless', required=False, type=bool, help='Browser', default=True)
    parser.add_argument('-s', '--start', required=True, type=lambda s: datetime.strptime(s, '%Y-%m-%d'),
                        help='Start date')
    parser.add_argument('-e', '--end', required=True, type=lambda s: datetime.strptime(s, '%Y-%m-%d'), help='End date')
    args = parser.parse_args()

    logging.debug('Parsed args: %s' % args)

    website = weather_website.Wunderground(args)
    db = database_injector.DatabaseInjector(args.dbms, args.username, args.password)

    # TODO: Insert data into database
    # for data in website.data_range(args.start, args.end):
    #     logging.info('Data: %s' % data)
    #     db.inset_data('todo')

    # Temporary write to csv (90kB = 1:30)
    keys = ['date', 'time', 'temperature', 'dew_point', 'humidity', 'wind', 'wind_speed', 'wind_gust', 'pressure',
            'precip', 'condition']
    with open('weather.csv', 'w') as f:
        w = csv.DictWriter(f, keys)
        w.writeheader()
        for data in tqdm(website.data_range(args.start, args.end), total=(args.end - args.start).days):
            w.writerows(data)


if __name__ == "__main__":
    main()
