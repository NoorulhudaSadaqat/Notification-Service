import InfoCard from '../commons/card/card';
import { Box } from '@mui/material';
import DisplayDriver from '../commons/driver/displaydriver';
import styles from './applications.module.css';
import { useState } from 'react';
import { Application } from '../../types/application';
import Loader from '../commons/loader/loader';
interface Props {
  data: Application[] | undefined;
  setData: React.Dispatch<React.SetStateAction<Application[] | undefined>>;
  applicationID: string | undefined;
  setApplicationID: React.Dispatch<React.SetStateAction<string | undefined>>;
  isLoading: boolean;
}
const Applications = ({
  data,
  setData,
  isLoading,

  setApplicationID,
}: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedCardName, setEditedCardName] = useState('');
  const [editedCardDescription, setEditedCardDescription] = useState('');
  const [searchText, setSearchText] = useState('');

  const renderComponent = () => {
    if (isLoading) {
      return (
        <Box>
          <Loader />
        </Box>
      );
    }

    return (
      <div className={styles.scrollControl}>
        <div className={styles.cardContainer}>
          <InfoCard
            setApplicationID={setApplicationID}
            data={data}
            setData={setData}
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
        <DisplayDriver
          AddModalId={1}
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
          modalTitle={'Edit Application'}
          toolBarTitle={'Applications'}
        />
      </Box>
    </>
  );
};

export default Applications;
