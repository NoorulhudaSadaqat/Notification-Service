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
<<<<<<< Updated upstream
=======
import { useAddEvents, useUpdateEvents } from '../../services/eventService';

>>>>>>> Stashed changes
interface Props {
  applicationId: string | undefined;
  setEventId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const Events = ({ applicationId, setEventId }: Props) => {
<<<<<<< Updated upstream
  const [params, setParams] = useState<object>({});
=======
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [params, setParams] = useState<object>();
>>>>>>> Stashed changes
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [searchText, setSearchText] = useState('');
  const [editedCardName, setEditedCardName] = useState('');
  const [editedCardDescription, setEditedCardDescription] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event>();
<<<<<<< Updated upstream
=======
  const [severity, setSeverity] = useState<AlertColor>('success');
>>>>>>> Stashed changes
  const { isLoading, isError, data, error } = useGetEvents(
    applicationId,
    params
  );
<<<<<<< Updated upstream
=======
  const eventUpdateMutation = useUpdateEvents();
  const addEventMutation = useAddEvents();
>>>>>>> Stashed changes
  const events = data?.events;
  const queryClient = useQueryClient();

  useEffect(() => {
<<<<<<< Updated upstream
    console.log(params);
=======
>>>>>>> Stashed changes
    queryClient.invalidateQueries([
      'events',
      applicationId,
      'applications',
<<<<<<< Updated upstream
      {},
=======
      data,
>>>>>>> Stashed changes
    ]);
  }, [params]);

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

  return (
    <>
      <Box>
        {infoModalOpen && (
          <InfoModal
            type={'Event'}
            infoModalOpen={infoModalOpen}
            setInfoModalOpen={setInfoModalOpen}
            data={selectedEvent} // Pass the selected element's data to InfoModal
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
<<<<<<< Updated upstream
=======
          handleAdd={handleAddEvents}
          params={params!}
>>>>>>> Stashed changes
          setParams={setParams}
          setSearchError={setSearchError}
          searchError={searchError}
          filters={filters}
          addModalTitle={'Add Event'}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          searchText={searchText}
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
