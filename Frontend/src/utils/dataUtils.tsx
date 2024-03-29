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

export const filters = ['Active', 'Created At', 'Modified At'];
