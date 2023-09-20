import React, { useEffect, useState } from 'react';
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
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import {
  Check,
  CreateRounded,
  EditNote,
  FilterAlt,
  FilterAltOutlined,
} from '@mui/icons-material';
import EditModal from '../modal/modal';
import { Application } from '../../../types/application';
import { filters } from '../../../utils/dataUtils';

const inputStyles = {
  backgroundColor: 'white',
  '&:hover': {
    backgroundColor: 'white',
  },
};

interface Props {
  addModalTitle: string;
  isAddModalOpen: boolean;
  setIsAddModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSearch: () => void;
  searchText: string;
  setSearchText: (text: string) => void;
  params: object;
  text: JSX.Element;
  setParams: React.Dispatch<React.SetStateAction<object>>;
  handleAdd: (element: Application | Event | Notification) => void;
  handleSearch: () => void;
}

const ToolBar = ({
  isAddModalOpen,
  params,
  searchText,
  text,
  addModalTitle,
  setIsAddModalOpen,
  handleSearch,
  setParams,
  handleAdd,
  onSearch,
  setSearchText,
}: Props) => {
  const selectedFilters = '';
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterBy, setFilterBy] = useState('');
  const [filterButtonPressed, setFilterButtonPressed] = useState(true);
  const [sortingOrder, setSortingOrder] = useState<'ascending' | 'descending'>(
    'ascending'
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 3) {
      setSearchText(e.target.value);
      handleSearch();
    }
  };

  const handleSortClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setAnchorEl(null);
  };

  const handleSortOptionClick = () => {
    const newSortingOrder =
      sortingOrder === 'ascending' ? 'descending' : 'ascending';

    setSortingOrder(newSortingOrder);
    if (!params?.sortBy) {
      setParams({ ...params, sortBy: 'isActive', sortOrder: newSortingOrder });
    } else {
      setParams({ ...params, sortOrder: newSortingOrder });
    }
    setAnchorEl(null);
  };

  const handleFilterCalls = (
    event: React.MouseEvent<HTMLElement>,
    newFilterCalls: string
  ) => {
    setParams({ ...params, sortBy: newFilterCalls });
  };

  useEffect(() => {
    if (!filterButtonPressed) {
      setParams({});
    }
  }, [filterButtonPressed]);

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
        <Box>{text}</Box>

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
          <IconButton
            onClick={() => {
              setFilterButtonPressed(!filterButtonPressed);
            }}
          >
            {!filterButtonPressed ? <FilterAlt /> : <FilterAltOutlined />}
          </IconButton>
          <IconButton
            onClick={() => {
              handleSortOptionClick(filterBy);
            }}
          >
            {sortingOrder === 'ascending' ? (
              <ArrowUpwardIcon />
            ) : (
              <ArrowDownwardIcon />
            )}
          </IconButton>
          <IconButton
            onClick={() => {
              setIsAddModalOpen(true);
            }}
          >
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
        open={isAddModalOpen}
        handleClose={() => setIsAddModalOpen(false)}
        descriptionOriginal={''}
      />
    </AppBar>
  );
};

export default ToolBar;
