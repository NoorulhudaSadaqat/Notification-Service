import { data, handleSearch, handleCloseModal } from '../../../utils/dataUtils';
import React from 'react';
import styles from './displaydriver.module.css';
import ToolBar from '../toolbar/toolbar';
import EditModal from '../modal/modal';

interface Props {
  data: data[];
  setData: React.Dispatch<React.SetStateAction<data[]>>;
  toolBarTitle: string;
  modalTitle: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  searchText: string;
  renderComponent: () => void;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditedCardName: React.Dispatch<React.SetStateAction<string>>;
  editedCardName: string | null;
  setEditedCardDescription: React.Dispatch<React.SetStateAction<string>>;
  editedCardDescription: string | null;
  isModalOpen: boolean;
  AddModalId: number;
}
const DisplayDriver = ({
  isModalOpen,
  setIsModalOpen,
  searchText,
  setSearchText,
  data,
  setData,
  editedCardName,
  setEditedCardName,
  editedCardDescription,
  setEditedCardDescription,
  renderComponent,
  modalTitle,
  toolBarTitle,
  AddModalId,
}: Props) => {
  return (
    <>
      <ToolBar
        AddModalId={AddModalId}
        text={toolBarTitle}
        onSearch={() => handleSearch(searchText, data, setData)}
        setSearchText={setSearchText}
        searchText={searchText}
      />
      {renderComponent()}
      <EditModal
        modalTitle={modalTitle}
        nameOriginal={editedCardName}
        descriptionOriginal={editedCardDescription}
        open={isModalOpen}
        handleClose={() =>
          handleCloseModal(
            setIsModalOpen,
            setEditedCardName,
            setEditedCardDescription
          )
        }
      />
    </>
  );
};

export default DisplayDriver;
