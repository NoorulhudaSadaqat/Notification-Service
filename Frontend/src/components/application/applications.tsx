import InfoCard from '../commons/card/card';
import { Alert, Box } from '@mui/material';
import DisplayDriver from '../commons/driver/displaydriver';
import styles from './applications.module.css';
import { useState } from 'react';
import Loader from '../commons/loader/loader';
import { useGetApplications } from '../../services/applicationService';
import InfoModal from '../commons/infoModal/infoModal';
import { Application } from '../../types/application';
import { filters } from '../../utils/dataUtils';

interface Props {
  setApplicationId: React.Dispatch<React.SetStateAction<string | undefined>>;
}
export const Applications = ({ setApplicationId }: Props) => {
  const [params, setParams] = useState<object>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application>();
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [editedCardName, setEditedCardName] = useState('');
  const [editedCardDescription, setEditedCardDescription] = useState('');
  const [searchText, setSearchText] = useState('');
  const [searchError, setSearchError] = useState('');
  const { isLoading, isError, data, error } = useGetApplications(params);

  const applications = data?.applications;
  const openInfoModal = (ele) => {
    setInfoModalOpen(true);
    setSelectedApplication(ele);
  };
  const renderComponent = () => {
    if (isLoading) {
      return (
        <Box>
          <Loader />
        </Box>
      );
    }

    if (applications?.length === 0) {
      return (
        <Box sx={{ marginTop: '10px' }}>
          <Alert
            severity='warning'
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            No applications found! To add applications press the Add Icon
          </Alert>
        </Box>
      );
    }

    return (
      <div className={styles.scrollControl}>
        <div className={styles.cardContainer}>
          <InfoCard
            openInfoModal={openInfoModal}
            setApplicationId={setApplicationId}
            data={applications}
            setEditedCardName={setEditedCardName}
            setEditedCardDescription={setEditedCardDescription}
            setIsModalOpen={setIsModalOpen}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <Box>
        {infoModalOpen && (
          <InfoModal
            type={'Application'}
            infoModalOpen={infoModalOpen}
            setInfoModalOpen={setInfoModalOpen}
            data={selectedApplication} // Pass the selected element's data to InfoModal
          />
        )}

        <DisplayDriver
          handleAdd={handleAddMutation}
          params={params!}
          setParams={setParams}
          filters={filters}
          addModalTitle={'Add New Applications'}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          searchText={searchText}
          setSearchText={setSearchText}
          data={applications}
          editedCardName={editedCardName}
          editedCardDescription={editedCardDescription}
          setEditedCardName={setEditedCardName}
          setEditedCardDescription={setEditedCardDescription}
          renderComponent={renderComponent}
          modalTitle={'Edit Application'}
          toolBarTitle={'Applications'}
          setSearchError={setSearchError}
          searchError={searchError}
        />
      </Box>
    </>
  );
};
