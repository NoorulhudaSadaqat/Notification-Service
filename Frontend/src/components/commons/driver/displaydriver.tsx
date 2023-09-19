import { handleCloseModal } from '../../../utils/dataUtils';
import React, { ContextType } from 'react';
import styles from './displaydriver.module.css';
import ToolBar from '../toolbar/toolbar';
import EditModal from '../modal/modal';
import { Application } from '../../../types/application';
import { Event } from '../../../types/event';
import { Alert } from '@mui/material';

interface Props {
  params: object;
  toolBarTitle: string;
  handleUpdate: (element: any) => void;
  modalTitle: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  searchText: string;
  renderComponent: () => void;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditedCardName: React.Dispatch<React.SetStateAction<string>>;
  editedCardName: string | null;
  setEditedCardDescription: React.Dispatch<React.SetStateAction<string>>;
  setSearchError: React.Dispatch<React.SetStateAction<string>>;
  editedCardDescription: string | null;
  isModalOpen: boolean;
  searchError: string;
  setParams: React.Dispatch<React.SetStateAction<object>>;
  addModalTitle: string;
  isAddModalOpen: boolean;
  setIsAddModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSearch: () => void;
  handleAdd: (element: Application | Event | Notification) => void;
}
const DisplayDriver = ({
  handleUpdate,
  params,
  addModalTitle,
  setParams,
  searchError,
  isModalOpen,
  setIsModalOpen,
  setIsAddModalOpen,
  isAddModalOpen,
  setSearchText,
  handleSearch,
  editedCardName,
  setEditedCardName,
  editedCardDescription,
  setEditedCardDescription,
  renderComponent,
  modalTitle,
  handleAdd,
  toolBarTitle,
}: Props) => {
  return (
    <>
      <ToolBar
        isAddModalOpen={isAddModalOpen}
        setIsAddModalOpen={setIsAddModalOpen}
        handleSearch={handleSearch}
        handleAdd={handleAdd}
        params={params}
        addModalTitle={addModalTitle}
        setParams={setParams}
        text={toolBarTitle}
        onSearch={handleSearch}
        setSearchText={setSearchText}
      />
      {searchError && <Alert severity='error'>{searchError}</Alert>}
      {renderComponent()}
      <EditModal
        handleSubmitElement={handleUpdate}
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
