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
  data: Application[],
  setData: React.Dispatch<React.SetStateAction<Application[] | undefined>>
) => {
  console.log(`Delete action for card with ID ${id}`);
  const filteredData = data.filter((ele: Application) => ele.id !== id);
  setData(filteredData);
};

export const handleToggleActive = (
  id: number | string | undefined,
  data: Application[],
  setData: React.Dispatch<React.SetStateAction<Application[] | undefined>>
) => {
  const updatedData = data.map((ele: Application) =>
    ele.id === id ? { ...ele, isActive: !ele.isActive } : ele
  );
  setData(updatedData);
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
  searchText: string,
  data: Application[] | undefined,
  setData: React.Dispatch<React.SetStateAction<Application[] | undefined>>
) => {
  console.log('search Test', searchText);
  const filteredData = data?.filter((ele) =>
    ele.name.toLowerCase().includes(searchText.toLowerCase())
  );
  setData(filteredData);
};
