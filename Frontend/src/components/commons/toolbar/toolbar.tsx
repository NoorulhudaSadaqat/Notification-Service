import React, { ContextType, useEffect, useState } from 'react';
import {
  AppBar,
  Box,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import AddIcon from '@mui/icons-material/Add';
import {
  Check,
  CreateRounded,
  EditNote,
  FilterAlt,
  FilterAltOutlined,
} from '@mui/icons-material';
import EditModal from '../modal/modal';
import { Application } from '../../../types/application';

const inputStyles = {
  backgroundColor: 'white', // Background color for the search input
  '&:hover': {
    backgroundColor: 'white', // Hover background color
  },
};

interface Props {
  addModalTitle: string;
  filters: string[];
  onSearch: () => void;
  searchText: string;
  setSearchText: (text: string) => void;
  params: object;
  text: string;
  setParams: React.Dispatch<React.SetStateAction<object>>;
  handleAdd: (element: Application | Event | Notification) => void;
  handleSearch: () => void;
}

const ToolBar = ({
  handleSearch,
  params,
  setParams,
  handleAdd,
  filters,
  onSearch,
  searchText,
  setSearchText,
  text,
  addModalTitle,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortBy, setSortBy] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterButtonPressed, setFilterButtonPressed] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState<string>();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 3) {
      setSearchText(e.target.value);
      handleSearch();
    }
  };
  useEffect(() => {
    if (!filterButtonPressed) {
      setParams({});
    }
  }, [filterButtonPressed]);

  const handleSortClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setAnchorEl(null);
  };

  const handleSortOptionClick = (option: string) => {
    setSortBy(option);
    setAnchorEl(null);
  };

  const handleOpenModal = () => {
    console.log('here');
    setIsModalOpen(true);
  };

  const handleFilter = () => {
    setFilterButtonPressed(!filterButtonPressed);
  };

  const handleFilterCalls = (
    event: React.MouseEvent<HTMLElement>,
    newFilterCalls: string
  ) => {
    setParams({ ...params, sortBy: newFilterCalls });
  };

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
          <IconButton onClick={handleFilter}>
            {!filterButtonPressed ? <FilterAlt /> : <FilterAltOutlined />}
          </IconButton>
          <IconButton onClick={() => handleOpenModal()}>
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
            value={selectedFilters}
            onChange={handleFilterCalls}
            exclusive
            aria-label='text formatting'
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
      <EditModal
        submitCall={handleAdd}
        nameOriginal={''}
        modalTitle={addModalTitle}
        open={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        descriptionOriginal={''}
      />
    </AppBar>
  );
};

export default ToolBar;
