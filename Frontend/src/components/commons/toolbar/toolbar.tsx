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
  useTheme,
  useMediaQuery,
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
  ToggleOn,
  ToggleOff,
} from '@mui/icons-material';
import EditModal from '../modal/modal';
import { Application } from '../../../types/application';
import { useNavigate } from 'react-router-dom';

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
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  params: object;
  text: JSX.Element;
  setParams: React.Dispatch<React.SetStateAction<object>>;
  handleAdd: (element: Application | Event | Notification) => void;
  handleSearch: () => void;
  eventId: string;
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
  eventId,
}: Props) => {
  const selectedFilters = '';
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterBy, setFilterBy] = useState('');
  const [filterButtonPressed, setFilterButtonPressed] = useState(true);
  const [activeTrue, setActiveTrue] = useState(true);
  const [sortingOrder, setSortingOrder] = useState<'ascending' | 'descending'>(
    'ascending'
  );
  const theme = useTheme();
  const navigate = useNavigate();
  const isScreenLarge = useMediaQuery(theme.breakpoints.up('sm'));
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    if (e.target.value.length < 3) {
      delete params.search;
    }
    if (e.target.value.length > 3) {
      handleSearch();
    }
  };

  const handleSortClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setAnchorEl(null);
  };

  const handleActiveTrue = () => {
    setActiveTrue(!activeTrue);
    setAnchorEl(null);
    setParams({ ...params, isActive: !activeTrue });
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
  const [showSearchInput, setShowSearchInput] = useState(false);

  const handleSearchClick = () => {
    setShowSearchInput(!showSearchInput);
  };

  const closeSearchInput = () => {
    setShowSearchInput(false);
  };
  useEffect(() => {
    if (!filterButtonPressed) {
      delete params.sortBy;
      delete params.sortOrder;
    }
  }, [filterButtonPressed]);
  return (
    <AppBar
      position='static'
      sx={{
        backgroundColor: 'white',
        height: filterButtonPressed
          ? '4rem'
          : `${isScreenLarge ? '8rem' : '14rem'}`,
        transition: 'height 0.25s ease',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box>{!showSearchInput && text}</Box>

        {isScreenLarge ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {showSearchInput ? (
              <>
                <InputBase
                  placeholder='Search…'
                  sx={inputStyles}
                  inputProps={{ 'aria-label': 'search' }}
                  value={searchText}
                  onChange={handleInputChange}
                />
                <IconButton onClick={handleSearchClick} aria-label='search'>
                  <SearchIcon />
                </IconButton>
              </>
            ) : (
              <IconButton onClick={handleSearchClick} aria-label='search'>
                <SearchIcon />
              </IconButton>
            )}
            <IconButton
              aria-label='sort'
              onClick={handleActiveTrue}
              aria-controls='sort-menu'
              aria-haspopup='true'
            >
              {activeTrue ? (
                <ToggleOn sx={{ color: '#007fff' }} />
              ) : (
                <ToggleOff />
              )}
            </IconButton>

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
                if (text.props.children == 'Notifications') {
                  navigate(`notfication/${eventId}/edit/${-1}`);
                } else {
                  setIsAddModalOpen(true);
                }
              }}
            >
              <AddIcon />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {showSearchInput && (
              <>
                <InputBase
                  placeholder='Search…'
                  sx={inputStyles}
                  inputProps={{ 'aria-label': 'search' }}
                  value={searchText}
                  onChange={handleInputChange}
                />
                <IconButton onClick={handleSearchClick} aria-label='search'>
                  <SearchIcon />
                </IconButton>
              </>
            )}
            <IconButton
              onClick={handleSortClick}
              aria-label='more options'
              aria-controls='small-screen-menu'
              aria-haspopup='true'
            >
              <SortIcon />
            </IconButton>
            <Menu
              id='small-screen-menu'
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleSortClose}
            >
              <MenuItem onClick={handleSearchClick}>
                <SearchIcon />
                Search
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setFilterButtonPressed(!filterButtonPressed);
                  handleSortClose();
                }}
              >
                {!filterButtonPressed ? <FilterAlt /> : <FilterAltOutlined />}
                Filter
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleSortOptionClick(filterBy);
                  handleSortClose();
                }}
              >
                {sortingOrder === 'ascending' ? (
                  <ArrowUpwardIcon />
                ) : (
                  <ArrowDownwardIcon />
                )}
                Sort
              </MenuItem>
              <MenuItem
                onClick={() => {
                  if (text.props.children == 'Notifications') {
                    navigate(`notfication/${eventId}/edit/${-1}`);
                  } else {
                    setIsAddModalOpen(true);
                  }
                  handleSortClose();
                }}
              >
                <AddIcon />
                Add
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
      {!filterButtonPressed && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: isScreenLarge ? 'row' : 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginInline: '1rem',
            marginBlock: '0.5rem',
          }}
        >
          <ToggleButtonGroup
            orientation={`${isScreenLarge ? 'horizontal' : 'vertical'}`}
            value={selectedFilters}
            onChange={handleFilterCalls}
            exclusive
            aria-label='text formatting'
          >
            <ToggleButton value='isActive' aria-label='isActive'>
              <>
                <Check />
                <Typography
                  sx={{
                    color: 'black',
                  }}
                >
                  Active
                </Typography>
              </>
            </ToggleButton>
            <ToggleButton value='createdAt' aria-label='createdAt'>
              <>
                <Typography
                  sx={{
                    color: 'black',
                  }}
                >
                  Created At
                </Typography>
                <CreateRounded />
              </>
            </ToggleButton>
            <ToggleButton value='modifiedAt' aria-label='modifiedAt'>
              <>
                <Typography
                  sx={{
                    color: 'black',
                  }}
                >
                  Modified At
                </Typography>
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

{
  /* <IconButton
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
              </Menu> */
}
