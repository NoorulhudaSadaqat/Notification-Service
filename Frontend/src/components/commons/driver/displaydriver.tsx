import { handleSearch, handleCloseModal } from '../../../utils/dataUtils';
import React from 'react';
import styles from './displaydriver.module.css';
import ToolBar from '../toolbar/toolbar';
import EditModal from '../modal/modal';
import { Application } from '../../../types/application';
import { Event } from '../../../types/event';

interface Props {
  data: (Application | Event)[] | undefined;
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
        onSearch={() => handleSearch(searchText, data)}
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
