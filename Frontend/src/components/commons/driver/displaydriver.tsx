import { handleSearch, handleCloseModal } from '../../../utils/dataUtils';
import React, { ContextType } from 'react';
import styles from './displaydriver.module.css';
import ToolBar from '../toolbar/toolbar';
import EditModal from '../modal/modal';
import { Application } from '../../../types/application';
import { Event } from '../../../types/event';
import { Alert } from '@mui/material';
import { UseMutationResult } from '@tanstack/react-query';

interface Props {
  params: object;
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
  setSearchError: React.Dispatch<React.SetStateAction<string>>;
  editedCardDescription: string | null;
  isModalOpen: boolean;
  searchError: string;
  params: object;
  setParams: React.Dispatch<React.SetStateAction<object>>;
  filters: string[];
  addModalTitle: string;
  handleAdd: (element: Application | Event | Notification) => void;
}
const DisplayDriver = ({
  params,
  addModalTitle,
  setParams,
  searchError,
  filters,
  setSearchError,
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
  handleAdd,
  toolBarTitle,
}: Props) => {
  return (
    <>
      <ToolBar
        handleAdd={handleAdd}
        params={params}
        addModalTitle={addModalTitle}
        setParams={setParams}
        filters={filters}
        text={toolBarTitle}
        onSearch={() => handleSearch(setSearchError, searchText, data)}
        setSearchText={setSearchText}
        searchText={searchText}
      />
      {searchError && <Alert severity='error'>{searchError}</Alert>}
      {renderComponent()}
      <EditModal
        handleSubmitElement={() => {}}
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
