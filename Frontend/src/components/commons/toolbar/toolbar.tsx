import { useState } from 'react';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import AddIcon from '@mui/icons-material/Add';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Box, Typography } from '@mui/material';
import EditModal from '../modal/modal';

const inputStyles = {
  backgroundColor: 'white', // Background color for the search input
  '&:hover': {
    backgroundColor: 'white', // Hover background color
  },
};

interface Props {
  AddModalId: number;
  onSearch: () => void;
  text: string;
  searchText: string;
  setSearchText: (text: string) => void;
}

const ToolBar = ({
  onSearch,
  searchText,
  setSearchText,
  text,
  AddModalId,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortBy, setSortBy] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  function titleModal() {
    if (AddModalId === 1) {
      return 'Add New Application';
    } else if (AddModalId === 2) {
      return 'Add New Event';
    } else if (AddModalId === 3) {
      return 'Add New Notification';
    } else {
      return 'Undefined';
    }
  }

  return (
    <AppBar position='static' sx={{ backgroundColor: 'white' }}>
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
            <MenuItem onClick={() => handleSortOptionClick('option1')}>
              Sort Option 1
            </MenuItem>
            <MenuItem onClick={() => handleSortOptionClick('option2')}>
              Sort Option 2
            </MenuItem>
          </Menu>
          <IconButton onClick={() => handleOpenModal(AddModalId)}>
            <AddIcon />
          </IconButton>
        </Box>
      </Toolbar>
      <EditModal
        modalTitle={titleModal()}
        id={1}
        open={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
      />
    </AppBar>
  );
};

export default ToolBar;
