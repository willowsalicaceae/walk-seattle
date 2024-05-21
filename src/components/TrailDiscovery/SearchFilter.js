// src/components/TrailDiscovery/SearchFilter.js
import React, { useState } from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

const SearchFilter = ({ sortBy, sortOrder, onSortChange, onSortOrderChange, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSortChange = (event) => {
    onSortChange(event.target.value);
  };

  const handleSortOrderChange = (event, newSortOrder) => {
    if (newSortOrder !== null) {
      onSortOrderChange(newSortOrder);
    }
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <TextField
        label="Search Trails"
        variant="outlined"
        value={searchQuery}
        onChange={handleSearchChange}
      />
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
      <ToggleButtonGroup
        value={sortOrder}
        exclusive
        onChange={handleSortOrderChange}
        aria-label="sort order"
      >
        <ToggleButton value="asc" aria-label="sort ascending">
          <ArrowUpward />
        </ToggleButton>
        <ToggleButton value="desc" aria-label="sort descending">
          <ArrowDownward />
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default SearchFilter;