import csv
import sys
import logging
import argparse
from tqdm import tqdm
from datetime import datetime

import weather_website


def main():
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)

    # https://docs.python.org/3/library/argparse.html
    parser = argparse.ArgumentParser()
    parser.add_argument('-b', '--browser', required=False, type=str, help='Browser', choices=['firefox', 'chrome'],
                        default='chrome')
    parser.add_argument('--headless', required=False, type=bool, help='Browser', default=True)
    parser.add_argument('-s', '--start', required=True, type=lambda s: datetime.strptime(s, '%Y-%m-%d'),
                        help='Start date')
    parser.add_argument('-e', '--end', required=True, type=lambda s: datetime.strptime(s, '%Y-%m-%d'), help='End date')
    args = parser.parse_args()

    logging.debug('Parsed args: %s' % args)

    website = weather_website.Wunderground(args)

    # Write to csv (90kB = 1:30)
    keys = ['date', 'time', 'temperature', 'dew_point', 'humidity', 'wind', 'wind_speed', 'wind_gust', 'pressure',
            'precip', 'condition']
    with open('weather.csv', 'w') as f:
        w = csv.DictWriter(f, keys)
        w.writeheader()
        for data in tqdm(website.data_range(args.start, args.end), total=(args.end - args.start).days):
            w.writerows(data)


if __name__ == "__main__":
    main()
