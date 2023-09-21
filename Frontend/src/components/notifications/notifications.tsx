import { useState, useEffect, useRef } from 'react';
import { Alert, Box, Button, Slide, Snackbar, Typography } from '@mui/material';
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import GridComponent from '../commons/grid/grid';
import DisplayDriver from '../commons/driver/displaydriver';
import { useGetNotifications } from '../../services/eventService';
import Loader from '../commons/loader/loader';
import InfoModal from '../commons/infoModal/infoModal';
import { filters } from '../../utils/dataUtils';
import { useQueryClient } from '@tanstack/react-query';
import { useAddNotifications } from '../../services/notificationService';
import { Notification } from '../../types/notification';
import { useUpdateApplication } from '../../services/applicationService';
import DeleteIcon from '@mui/icons-material/Delete';
interface Props {
  eventId: string | undefined;
  setNotificationId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const Notifications = ({ eventId, setNotificationId }: Props) => {
  const pageSize = 4;
  const [params, setParams] = useState<object>({ page: 1, pageSize: pageSize });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [severity, setSeverity] = useState<AlertColor>();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification>();
  const [searchError, setSearchError] = useState('');

  const [elementToEdit, setElementToEdit] = useState<object>();
  const [searchText, setSearchText] = useState('');
  const [editedCardName, setEditedCardName] = useState('');
  const [editedCardDescription, setEditedCardDescription] = useState('');
  const [renderNotifications, setRenderNotifications] = useState(true);
  const { isLoading, data, isError, error } = useGetNotifications(
    eventId,
    params
  );

  const [idsToDelete, setIdsToDelete] = useState<string[]>([]);
  const notifications = data?.notificationTypes;

  const totalPages = Math.ceil(data?.totalCount / pageSize);
  const queryClient = useQueryClient();
  const addMutation = useAddNotifications(eventId!);
  const updateMutation = useUpdateApplication(eventId!);
  useEffect(() => {
    queryClient.invalidateQueries(['events', eventId, 'data', data]);
  }, [params]);

  const handleAddNotifications = async (notification: Notification) => {
    try {
      const notificationToPost = { ...notification, eventId: eventId! };
      const result = await addMutation.mutateAsync(notificationToPost);
      setSnackbarMessage('Event has been added successfully!');
      setSnackbarOpen(true);
      setSeverity('success');
      queryClient.invalidateQueries(['events', eventId, 'data', {}]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.log(error.response.data.error);
      setSnackbarMessage('Error:', error.response.data.error);
      setSnackbarOpen(true);
      setSeverity('error');
    }
  };
  const handleUpdateNotification = async (element: Event) => {
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
      <Typography sx={{ color: 'black' }}>Notifications</Typography>
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

  const notificationIdSetter = (id: string | undefined) => {
    setNotificationId(id);
  };

  const handleSearch = () => {
    setParams({ ...params, search: searchText });
  };

  const openInfoModal = (ele) => {
    setInfoModalOpen(true);
    setSelectedNotification(ele);
  };

  const renderComponent = () => {
    if (isLoading) {
      return (
        <Box>
          <Loader />
        </Box>
      );
    }
    if (notifications?.length === 0) {
      return (
        <Box sx={{ marginTop: '10px' }}>
          <Alert
            severity='warning'
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            No notifications found! To add notifications press the Add Icon.
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
          handleUpdate={handleUpdateNotification}
          openInfoModal={openInfoModal}
          data={notifications}
          handlePagination={handlePagination}
          setId={notificationIdSetter}
          setEditedCardName={setEditedCardName}
          setEditedCardDescription={setEditedCardDescription}
          setIsModalOpen={setIsModalOpen}
        />
      </Box>
    );
  };

  return (
    <>
      {renderNotifications && (
        <>
          <Box>
            {infoModalOpen && (
              <InfoModal
                type={'Notification'}
                infoModalOpen={infoModalOpen}
                setInfoModalOpen={setInfoModalOpen}
                data={selectedNotification}
              />
            )}
          </Box>
          <Box sx={{ marginBlockStart: '2rem' }}>
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={3000} // Adjust the duration as needed
              onClose={() => setSnackbarOpen(false)}
              TransitionComponent={Slide}
            >
              <Alert
                elevation={6}
                variant='filled'
                onClose={() => setSnackbarOpen(false)}
                severity={severity}
              >
                {snackbarMessage}
              </Alert>
            </Snackbar>
            <DisplayDriver
              isAddModalOpen={isAddModalOpen}
              setIsAddModalOpen={setIsAddModalOpen}
              handleSearch={handleSearch}
              handleAdd={handleAddNotifications}
              params={params!}
              setParams={setParams}
              searchError={searchError}
              setSearchError={setSearchError}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              searchText={searchText}
              setSearchText={setSearchText}
              data={notifications}
              editedCardName={editedCardName}
              editedCardDescription={editedCardDescription}
              setEditedCardName={setEditedCardName}
              setEditedCardDescription={setEditedCardDescription}
              renderComponent={renderComponent}
              addModalTitle='Add New Notification'
              modalTitle={'Edit Notification'}
              toolBarTitle={text}
            />
          </Box>
        </>
      )}
    </>
  );
};

export default Notifications;
