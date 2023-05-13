import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const cities = ['warsaw', 'cracow', 'wroclaw', 'katowice'];

export default function SelectCity({ value: city, onChange: setCity }) {
    // const [city, setCity] = React.useState('warsaw');

    const handleChange = (event) => {
        setCity(event.target.value);
    };

    return (
        <Box sx={{ minWidth: 120, marginTop: '8px' }}>
            <FormControl fullWidth>
                <InputLabel id="select-city-label">City</InputLabel>
                <Select
                    labelId="select-city-label"
                    value={city}
                    label="City"
                    onChange={handleChange}
                >
                    {cities.map(city => <MenuItem key={city} value={city}>{city}</MenuItem>)}
                </Select>
            </FormControl>
        </Box>
    );
}
