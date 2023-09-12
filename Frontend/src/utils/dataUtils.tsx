// dataUtils.js
export interface data {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

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
  id: number,
  data: data[],
  setData: React.Dispatch<React.SetStateAction<data[]>>
) => {
  console.log(`Delete action for card with ID ${id}`);
  const filteredData = data.filter((ele: data) => ele.id !== id);
  setData(filteredData);
};

export const handleToggleActive = (
  id: number,
  data: data[],
  setData: React.Dispatch<React.SetStateAction<data[]>>
) => {
  const updatedData = data.map((ele: data) =>
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
  data: data[],
  setData: React.Dispatch<React.SetStateAction<data[]>>
) => {
  console.log('hi');
  console.log('search Test', searchText);
  const filteredData = data.filter((ele) =>
    ele.name.toLowerCase().includes(searchText.toLowerCase())
  );
  setData(filteredData);
};
