import { useState } from 'react';
import { Box } from '@mui/material';
import GridComponent from '../commons/grid/grid';
import DisplayDriver from '../commons/driver/displaydriver';
const Notifications = () => {
  const [data, setData] = useState([
    {
      id: 1,
      name: 'notification-name-1',
      description: 'description',
      isActive: true,
    },
    {
      id: 2,
      name: 'notification-name-1',
      description: 'description',
      isActive: true,
    },
    {
      id: 3,
      name: 'notification-name-1',
      description: 'description',
      isActive: true,
    },
    {
      id: 4,
      name: 'notification-name-1',
      description: 'description',
      isActive: true,
    },
    {
      id: 5,
      name: 'notification-name-1',
      description: 'description',
      isActive: true,
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [editedCardName, setEditedCardName] = useState('');
  const [editedCardDescription, setEditedCardDescription] = useState('');

  const renderComponent = () => (
    <Box>
      <GridComponent
        data={data}
        setData={setData}
        editedCardName={editedCardName}
        editedCardDescription={editedCardDescription}
        setEditedCardName={setEditedCardName}
        setEditedCardDescription={setEditedCardDescription}
        setIsModalOpen={setIsModalOpen}
      />
    </Box>
  );

  return (
    <>
      <Box sx={{ marginBlockStart: '2rem' }}>
        <DisplayDriver
          AddModalId={3}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          searchText={searchText}
          setSearchText={setSearchText}
          data={data}
          setData={setData}
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
  );
};

export default Notifications;
