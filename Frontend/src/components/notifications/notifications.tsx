import { useState, useEffect, useRef } from 'react';
import { Alert, Box, Slide, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import GridComponent from '../commons/grid/grid';
import DisplayDriver from '../commons/driver/displaydriver';
import { useGetNotifications } from '../../services/eventService';
import Loader from '../commons/loader/loader';
import InfoModal from '../commons/infoModal/infoModal';
import { filters } from '../../utils/dataUtils';
import { useQueryClient } from '@tanstack/react-query';
import { useAddNotifications } from '../../services/notificationService';
import { Notification } from '../../types/notification';
interface Props {
  eventId: string | undefined;
  setNotificationId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const Notifications = ({ eventId, setNotificationId }: Props) => {
  const [params, setParams] = useState<object>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [selectedNotification, setSelectedNotification] =
    useState<Notification>();
  const [searchError, setSearchError] = useState('');
  const [searchText, setSearchText] = useState('');
  const [editedCardName, setEditedCardName] = useState('');
  const [editedCardDescription, setEditedCardDescription] = useState('');
  const [renderNotifications, setRenderNotifications] = useState(true);
  const { isLoading, data, isError, error } = useGetNotifications(
    eventId,
    params
  );
  const notifications = data?.notificationTypes;
  const queryClient = useQueryClient();
  const addNotificationMutation = useAddNotifications();

  useEffect(() => {
    queryClient.invalidateQueries([
      'events',
      eventId,
      'notification-types',
      data,
    ]);
  }, [params]);

  const handleAddNotifications = (notification: Notification) => {
    const { isLoading, isError, error } =
      addNotificationMutation.mutate(notification);
    //TODO: onSuccess setSnackBar to be visible, and time it out, close the modal
  };
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
          handleUpdate={() => {}}
          openInfoModal={openInfoModal}
          data={notifications}
          setId={notificationIdSetter}
          setEditedCardName={setEditedCardName}
          setEditedCardDescription={setEditedCardDescription}
          setIsModalOpen={setIsModalOpen}
        />
      </Box>
    );
  };

  function handleAddNotification(
    element: Application | Event | Notification
  ): void {
    throw new Error('Function not implemented.');
  }

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
                severity='success'
              >
                {snackbarMessage}
              </Alert>
            </Snackbar>
            <DisplayDriver
              handleSearch={handleSearch}
              handleAdd={handleAddNotifications}
              params={params!}
              setParams={setParams}
              filters={filters}
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
              toolBarTitle={'Notifications'}
            />
          </Box>
        </>
      )}
    </>
  );
};

export default Notifications;
