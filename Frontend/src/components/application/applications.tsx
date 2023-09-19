import InfoCard from '../commons/card/card';
import { Alert, AlertColor, Box, Slide, Snackbar } from '@mui/material';
import DisplayDriver from '../commons/driver/displaydriver';
import styles from './applications.module.css';
import { useEffect, useState } from 'react';
import Loader from '../commons/loader/loader';
import {
  useAddApplication,
  useGetApplications,
  useUpdateApplication,
} from '../../services/applicationService';
import InfoModal from '../commons/infoModal/infoModal';
import { Application } from '../../types/application';
import { filters } from '../../utils/dataUtils';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  setApplicationId: React.Dispatch<React.SetStateAction<string | undefined>>;
}
export const Applications = ({ setApplicationId }: Props) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [severity, setSeverity] = useState<AlertColor>();
  const [params, setParams] = useState<object>();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application>();
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [editedCardName, setEditedCardName] = useState('');
  const [editedCardDescription, setEditedCardDescription] = useState('');
  const [searchText, setSearchText] = useState('');
  const [searchError, setSearchError] = useState('');
  const addMutation = useAddApplication();
  const updateMutation = useUpdateApplication();
  const { isLoading, isError, data, error } = useGetApplications(params);
  const applications = data?.applications;
  const openInfoModal = (ele) => {
    setInfoModalOpen(true);
    setSelectedApplication(ele);
  };

  const queryClient = useQueryClient();

  const handleSearch = () => {
    setParams({ ...params, search: searchText });
  };

  const handleAddMutation = async (element: Application) => {
    try {
      const applicationToPost = { ...element, code: 'cs#101' };
      const result = await addMutation.mutateAsync(applicationToPost);
      setSnackbarMessage('Application has been added successfully!');
      setSnackbarOpen(true);
      setSeverity('success');
      setIsAddModalOpen(false);
    } catch (error) {
      console.log(error.response.data.error);
      setSnackbarMessage('Error:', error.response.data.error);
      setSnackbarOpen(true);
      setSeverity('error');
    }
  };

  const handleUpdate = async (element: object) => {
    try {
      console.log(element);
      const result = await updateMutation.mutateAsync(element);
      console.log(result);
      setSnackbarMessage('Application has been updated successfully!');
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
  useEffect(() => {
    queryClient.invalidateQueries(['applications', {}]);
  }, [params]);
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
            handleUpdate={handleUpdate}
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
          setIsAddModalOpen={setIsAddModalOpen}
          isAddModalOpen={isAddModalOpen}
          handleSearch={handleSearch}
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
