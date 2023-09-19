import React, { useEffect, useState } from 'react';
import { Alert, Box, Slide, Snackbar } from '@mui/material';
import GridComponent from '../commons/grid/grid';
import DisplayDriver from '../commons/driver/displaydriver';
import styles from './Events.module.css';
import { Event } from '../../types/event';
import Loader from '../commons/loader/loader';
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import { useGetEvents } from '../../services/applicationService';
import InfoModal from '../commons/infoModal/infoModal';
import { filters } from '../../utils/dataUtils';
import { useQueryClient } from '@tanstack/react-query';
import { useAddEvents, useUpdateEvents } from '../../services/eventService';

interface Props {
  applicationId: string | undefined;
  setEventId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const Events = ({ applicationId, setEventId }: Props) => {
  const [params, setParams] = useState<object>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [searchText, setSearchText] = useState('');
  const [editedCardName, setEditedCardName] = useState('');
  const [editedCardDescription, setEditedCardDescription] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event>();
  const [severity, setSeverity] = useState<AlertColor>('success');
  const { isLoading, isError, data, error } = useGetEvents(
    applicationId,
    params
  );
  const eventUpdateMutation = useUpdateEvents();
  const addEventMutation = useAddEvents();
  const events = data?.events;
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries([
      'events',
      applicationId,
      'applications',
      data,
    ]);
  }, [params]);
  const handleSearch = () => {
    setParams({ ...params, search: searchText });
  };

  const handleAddEvents = (event) => {
    const { isLoading, isError, error } = addEventMutation.mutate(event);
  };
  const handleUpdateEvent = (event) => {
    const { isLoading, isError, error } = eventUpdateMutation.mutate(event);
  };
  const eventIdSetter = (id: string | undefined) => {
    setEventId(id);
  };

  const openInfoModal = (ele) => {
    setInfoModalOpen(true);
    setSelectedEvent(ele);
  };

  const renderComponent = () => {
    console.log(applicationId);
    if (isLoading) {
      return (
        <Box>
          <Loader />
        </Box>
      );
    }
    if (events?.length === 0) {
      return (
        <Box sx={{ marginTop: '10px' }}>
          <Alert
            severity='warning'
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            No events found! To add events press the Add Icon.
          </Alert>
        </Box>
      );
    }

    return (
      <Box>
        <GridComponent
          handleUpdate={handleUpdateEvent}
          openInfoModal={openInfoModal}
          data={events}
          setId={eventIdSetter}
          setEditedCardName={setEditedCardName}
          setEditedCardDescription={setEditedCardDescription}
          setIsModalOpen={setIsModalOpen}
        />
      </Box>
    );
  };

  function handleAddEvent(element: Event | Application | Notification): void {
    throw new Error('Function not implemented.');
  }

  return (
    <>
      <Box>
        {infoModalOpen && (
          <InfoModal
            type={'Event'}
            infoModalOpen={infoModalOpen}
            setInfoModalOpen={setInfoModalOpen}
            data={selectedEvent}
          />
        )}
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000} // Adjust the duration as needed
        onClose={() => setSnackbarOpen(false)}
        TransitionComponent={Slide}
      >
        <MuiAlert
          elevation={6}
          variant='filled'
          onClose={() => setSnackbarOpen(false)}
          severity={severity}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
      <div className={styles.heightControl}>
        <DisplayDriver
          handleSearch={handleSearch}
          handleAdd={handleAddEvent}
          setParams={setParams}
          params={params!}
          setSearchError={setSearchError}
          searchError={searchError}
          filters={filters}
          addModalTitle={'Add New Events'}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          setSearchText={setSearchText}
          data={events}
          editedCardName={editedCardName}
          editedCardDescription={editedCardDescription}
          setEditedCardName={setEditedCardName}
          setEditedCardDescription={setEditedCardDescription}
          renderComponent={renderComponent}
          modalTitle={'Edit Events'}
          toolBarTitle={'Events'}
        />
      </div>
    </>
  );
};

export default Events;
