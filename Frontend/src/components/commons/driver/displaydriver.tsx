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
  handleUpdate: (element: any) => void;
  modalTitle: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  searchText: string;
  renderComponent: () => void;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;

  setSearchError: React.Dispatch<React.SetStateAction<string>>;

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
}
const DisplayDriver = ({
  selectedCards,
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
  setElement,
  element,
  renderComponent,
  modalTitle,
  handleAdd,
  toolBarTitle,
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
        open={isModalOpen}
        element={element}
        handleClose={() => {
          setIsModalOpen(false);
          setElement({});
        }}
      />
    </>
  );
};

export default DisplayDriver;
