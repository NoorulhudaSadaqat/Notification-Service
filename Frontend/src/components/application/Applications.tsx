import InfoCard from '../commons/card/card';
import { Alert, Box } from '@mui/material';
import DisplayDriver from '../commons/driver/displaydriver';
import styles from './applications.module.css';
import { useEffect, useState } from 'react';
import Loader from '../commons/loader/loader';
import { useGetApplications } from '../../services/applicationService';
import InfoModal from '../commons/infoModal/infoModal';
import { Application } from '../../types/application';
import { filters } from '../../utils/dataUtils';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  setApplicationId: React.Dispatch<React.SetStateAction<string | undefined>>;
}
export const Applications = ({ setApplicationId }: Props) => {
  const [params, setParams] = useState<object>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application>();
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [editedCardName, setEditedCardName] = useState('');
  const [editedCardDescription, setEditedCardDescription] = useState('');
  const [searchText, setSearchText] = useState('');
  const [searchError, setSearchError] = useState('');
  const {
    isLoading,
    isError,
    data: applications,
    error,
  } = useGetApplications(params);

  const openInfoModal = (ele) => {
    setInfoModalOpen(true);
    setSelectedApplication(ele);
  };
  const queryClient = useQueryClient();

  // Use a useEffect hook to invalidate the query when params change
  useEffect(() => {
    // Invalidate the query with the key 'applications'
    console.log(params);
    queryClient.invalidateQueries(['applications', {}]);
  }, [params]); // Listen for changes in the params object

  const renderComponent = () => {
    if (isError) {
      return (
        <>
          <Alert severity='error'>
            <strong>
              Error! {error.name}, {error.message}
            </strong>
          </Alert>
        </>
      );
    }
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
          setParams={setParams}
          filters={filters}
          AddModalId={1}
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
