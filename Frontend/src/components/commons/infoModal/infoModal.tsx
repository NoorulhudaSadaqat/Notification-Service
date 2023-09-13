import React from 'react';
import { Box, IconButton, Modal, Typography } from '@mui/material';
import { Application } from '../../../types/application';
import { Event } from '../../../types/event';
import { Notification } from '../../../types/notification';
import styles from './infoModal.module.css';
import { CloseOutlined } from '@mui/icons-material';
interface Props {
  setInfoModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: Application | Event | Notification | undefined;
  infoModalOpen: boolean;
  type: string;
}

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  minHeight: '50vh',
  bgcolor: 'white',
  boxShadow: 24,
  p: 4,
  borderRadius: 8,
};

const InfoModal = ({ infoModalOpen, setInfoModalOpen, data, type }: Props) => {
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
            </Box>

            <IconButton aria-label='close' sx={{ cursor: 'pointer' }}>
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
