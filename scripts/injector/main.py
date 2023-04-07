import csv
import sys
import logging
import argparse
import time

from tqdm import tqdm
from enum import Enum
from datetime import datetime


import database_injector


def main():
    logging.basicConfig(level=logging.DEBUG, stream=sys.stdout)

    # https://docs.python.org/3/library/argparse.html
    parser = argparse.ArgumentParser()
    parser.add_argument('--dbms', default='mongo,postgres,cassandra',
                        type=lambda s: [dbms for dbms in s.split(',')], help='DBMSs')
    # parser.add_argument('-u', '--username', required=True, type=str, help='Username')
    # parser.add_argument('-p', '--password', required=True, type=str, help='Password')
    parser.add_argument('-f', '--file', required=True, type=str, help='File to read')  # type=argparse.FileType('r')
    args = parser.parse_args()

    logging.debug('Parsed args: %s' % args)

    injector = database_injector.DatabaseInjector(args)

    # with open(args.file, 'r') as f:
    #     reader = csv.reader(f, delimiter=',')
    #
    #     for data in reader:
    #         time.sleep(0.5)
    #         injector.inset_data(data)
    #         print(', '.join(data))


if __name__ == "__main__":
    main()
