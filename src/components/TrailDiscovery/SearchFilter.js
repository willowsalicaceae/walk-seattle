import React from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

const SearchFilter = ({ sortBy, sortOrder, onSortChange, onSortOrderChange }) => {
  const handleSortChange = (event) => {
    onSortChange(event.target.value);
  };

  const handleSortOrderChange = (event) => {
    onSortOrderChange(event.target.value);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <TextField label="Search Trails" variant="outlined" />
      <FormControl variant="outlined" sx={{ minWidth: 120 }}>
        <InputLabel>Sort By</InputLabel>
        <Select value={sortBy} onChange={handleSortChange} label="Sort By">
          <MenuItem value="">None</MenuItem>
          <MenuItem value="numReviews">Number of Reviews</MenuItem>
          <MenuItem value="rating">Rating</MenuItem>
          <MenuItem value="difficulty">Difficulty</MenuItem>
          <MenuItem value="length">Length</MenuItem>
          <MenuItem value="distance">Distance</MenuItem>
        </Select>
      </FormControl>
      <FormControl variant="outlined" sx={{ minWidth: 120 }}>
        <InputLabel>Sort Order</InputLabel>
        <Select value={sortOrder} onChange={handleSortOrderChange} label="Sort Order">
          <MenuItem value="desc">High to Low</MenuItem>
          <MenuItem value="asc">Low to High</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default SearchFilter;