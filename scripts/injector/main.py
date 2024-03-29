import argparse
import csv
import logging
import sys

from tqdm import tqdm

import database_injector


def blocks(files, size=65536):
    while True:
        b = files.read(size)
        if not b: break
        yield b


def main():
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)

    # https://docs.python.org/3/library/argparse.html
    parser = argparse.ArgumentParser()
    parser.add_argument('--dbms', default='mongo,postgres,cassandra',
                        type=lambda s: [dbms for dbms in s.split(',')], help='DBMSs')
    parser.add_argument('--init', action='store_true', help='Reset and initialize databases')
    parser.add_argument('-f', '--file', required=True, type=str, help='File to read')  # type=argparse.FileType('r')
    parser.add_argument('-c', '--city', required=False, type=int, help='City id', default=0)
    parser.add_argument('-b', '--batch', required=False, type=int, help='Batch size', default=512)
    args = parser.parse_args()

    logging.info('Parsed args: %s' % args)

    batch_size = args.batch
    injector = database_injector.DatabaseInjector(args)

    rows = 0
    with open(args.file, 'r', encoding='utf-8', errors='ignore') as f:
        rows = sum(bl.count("\n") for bl in blocks(f))

    with open(args.file, 'r') as f:
        reader = csv.DictReader(f, delimiter=',')

        batch = []
        for row, data in enumerate(tqdm(reader, total=(rows - 1))):
            if row % batch_size == 0 and row > 0:
                # time.sleep(0.5)
                injector.inset_batch(batch)
                batch = []
            batch.append(data)


if __name__ == "__main__":
    main()
