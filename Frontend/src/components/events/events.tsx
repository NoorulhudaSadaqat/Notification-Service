import { useState } from 'react';
import { Box } from '@mui/material';
import GridComponent from '../commons/grid/grid';
import DisplayDriver from '../commons/driver/displaydriver';
import styles from './Events.module.css';
const Events = () => {
  const [data, setData] = useState([
    {
      id: 1,
      name: 'event-name-1',
      description: 'description',
      isActive: true,
    },
    {
      id: 2,
      name: 'event-name-1',
      description: 'description',
      isActive: true,
    },
    {
      id: 3,
      name: 'event-name-1',
      description: 'description',
      isActive: true,
    },
    {
      id: 4,
      name: 'event-name-1',
      description: 'description',
      isActive: true,
    },
    {
      id: 5,
      name: 'event-name-1',
      description: 'description',
      isActive: true,
    },
    {
      id: 6,
      name: 'event-nfae-1',
      description: 'description',
      isActive: true,
    },
    {
      id: 7,
      name: 'event-name-1',
      description: 'description',
      isActive: true,
    },
    {
      id: 8,
      name: 'event-name-1',
      description: 'description',
      isActive: true,
    },
    {
      id: 9,
      name: 'event-name-1',
      description: 'description',
      isActive: true,
    },
    {
      id: 10,
      name: 'event-name-1',
      description: 'description',
      isActive: true,
    },
    {
      id: 12,
      name: 'event-name-1',
      description: 'description',
      isActive: true,
    },
    {
      id: 13,
      name: 'event-name-1',
      description: 'description',
      isActive: true,
    },
    {
      id: 14,
      name: 'event-name-1',
      description: 'description',
      isActive: true,
    },
    {
      id: 15,
      name: 'event-name-1',
      description: 'description',
      isActive: true,
    },
    {
      id: 16,
      name: 'event-name-1',
      description: 'description',
      isActive: true,
    },
    {
      id: 17,
      name: 'event-name-1',
      description: 'description',
      isActive: true,
    },
    {
      id: 18,
      name: 'event-name-1',
      description: 'description',
      isActive: true,
    },
    {
      id: 19,
      name: 'event-name-1',
      description: 'description',
      isActive: true,
    },
    {
      id: 20,
      name: 'event-name-1',
      description: 'description',
      isActive: true,
    },
    {
      id: 11,
      name: 'event-came-1',
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
      <div className={styles.heightControl}>
        <DisplayDriver
          AddModalId={2}
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
          modalTitle={'Edit Events'}
          toolBarTitle={'Events'}
        />
      </div>
    </>
  );
};

export default Events;
