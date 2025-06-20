import React, { useState } from 'react';
import {
  Paper,
  InputBase,
  IconButton,
  Box,
  Chip,
  Typography,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';

interface SearchBarProps {
  onSearch: (city: string) => void;
  onLocationSearch: () => void;
  loading: boolean;
  recentSearches: string[];
  onClearRecent: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onLocationSearch,
  loading,
  recentSearches,
  onClearRecent,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
      setSearchTerm('');
    }
  };

  const handleLocationClick = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onLocationSearch();
        },
        (error) => {
          alert('Unable to get your location. Please search for a city instead.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          mb: 2,
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1, fontSize: '1.1rem' }}
          placeholder="Search for a city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loading}
        />
        <IconButton
          type="submit"
          sx={{ p: '10px', color: 'primary.main' }}
          disabled={loading || !searchTerm.trim()}
        >
          <SearchIcon />
        </IconButton>
        <IconButton
          sx={{ p: '10px', color: 'secondary.main' }}
          onClick={handleLocationClick}
          disabled={loading}
          title="Use current location"
        >
          <LocationIcon />
        </IconButton>
      </Paper>

      {recentSearches.length > 0 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Recent searches:
            </Typography>
            <IconButton size="small" onClick={onClearRecent} title="Clear recent searches">
              <ClearIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {recentSearches.slice(0, 5).map((city, index) => (
              <Chip
                key={index}
                label={city}
                onClick={() => onSearch(city)}
                size="small"
                variant="outlined"
                sx={{
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'white',
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};
