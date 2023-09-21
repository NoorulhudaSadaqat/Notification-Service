import React from 'react';
import {
  Box,
  IconButton,
  Modal,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Application } from '../../../types/application';
import { Event } from '../../../types/event';
import { Notification } from '../../../types/notification';
import styles from './infoModal.module.css';
import { CloseOutlined } from '@mui/icons-material';
interface Props {
  setInfoModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: (Application | Event | Notification) | undefined;
  infoModalOpen: boolean;
  type: string;
}

const InfoModal = ({ infoModalOpen, setInfoModalOpen, data, type }: Props) => {
  const theme = useTheme();
  const isScreenLarge = useMediaQuery(theme.breakpoints.up('sm'));
  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',

    width: isScreenLarge ? '30vw' : '90vw',
    height: isScreenLarge ? '50vh' : '70vh',
    margin: isScreenLarge ? '' : '0 1rem',
    bgcolor: 'white',
    boxShadow: 24,
    p: 4,
    borderRadius: 8,
  };
  return (
    <div>
      <Modal
        open={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography
                id='modal-modal-title'
                variant='h5'
                sx={{ fontSize: '14px' }}
              >
                {type}
              </Typography>
              {data?.code && (
                <Typography
                  id='modal-modal-title'
                  variant='h6'
                  component='h2'
                  sx={{
                    fontSize: '1.25rem', // Customize font size for code
                  }}
                >
                  code: {data?.code}
                </Typography>
              )}
            </Box>

            <IconButton
              aria-label='close'
              sx={{ cursor: 'pointer' }}
              onClick={() => setInfoModalOpen(false)}
            >
              <CloseOutlined sx={{ cursor: 'pointer' }} />
            </IconButton>
          </Box>

          <div className={styles.colorBand}></div>
          <Typography
            id='modal-modal-title'
            variant='h6'
            component='h2'
            sx={{
              fontSize: '3rem',
              fontWeight: 'bold',
            }}
          >
            {data?.name}
          </Typography>
          <Typography
            id='modal-modal-description'
            sx={{
              mt: 2,
              fontSize: '16px',
              fontWeight: 'lighter',
            }}
          >
            {data?.description}
          </Typography>

          <Typography id='modal-modal-description' sx={{ mt: 2 }}>
            <strong>Created By: </strong>
            {data?.createdBy}
          </Typography>
          <Typography id='modal-modal-description' sx={{ mt: 2 }}>
            <strong>Created Date: </strong>
            {data?.createdDate}
          </Typography>
          <Typography id='modal-modal-description' sx={{ mt: 2 }}>
            <strong>Modified By: </strong>
            {data?.modifiedBy}
          </Typography>
          <Typography id='modal-modal-description' sx={{ mt: 2 }}>
            <strong>Modified Date: </strong>
            {data?.modifiedDate}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default InfoModal;
