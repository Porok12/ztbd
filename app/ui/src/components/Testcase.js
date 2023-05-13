import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useState} from "react";

const testcases = [
    {
        title: 'Query po "dew_point" (nieindeksowane)',
        url: '/testcase1',
        data: {
            mongo: 0,
            cassandra: 0,
            postgres: 0,
        },
        loading: false,
    },
    {
        title: 'Query po "city" (indeksowane)',
        url: '/testcase2',
        data: {
            mongo: 0,
            cassandra: 0,
            postgres: 0,
        },
        loading: false,
    },
    {
        title: 'Średnia miesięczna temperatura',
        url: '/testcase3',
        data: {
            mongo: 0,
            cassandra: 0,
            postgres: 0,
        },
        loading: false,
    },
    {
        title: 'testcase4',
        url: '/testcase4',
        data: {
            mongo: 0,
            cassandra: 0,
            postgres: 0,
        },
        loading: false,
    },
    {
        title: 'testcase5',
        url: '/testcase5',
        data: {
            mongo: 0,
            cassandra: 0,
            postgres: 0,
        },
        loading: false,
    },
    {
        title: 'testcase6',
        url: '/testcase6',
        data: {
            mongo: 0,
            cassandra: 0,
            postgres: 0,
        },
        loading: false,
    },
];

export const Testcase = () => {
    const [data, setData] = useState(testcases);

    const update = (url) => {
        return () => {
            // Set loading to true
            setData(prevState => prevState.map(testcase => {
                return testcase.url === url ? { ...testcase, loading: true } : testcase;
            }));
            // Fetch data from API
            fetch(url)
                .then(response => response.json())
                .then(response => {
                    setData(prevState => prevState.map(testcase => {
                        return testcase.url === url ? { ...testcase, data: response, loading: false } : testcase;
                    }));
                });
        }
    }

    return (
        <>
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
            <TableHead>
                <TableRow>
                    <TableCell>Testcase</TableCell>
                    <TableCell align="right">Mongo</TableCell>
                    <TableCell align="right">Cassandra</TableCell>
                    <TableCell align="right">Postgres</TableCell>
                    <TableCell></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {data.map(({title, url, data, loading}) => (
                    <TableRow
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="th" scope="row">
                            {title}
                        </TableCell>
                        <TableCell align="right">{data.mongo}s</TableCell>
                        <TableCell align="right">{data.cassandra}s</TableCell>
                        <TableCell align="right">{data.postgres}s</TableCell>
                        <TableCell align="right">
                            <LoadingButton variant="contained" onClick={update(url)} loading={loading}>
                                Aktualizuj
                            </LoadingButton>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        </TableContainer>
        </>
    );
}
