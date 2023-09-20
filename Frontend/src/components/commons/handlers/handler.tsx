import React, { useState } from 'react';
import {
  Box,
  Switch,
  Tooltip, // Import Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditRoundedIcon from '@mui/icons-material/Edit';

interface Props {
  isActive: boolean | undefined;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: (e: boolean) => void;
}

const HandlerButtons = ({
  isActive,
  onEdit,
  onDelete,
  onToggleActive,
}: Props) => {
  const [editTooltipOpen, setEditTooltipOpen] = useState(false);
  const [deleteTooltipOpen, setDeleteTooltipOpen] = useState(false);
  const [toggleActiveOpen, setToggleActiveOpen] = useState(false);
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 3,
        }}
      >
        {/* Edit Icon with Tooltip */}
        <Tooltip
          title='Edit'
          arrow
          open={editTooltipOpen}
          onClose={() => setEditTooltipOpen(false)}
        >
          <EditRoundedIcon
            sx={{ fontSize: 18, cursor: 'pointer', marginLeft: 'auto' }}
            onClick={onEdit}
            onMouseEnter={() => setEditTooltipOpen(true)} // Show tooltip on mouse enter
          />
        </Tooltip>

        {/* Delete Icon with Tooltip */}
        <Tooltip
          title='Delete'
          arrow
          open={deleteTooltipOpen}
          onClose={() => setDeleteTooltipOpen(false)}
        >
          <DeleteIcon
            sx={{ fontSize: 18, color: 'red', cursor: 'pointer' }}
            onClick={onDelete}
            onMouseEnter={() => setDeleteTooltipOpen(true)} // Show tooltip on mouse enter
          />
        </Tooltip>

        {/* Switch */}
        <Tooltip
          title='Toggle Active'
          arrow
          open={toggleActiveOpen}
          onClose={() => setToggleActiveOpen(false)}
        >
          <Switch
            checked={isActive}
            inputProps={{ 'aria-label': 'controlled' }}
            onMouseEnter={() => setToggleActiveOpen(true)} // Show tooltip on mouse enter
            size='small'
            sx={{ color: 'red', cursor: 'pointer' }}
            onClick={() => onToggleActive(isActive)}
          />
        </Tooltip>
      </Box>
    </>
  );
};

export default HandlerButtons;
