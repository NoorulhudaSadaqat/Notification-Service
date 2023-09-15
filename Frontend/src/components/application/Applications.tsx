import { useEffect, useState } from 'react';

import { Alert, Box } from '@mui/material';
import DisplayDriver from '../commons/driver/displaydriver';
<<<<<<< Updated upstream
import styles from './applications.module.css';
import { useEffect, useState } from 'react';
=======
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Slide } from '@mui/material';

import {
  useAddApplication,
  useGetApplications,
  useUpateApplication,
} from '../../services/applicationService';

>>>>>>> Stashed changes
import Loader from '../commons/loader/loader';
import InfoModal from '../commons/infoModal/infoModal';
import InfoCard from '../commons/card/card';
import { Application } from '../../types/application';
import { filters } from '../../utils/dataUtils';
<<<<<<< Updated upstream
import { useQueryClient } from '@tanstack/react-query';

=======
import styles from './applications.module.css';
import { useQueryClient } from '@tanstack/react-query';
>>>>>>> Stashed changes
interface Props {
  setApplicationId: React.Dispatch<React.SetStateAction<string | undefined>>;
}
export const Applications = ({ setApplicationId }: Props) => {
<<<<<<< Updated upstream
  const [params, setParams] = useState<object>({});
=======
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [params, setParams] = useState<object>();
>>>>>>> Stashed changes
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application>();
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [editedCardName, setEditedCardName] = useState('');
  const [editedCardDescription, setEditedCardDescription] = useState('');
  const [searchText, setSearchText] = useState('');
  const [searchError, setSearchError] = useState('');
<<<<<<< Updated upstream
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
=======
  const [severity, setSeverity] = useState('success');
  const { isLoading, isError, data, error } = useGetApplications(params);
  const addApplicationMutation = useAddApplication();
  const updateApplicationMutation = useUpateApplication();
  const applications = data?.applications;
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries(['applications', data]);
  }, [params]);

  const openInfoModal = (ele: Application) => {
    setInfoModalOpen(true);
    setSelectedApplication(ele);
  };
  const handleAddApplication = (application: Application) => {
    const applicationToBePosted = { ...application, code: 'cs#101' };
    console.log('Application to be added:', applicationToBePosted);
    // addApplicationMutation.mutate(applicationToBePosted, {
    //   onSuccess: () => {
    //     setSeverity('success');
    //     console.log('Application addedx');
    //     setSnackbarMessage('Application added successfully.');
    //     setSnackbarOpen(true);
    //   },
    //   onError: () => {
    //     setSeverity('error');
    //     setSnackbarMessage(`Error!, ${error.message}`);
    //     setSnackbarOpen(true);
    //   },
    // });
    const { error } = addApplicationMutation.mutate(applicationToBePosted);
    // console.log(error);
  };

  const handleUpdateApplication = (application: Application) => {
    const { isLoading, error, isError } =
      updateApplicationMutation(application);
  };
>>>>>>> Stashed changes

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
            handleUpdate={handleUpdateApplication}
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
          <MuiAlert
            elevation={6}
            variant='filled'
            onClose={() => setSnackbarOpen(false)}
            severity={severity}
          >
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>

        <DisplayDriver
          handleAdd={handleAddApplication}
          params={params!}
          setParams={setParams}
          filters={filters}
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
          addModalTitle={'Add Application'}
          toolBarTitle={'Applications'}
          setSearchError={setSearchError}
          searchError={searchError}
        />
      </Box>
    </>
  );
};
