import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const databases = ['mongo', 'postgres', 'cassandra'];

export default function SelectCity({ value: db, onChange: setDb }) {

    const handleChange = (event) => {
        setDb(event.target.value);
    };

    return (
        <Box sx={{ minWidth: 120, marginTop: '8px' }}>
            <FormControl fullWidth>
                <InputLabel id="select-db-label">Database</InputLabel>
                <Select
                    labelId="select-db-label"
                    value={db}
                    label="Database"
                    onChange={handleChange}
                >
                    {databases.map(db => <MenuItem key={db} value={db}>{db}</MenuItem>)}
                </Select>
            </FormControl>
        </Box>
    );
}
