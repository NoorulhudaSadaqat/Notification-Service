import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
        }}
      >
        <Button
          sx={{
            fontSize: '1.2rem',
          }}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <KeyboardArrowLeftIcon />
        </Button>
        <Typography>{currentPage}</Typography>

        <Button
          sx={{
            fontSize: '1.2rem',
          }}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <KeyboardArrowRightIcon />
        </Button>
      </Box>
    </div>
  );
};

export default PaginationControls;
