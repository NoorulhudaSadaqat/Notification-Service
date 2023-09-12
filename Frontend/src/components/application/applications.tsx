import InfoCard from '../commons/card/card';
import { Box } from '@mui/material';
import DisplayDriver from '../commons/driver/displaydriver';
import styles from './applications.module.css';
import { useState } from 'react';
import { data } from '../../utils/dataUtils';
interface Props {
  Propdata: data[];
}
const Applications = ({ Propdata }: Props) => {
  const [data, setData] = useState<data[]>(Propdata);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedCardName, setEditedCardName] = useState('');
  const [editedCardDescription, setEditedCardDescription] = useState('');

  const [searchText, setSearchText] = useState('');

  const renderComponent = () => (
    <div className={styles.scrollControl}>
      <div className={styles.cardContainer}>
        <InfoCard
          data={data}
          setData={setData}
          code={'App#123'}
          setEditedCardName={setEditedCardName}
          setEditedCardDescription={setEditedCardDescription}
          setIsModalOpen={setIsModalOpen}
        />
      </div>
    </div>
  );
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
