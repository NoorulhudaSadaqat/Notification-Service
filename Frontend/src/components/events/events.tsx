import React, { useEffect, useState } from 'react';
import { Alert, Box } from '@mui/material';
import GridComponent from '../commons/grid/grid';
import DisplayDriver from '../commons/driver/displaydriver';
import styles from './Events.module.css';
import { Event } from '../../types/event';
import Loader from '../commons/loader/loader';
import { useGetEvents } from '../../services/applicationService';
import InfoModal from '../commons/infoModal/infoModal';
import { filters } from '../../utils/dataUtils';
interface Props {
  applicationId: string | undefined;
  setEventId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const Events = ({ applicationId, setEventId }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [searchText, setSearchText] = useState('');
  const [editedCardName, setEditedCardName] = useState('');
  const [editedCardDescription, setEditedCardDescription] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event>();
  const { isLoading, isError, data, error } = useGetEvents(applicationId);
  const events = data?.events;

  const eventIdSetter = (id: string | undefined) => {
    setEventId(id);
    console.log(id);
  };

  const openInfoModal = (ele) => {
    setInfoModalOpen(true);
    setSelectedEvent(ele);
  };

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
      <div className={styles.heightControl}>
        <DisplayDriver
          setSearchError={setSearchError}
          searchError={searchError}
          filters={filters}
          AddModalId={2}
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
