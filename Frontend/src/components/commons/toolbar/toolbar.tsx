import React, { useState } from 'react';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import AddIcon from '@mui/icons-material/Add';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {
  Box,
  Typography,
  Radio,
  FormControlLabel,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import EditModal from '../modal/modal';
import { Check, CreateRounded, EditNote, FilterAlt } from '@mui/icons-material';

const inputStyles = {
  backgroundColor: 'white', // Background color for the search input
  '&:hover': {
    backgroundColor: 'white', // Hover background color
  },
};

interface Props {
  AddModalId: number;
  onSearch: () => void;
  filters: string[];
  text: string;
  searchText: string;
  setSearchText: (text: string) => void;
}

const ToolBar = ({
  filters,
  onSearch,
  searchText,
  setSearchText,
  text,
  AddModalId,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortBy, setSortBy] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterButtonPressed, setFilterButtonPressed] = useState(true);
  const [isActiveFilter, setIsActiveFilter] = useState(false);
  const [createdAtFilter, setCreatedAtFilter] = useState(false);
  const [modifiedAtFilter, setModifiedAtFilter] = useState(false);
  const [filterCalls, setFilterCalls] = useState({
    isActive: false,
    createdAt: false,
    modifiedAt: false,
  });
  const handleInputChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSortClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setAnchorEl(null);
  };

  const handleSortOptionClick = (option) => {
    setSortBy(option);
    setAnchorEl(null);
  };
  const handleOpenModal = (id) => {
    setIsModalOpen(true);
  };

  const handleFilter = () => {
    setFilterButtonPressed(!filterButtonPressed);
  };

  function titleModal() {
    const titleMap = {
      1: 'Add New Application',
      2: 'Add New Event',
      3: 'Add New Notification',
    };

    return titleMap[AddModalId] || 'Undefined';
  }

  return (
    <AppBar
      position='static'
      sx={{
        backgroundColor: 'white',
        height: filterButtonPressed ? '4rem' : '8rem',
        transition: 'height 0.25s ease',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography sx={{ color: 'black' }}>{text}</Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <InputBase
            placeholder='Search…'
            sx={inputStyles}
            inputProps={{ 'aria-label': 'search' }}
            value={searchText}
            onChange={handleInputChange}
          />
          <IconButton onClick={onSearch} aria-label='search'>
            <SearchIcon />
          </IconButton>

          <IconButton
            aria-label='sort'
            onClick={handleSortClick}
            aria-controls='sort-menu'
            aria-haspopup='true'
          >
            <SortIcon />
          </IconButton>
          <Menu
            id='sort-menu'
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleSortClose}
          >
            {filters.map((filter) => (
              <MenuItem
                key={filter}
                onClick={() => handleSortOptionClick(filter)}
              >
                {filter}
              </MenuItem>
            ))}
          </Menu>
          <IconButton onClick={() => handleFilter()}>
            <FilterAlt />
          </IconButton>
          <IconButton onClick={() => handleOpenModal(AddModalId)}>
            <AddIcon />
          </IconButton>
        </Box>
      </Toolbar>
      {!filterButtonPressed && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginInline: '1rem',
            marginBlock: '0.5rem',
          }}
        >
          <ToggleButtonGroup
            size='small'
            value={Object.keys(filterCalls).filter((key) => filterCalls[key])}
            onChange={(event, newFilter) => {
              console.log(newFilter);
              console.log(filterCalls);
              const obj = { ...filterCalls };
              console.log(obj);
              for (let i = 0; i < newFilter.length; i++) {
                console.log(newFilter[i]);
                filterCalls[newFilter[i]] = !filterCalls[newFilter[i]];
              }
              console.log(filterCalls);
            }}
            aria-label='filters'
          >
            <ToggleButton value='isActive' aria-label='isActive'>
              <>
                <Check />
                <Typography sx={{ color: 'black' }}>Active</Typography>
              </>
            </ToggleButton>
            <ToggleButton value='createdAt' aria-label='createdAt'>
              <>
                <Typography sx={{ color: 'black' }}>Created At</Typography>
                <CreateRounded />
              </>
            </ToggleButton>
            <ToggleButton value='modifiedAt' aria-label='modifiedAt'>
              <>
                <Typography sx={{ color: 'black' }}>Modified At</Typography>
                <EditNote />
              </>
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      )}
    </AppBar>
  );
};

export default ToolBar;
