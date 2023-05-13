import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
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
        title: 'testcase1',
        url: '/testcase1',
        data: {
            mongo: 0,
            cassandra: 0,
            postgres: 0,
        }
    },
    {
        title: 'testcase2',
        url: '/testcase2',
        data: {
            mongo: 0,
            cassandra: 0,
            postgres: 0,
        }
    }
];

export const Testcase = (props) => {
    const {
        title
    } = props;

    const [data, setData] = useState(testcases);

    const update = (url) => {
        return () => {
            fetch(url)
                .then(response => response.json())
                .then(response => {
                    setData(prevState => prevState.map(testcase => {
                        if (testcase.url === url) {
                            return {
                                ...testcase,
                                data: response
                            }
                        } else {
                            return testcase;
                        }
                    }))
                });
        }
    }

    return (
        <>
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
                {data.map(({title, url, data}) => (
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
                            <Button variant="contained" onClick={update(url)}>
                                Aktualizuj
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        </TableContainer>
        {/*<Card>*/}
        {/*    <CardContent>*/}
        {/*        <Typography variant="h4" color="text.primary" gutterBottom>*/}
        {/*            {title}*/}
        {/*        </Typography>*/}
        {/*        Mongo*/}
        {/*        Cassandra*/}
        {/*        Postgres*/}
        {/*    </CardContent>*/}
        {/*    <CardActions>*/}
        {/*        <Box flexGrow={1} />*/}
        {/*        <Button variant="contained" onClick={update}>*/}
        {/*            Aktualizuj*/}
        {/*        </Button>*/}
        {/*    </CardActions>*/}
        {/*</Card>*/}
        </>
    );
}
