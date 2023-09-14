import { Alert } from '@mui/material';
import { Application } from '../types/application';

export const handleEdit = (
  name: string,
  description: string,
  setEditedCardName: React.Dispatch<React.SetStateAction<string>>,
  setEditedCardDescription: React.Dispatch<React.SetStateAction<string>>,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setEditedCardName(name);
  setEditedCardDescription(description);
  setIsModalOpen(true);
};

export const handleDelete = (
  id: number | string | undefined,
  data: (Application | Event)[] | undefined
) => {
  console.log(`Delete action for card with ID ${id}`);
};

export const handleToggleActive = (
  id: number | string | undefined,
  data: (Application | Event)[] | undefined
) => {
  console.log('Handling Toggle Activation');
};

export const handleCloseModal = (
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setEditedCardName: React.Dispatch<React.SetStateAction<string>>,
  setEditedCardDescription: React.Dispatch<React.SetStateAction<string>>
) => {
  setIsModalOpen(false);
  setEditedCardName('');
  setEditedCardDescription('');
};

export const handleSearch = (
  setSearchError: React.Dispatch<React.SetStateAction<string>>,
  searchText: string,
  data: (Application | Event)[] | undefined
) => {
  if (searchText.length < 3) {
    console.log('Search should be more than 3 characters');
    setSearchError('Search should be more than atleast 3 characters');
  } else {
    setSearchError('');
  }
};
