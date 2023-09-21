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
  toolBarTitle: JSX.Element;
  handleUpdate: (element: unknown) => void;
  handleEdit: (element: unknown) => void;
  modalTitle: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  searchText: string;
  renderComponent: () => void;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchError: React.Dispatch<React.SetStateAction<string>>;
  setIdsToDelete: (ids: string[]) => void;
  isModalOpen: boolean;
  searchError: string;
  setParams: React.Dispatch<React.SetStateAction<object>>;
  addModalTitle: string;
  isAddModalOpen: boolean;
  setIsAddModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSearch: () => void;
  handleAdd: (element: Application | Event | Notification) => void;
  selectedCards: string[];
  element: object;
  setElement: React.Dispatch<React.SetStateAction<object>>;
  handleCloseEditModal: () => void;
}
const DisplayDriver = ({
  selectedCards,
  handleEdit,
  params,
  addModalTitle,
  setParams,
  searchError,
  isModalOpen,
  setIsAddModalOpen,
  handleCloseEditModal,
  isAddModalOpen,
  setSearchText,
  handleSearch,
  element,
  renderComponent,
  modalTitle,
  handleAdd,
  toolBarTitle,
  setIdsToDelete,
  searchText,
}: Props) => {
  return (
    <>
      <ToolBar
        selectedCard={selectedCards}
        isAddModalOpen={isAddModalOpen}
        setIsAddModalOpen={setIsAddModalOpen}
        handleSearch={handleSearch}
        handleAdd={handleAdd}
        params={params}
        addModalTitle={addModalTitle}
        searchText={searchText}
        setParams={setParams}
        text={toolBarTitle}
        onSearch={handleSearch}
        setSearchText={setSearchText}
      />
      {searchError && <Alert severity='error'>{searchError}</Alert>}
      {renderComponent()}
      <EditModal
        submitCall={handleEdit}
        setIdsToDelete={setIdsToDelete}
        modalTitle={modalTitle}
        open={isModalOpen}
        element={element}
        handleClose={handleCloseEditModal}
      />
    </>
  );
};

export default DisplayDriver;
