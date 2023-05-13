import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SelectCity from "./SelectCity";
import SelectDatabase from "./SelectDatabase";

import CircularProgress from '@mui/material/CircularProgress';
import Typography from "@mui/material/Typography";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const Chart = () => {
    const lastMeasurement = dayjs('2023-04-12');
    const [from, setFrom] = useState(lastMeasurement.add(-7, 'day'));
    const [to, setTo] = useState(lastMeasurement);
    const [city, setCity] = useState('warsaw');
    const [db, setDb] = useState('mongo');
    const [data, setData] = useState([]);
    const [executedIn, setExecutedIn] = useState(null);

    useEffect(() => {
        setExecutedIn(null);
        const params = {
            from: from.format('YYYY-MM-DD'),
            to: to.format('YYYY-MM-DD'),
            city,
            db,
        }
       fetch('/query?' + new URLSearchParams(params))
           .then(response => response.json())
           .then(response => {
               setExecutedIn(Math.round(response.time * 100) / 100);
               setData(response.data);
           })
    }, [from, to, city, db]);

    return (
        <>
            <Box display="flex" justifyContent="center" gap={4} mb={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                        <DatePicker label="From" value={from} onChange={setFrom} />
                    </DemoContainer>
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                        <DatePicker label="To" value={to} onChange={setTo} />
                    </DemoContainer>
                </LocalizationProvider>
                <SelectCity value={city} onChange={setCity} />
                <SelectDatabase value={db} onChange={setDb} />
                <Box sx={{ display: 'flex', marginTop: '16px' }}>
                    {executedIn !== null ? <Typography variant="h4" color="text.secondary">{executedIn}s</Typography> : <CircularProgress />}
                </Box>
            </Box>

            <Line
                datasetIdKey='id'
                data={{
                    labels: data.map(d => d.date),
                    datasets: [
                        {
                            id: 1,
                            label: 'Temperature',
                            data: data.map(d => d.temperature),
                            borderColor: '#e71e1e'
                        },
                        {
                            id: 2,
                            label: 'Humidity',
                            data: data.map(d => d.humidity),
                            borderColor: '#1169de'
                        },
                    ],
                }}
            />
        </>
    )
}
