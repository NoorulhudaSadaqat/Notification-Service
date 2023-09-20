import InfoCard from '../commons/card/card';
import {
  Alert,
  AlertColor,
  Box,
  Button,
  IconButton,
  Slide,
  Snackbar,
  Typography,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import DisplayDriver from '../commons/driver/displaydriver';
import styles from './applications.module.css';
import { useEffect, useState } from 'react';
import Loader from '../commons/loader/loader';
import {
  useAddApplication,
  useDeleteApplication,
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
  const [idsToDelete, setIdsToDelete] = useState<string[]>([]);
  const [elementToEdit, setElementToEdit] = useState<object>();
  const addMutation = useAddApplication();
  const queryClient = useQueryClient();
  const updateMutation = useUpdateApplication();
  const deleteMutation = useDeleteApplication();
  const { isLoading, data } = useGetApplications(params);
  const applications = data?.applications;
  const openInfoModal = (ele: Application) => {
    setInfoModalOpen(true);
    setSelectedApplication(ele);
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(idsToDelete);
      setSnackbarMessage(
        `${idsToDelete} application(s) have been deleted successfully!`
      );
      setSnackbarOpen(true);
      setSeverity('success');
    } catch (error) {
      setSnackbarMessage('Error:', error.response.data.error);
      setSnackbarOpen(true);
      setSeverity('error');
    }
  };
  const text =
    idsToDelete.length === 0 ? (
      <Typography sx={{ color: 'black' }}>Applications</Typography>
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
      setSnackbarMessage(`Error:, ${error.response.data.error}`);
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
    queryClient.invalidateQueries(['applications']);
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
            setElement={setElementToEdit}
            setSelectedCards={setIdsToDelete}
            selectedCards={idsToDelete}
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
            data={selectedApplication}
          />
        )}

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
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
          element={elementToEdit!}
          setElement={setElementToEdit}
          selectedCardIds={idsToDelete}
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
          renderComponent={renderComponent}
          modalTitle={'Edit Application'}
          toolBarTitle={text}
          setSearchError={setSearchError}
          searchError={searchError}
        />
      </Box>
    </>
  );
};
