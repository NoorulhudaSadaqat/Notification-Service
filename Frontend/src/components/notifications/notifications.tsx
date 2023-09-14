import { useState, useEffect, useRef } from 'react';
import { Alert, Box } from '@mui/material';
import GridComponent from '../commons/grid/grid';
import DisplayDriver from '../commons/driver/displaydriver';
import { useGetNotifications } from '../../services/eventService';
import Loader from '../commons/loader/loader';
import InfoModal from '../commons/infoModal/infoModal';
import { filters } from '../../utils/dataUtils';

interface Props {
  eventId: string | undefined;
  setNotificationId: React.Dispatch<React.SetStateAction<string | undefined>>;
  applicationId: string | undefined; // Add applicationId as a prop
}

const Notifications = ({
  eventId,
  setNotificationId,
  applicationId,
}: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification>();
  const [searchError, setSearchError] = useState('');
  const [searchText, setSearchText] = useState('');
  const [editedCardName, setEditedCardName] = useState('');
  const [editedCardDescription, setEditedCardDescription] = useState('');
  const [renderNotifications, setRenderNotifications] = useState(true);
  const { isLoading, data, isError, error } = useGetNotifications(eventId);
  const notifications = data?.notificationTypes;

  const notificationIdSetter = (id: string | undefined) => {
    setNotificationId(id);
    console.log(id);
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
                data={selectedNotification} // Pass the selected element's data to InfoModal
              />
            )}
          </Box>
          <Box sx={{ marginBlockStart: '2rem' }}>
            <DisplayDriver
              filters={filters}
              searchError={searchError}
              setSearchError={setSearchError}
              AddModalId={3}
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
