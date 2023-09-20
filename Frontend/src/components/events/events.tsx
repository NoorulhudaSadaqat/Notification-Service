import React, { useDeferredValue, useEffect, useState } from 'react';
import { Alert, Box, Button, Slide, Snackbar, Typography } from '@mui/material';
import GridComponent from '../commons/grid/grid';
import DisplayDriver from '../commons/driver/displaydriver';
import styles from './Events.module.css';
import { Event } from '../../types/event';
import Loader from '../commons/loader/loader';
import MuiAlert, { AlertColor } from '@mui/material/Alert';

import DeleteIcon from '@mui/icons-material/Delete';
import {
  useDeleteApplication,
  useGetEvents,
} from '../../services/applicationService';
import InfoModal from '../commons/infoModal/infoModal';
import { filters } from '../../utils/dataUtils';
import { useQueryClient } from '@tanstack/react-query';
import {
  useAddEvents,
  useDeleteEvents,
  useUpdateEvents,
} from '../../services/eventService';

interface Props {
  applicationId: string | undefined;
  setEventId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const Events = ({ applicationId, setEventId }: Props) => {
  const pageSize = 4;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [params, setParams] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [elementToEdit, setElementToEdit] = useState<object>();
  const [idsToDelete, setIdsToDelete] = useState<string[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event>();
  const [severity, setSeverity] = useState<AlertColor>('success');
  const { isLoading, isError, data, error } = useGetEvents(
    applicationId,
    params
  );
  const events = data?.events;
  const totalPages = Math.ceil(data?.totalCount / pageSize);
  const updateMutation = useUpdateEvents(applicationId!);
  const addMutation = useAddEvents(applicationId!);
  const deleteMutation = useDeleteEvents(applicationId!);
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries([
      'events',
      applicationId,
      'applications',
      {},
    ]);
  }, [params, currentPage, queryClient, applicationId]);
  useEffect(() => {
    console.log('Ids to be deleted', idsToDelete);
  }, [idsToDelete]);
  const handleSearch = () => {
    setParams({ ...params, search: searchText });
  };

  const eventIdSetter = (id: string | undefined) => {
    setEventId(id);
  };

  const openInfoModal = (ele) => {
    setInfoModalOpen(true);
    setSelectedEvent(ele);
  };

  const handleAddEvent = async (element: Event) => {
    try {
      const eventToPost = { ...element, applicationId: applicationId! };
      const result = await addMutation.mutateAsync(eventToPost);
      setSnackbarMessage('Event has been added successfully!');
      setSnackbarOpen(true);
      setSeverity('success');
      queryClient.invalidateQueries([
        'events',
        applicationId,
        'applications',
        'data',
        {},
      ]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.log(error.response.data.error);
      setSnackbarMessage(`Error: ${error.response.data.error}`);
      setSnackbarOpen(true);
      setSeverity('error');
    }
  };

  const handleUpdateEvent = async (element: Event) => {
    try {
      console.log(element);
      const result = await updateMutation.mutateAsync(element);
      console.log(result);
      setSnackbarMessage('Event has been updated successfully!');
      setSnackbarOpen(true);
      setSeverity('success');
      setIsAddModalOpen(false);
    } catch (error) {
      console.log(error);
      setSnackbarMessage(`Error!`);
      setSnackbarOpen(true);
      setSeverity('error');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(idsToDelete);
      setSnackbarMessage(
        `${idsToDelete} event(s) have been deleted successfully!`
      );
      setSnackbarOpen(true);
      setSeverity('success');
    } catch (error) {
      setSnackbarMessage(`Error: ${error.response.data.error}`);
      setSnackbarOpen(true);
      setSeverity('error');
    }
  };

  const handlePagination = (page: number): void => {
    console.log('Page: ', page);
    setCurrentPage(page);
    setParams({ ...params, pageSize: pageSize, page: currentPage });
  };
  const text =
    idsToDelete.length === 0 ? (
      <Typography sx={{ color: 'black' }}>Events</Typography>
    ) : (
      <>
        <Button
          sx={{ border: '1px red solid', color: 'red' }}
          variant='outlined'
          startIcon={<DeleteIcon sx={{ color: 'red' }} />}
          onClick={() => {
            handleDelete();
          }}
        >
          Delete {'('}
          {idsToDelete.length}
          {')'}
        </Button>
      </>
    );

  const renderComponent = () => {
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
          totalCount={data?.totalCount}
          selectedIds={idsToDelete}
          setIdsToDelete={setIdsToDelete}
          setElement={setElementToEdit}
          handleUpdate={handleUpdateEvent}
          openInfoModal={openInfoModal}
          data={events}
          setId={eventIdSetter}
          setIsModalOpen={setIsModalOpen}
          handlePageChange={handlePagination}
          currentPage={currentPage}
          totalPages={totalPages}
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
          element={elementToEdit!}
          setElement={setElementToEdit}
          isAddModalOpen={isAddModalOpen}
          setIsAddModalOpen={setIsAddModalOpen}
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
          renderComponent={renderComponent}
          modalTitle={'Edit Events'}
          toolBarTitle={text}
        />
      </div>
    </>
  );
};

export default Events;
