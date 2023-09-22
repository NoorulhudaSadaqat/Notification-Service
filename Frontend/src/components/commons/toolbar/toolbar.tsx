import React, { useEffect, useState } from "react";
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
  Tooltip, // Import Tooltip component
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
  Check,
  CreateRounded,
  EditNote,
  FilterAlt,
  FilterAltOutlined,
  ToggleOn,
  ToggleOff,
} from "@mui/icons-material";
import SortIcon from "@mui/icons-material/Sort";
import EditModal from "../modal/modal";
import { Application } from "../../../types/application";
import { useNavigate } from "react-router-dom";

const inputStyles = {
  backgroundColor: "white",
  "&:hover": {
    backgroundColor: "white",
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
  handleAdd: (element: unknown) => void;
  handleSearch: (e: string) => void;
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
  eventId,
  setSearchText,
}: Props) => {
  const selectedFilters = "";
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterBy, setFilterBy] = useState("");
  const [filterButtonPressed, setFilterButtonPressed] = useState(true);
  const [activeTrue, setActiveTrue] = useState(true);
  const [sortingOrder, setSortingOrder] = useState<"ascending" | "descending">(
    "ascending"
  );
  const theme = useTheme();
  const navigate = useNavigate();
  const isScreenLarge = useMediaQuery(theme.breakpoints.up("sm"));
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    handleSearch(e.target.value);
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
      sortingOrder === "ascending" ? "descending" : "ascending";

    setSortingOrder(newSortingOrder);
    if (!params?.sortBy) {
      setParams({ ...params, sortBy: "isActive", sortOrder: newSortingOrder });
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
      position="static"
      sx={{
        backgroundColor: "white",
        height: filterButtonPressed
          ? "4rem"
          : `${isScreenLarge ? "8rem" : "14rem"}`,
        transition: "height 0.25s ease",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box>{!showSearchInput && text}</Box>

        {isScreenLarge ? (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {showSearchInput ? (
              <>
                <Tooltip title="Search">
                  <IconButton onClick={handleSearchClick} aria-label="search">
                    <SearchIcon />
                  </IconButton>
                </Tooltip>
                <InputBase
                  placeholder="Search…"
                  sx={inputStyles}
                  inputProps={{ "aria-label": "search" }}
                  value={searchText}
                  onChange={handleInputChange}
                />
              </>
            ) : (
              <Tooltip title="Search">
                <IconButton onClick={handleSearchClick} aria-label="search">
                  <SearchIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title={activeTrue ? "Active" : "Inactive"}>
              <IconButton
                aria-label="sort"
                onClick={handleActiveTrue}
                aria-controls="sort-menu"
                aria-haspopup="true"
              >
                {activeTrue ? (
                  <ToggleOn sx={{ color: "#007fff" }} />
                ) : (
                  <ToggleOff />
                )}
              </IconButton>
            </Tooltip>

            <Tooltip title={filterButtonPressed ? "Filter On" : "Filter Off"}>
              <IconButton
                onClick={() => {
                  setFilterButtonPressed(!filterButtonPressed);
                }}
              >
                <SortIcon />
              </IconButton>
            </Tooltip>

            <Tooltip
              title={
                sortingOrder === "ascending"
                  ? "Sort Ascending"
                  : "Sort Descending"
              }
            >
              <IconButton
                onClick={() => {
                  handleSortOptionClick(filterBy);
                }}
              >
                {sortingOrder === "ascending" ? (
                  <ArrowUpwardIcon />
                ) : (
                  <ArrowDownwardIcon />
                )}
              </IconButton>
            </Tooltip>

            <Tooltip title="Add">
              <IconButton
                onClick={() => {
                  if (text.props.children == "Notifications") {
                    navigate(`notfication/${eventId}/edit/${-1}`);
                  } else {
                    setIsAddModalOpen(true);
                  }
                }}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {showSearchInput && (
              <>
                <InputBase
                  placeholder="Search…"
                  sx={inputStyles}
                  inputProps={{ "aria-label": "search" }}
                  value={searchText}
                  onChange={handleInputChange}
                />
                <IconButton onClick={handleSearchClick} aria-label="search">
                  <SearchIcon />
                </IconButton>
              </>
            )}
            <IconButton
              onClick={handleSortClick}
              aria-label="more options"
              aria-controls="small-screen-menu"
              aria-haspopup="true"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="small-screen-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleSortClose}
            >
              <MenuItem onClick={handleSearchClick}>
                <SearchIcon />
                Search
              </MenuItem>
              <MenuItem onClick={handleActiveTrue}>
                {activeTrue ? (
                  <ToggleOn sx={{ color: "#007fff" }} />
                ) : (
                  <ToggleOff />
                )}
                Active
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setFilterButtonPressed(!filterButtonPressed);
                  handleSortClose();
                }}
              >
                <SortIcon />
                Sort
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleSortOptionClick(filterBy);
                  handleSortClose();
                }}
              >
                {sortingOrder === "ascending" ? (
                  <ArrowUpwardIcon />
                ) : (
                  <ArrowDownwardIcon />
                )}
                Order By
              </MenuItem>
              <MenuItem
                onClick={() => {
                  if (text.props.children == "Notifications") {
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
            display: "flex",
            flexDirection: isScreenLarge ? "row" : "column",
            justifyContent: "center",
            alignItems: "center",
            marginInline: "1rem",
            marginBlock: "0.5rem",
          }}
        >
          <ToggleButtonGroup
            orientation={`${isScreenLarge ? "horizontal" : "vertical"}`}
            value={selectedFilters}
            onChange={handleFilterCalls}
            exclusive
            aria-label="text formatting"
          >
            <ToggleButton value="isActive" aria-label="isActive">
              <>
                <Check />
                <Typography
                  sx={{
                    color: "black",
                    marginInline: "0.5rem",
                  }}
                >
                  Active
                </Typography>
              </>
            </ToggleButton>
            <ToggleButton value="createdAt" aria-label="createdAt">
              <>
                <CreateRounded />
                <Typography
                  sx={{
                    marginInline: "0.5rem",
                    color: "black",
                  }}
                >
                  Created At
                </Typography>
              </>
            </ToggleButton>
            <ToggleButton value="modifiedAt" aria-label="modifiedAt">
              <>
                <EditNote />
                <Typography
                  sx={{
                    marginInline: "0.5rem",
                    color: "black",
                  }}
                >
                  Modified At
                </Typography>
              </>
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      )}
      <EditModal
        submitCall={handleAdd}
        nameOriginal={""}
        modalTitle={addModalTitle}
        open={isAddModalOpen}
        handleClose={() => setIsAddModalOpen(false)}
        descriptionOriginal={""}
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
