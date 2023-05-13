import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import {Chart} from './Chart';
import {Testcase} from './Testcase';

function NavBar() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Zaawansowane Techniki Bazy Danych - Projekt
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export function App() {
    return (
        <>
            <CssBaseline />
            <NavBar />
            <Toolbar />
            <Container>
                <Chart />
                <Box my={16} />
                <Testcase />
                <Box my={16} />
            </Container>
        </>
    )
}
