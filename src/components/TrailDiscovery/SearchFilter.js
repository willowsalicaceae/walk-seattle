import React from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const SearchFilter = () => {
  const [difficulty, setDifficulty] = React.useState('');

  const handleChange = (event) => {
    setDifficulty(event.target.value);
  };

  return (
    <div>
      <TextField label="Search Trails" variant="outlined" />
      <FormControl variant="outlined">
        <InputLabel id="difficulty-label">Difficulty</InputLabel>
        <Select
          labelId="difficulty-label"
          id="difficulty-select"
          value={difficulty}
          onChange={handleChange}
          label="Difficulty"
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="easy">Easy</MenuItem>
          <MenuItem value="moderate">Moderate</MenuItem>
          <MenuItem value="difficult">Difficult</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default SearchFilter;