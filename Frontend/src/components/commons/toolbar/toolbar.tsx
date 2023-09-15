<<<<<<< Updated upstream
import React, { useEffect, useState } from 'react';
=======
import React, { ContextType, useState } from 'react';
>>>>>>> Stashed changes
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
  Close,
  CreateRounded,
  EditNote,
  FilterAlt,
  FilterAltOutlined,
} from '@mui/icons-material';
import EditModal from '../modal/modal';
import { Application } from '../../../types/application';
import { Event } from '../../../types/event';
const inputStyles = {
  backgroundColor: 'white', // Background color for the search input
  '&:hover': {
    backgroundColor: 'white', // Hover background color
  },
};

interface Props {
  modalTitle: string;
  params: object;
  filters: string[];
  onSearch: () => void;
  searchText: string;
  setSearchText: (text: string) => void;
  text: string;
  setParams: React.Dispatch<React.SetStateAction<object>>;
  handleAdd: (element: Application | Event | Notification) => void;
}

const ToolBar = ({
  handleAdd,
  modalTitle,
  params,
  setParams,
  filters,
  onSearch,
  searchText,
  setSearchText,
  text,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortBy, setSortBy] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterButtonPressed, setFilterButtonPressed] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState<string>();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
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
    setIsModalOpen(true);
  };

  const handleFilter = () => {
    setFilterButtonPressed(!filterButtonPressed);
  };

  const handleFilterCalls = (
    event: React.MouseEvent<HTMLElement>,
    newFilterCall: string
  ) => {
<<<<<<< Updated upstream
    setParams({ sortBy: newFilterCalls[0] });
=======
    if (!newFilterCall && !params.sortBy) {
      console.log('here');
      delete params.sortBy;
      setParams({ ...params });
    }
    setParams({ ...params, sortBy: newFilterCall });
>>>>>>> Stashed changes
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
            <ToggleButton value='' aria-label='close'>
              <>
                <Close />
                <Typography sx={{ color: 'black' }}>Cancel</Typography>
              </>
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      )}
      {isModalOpen && (
        <EditModal
          handleSubmitElement={handleAdd}
          modalTitle={modalTitle}
          nameOriginal={''}
          descriptionOriginal={''}
          open={isModalOpen}
          handleClose={() => setIsModalOpen(false)}
        />
      )}
    </AppBar>
  );
};

export default ToolBar;
