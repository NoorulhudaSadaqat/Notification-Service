import React, { useState } from 'react';
import styles from './grid.module.css';
import {
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import HandlerButtons from '../handlers/handler';
import {
  handleEdit,
  handleDelete,
  handleToggleActive,
} from '../../../utils/dataUtils';
import { Event } from '../../../types/event';
import PaginationControls from '../paginationControl/paginationControl';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Notification } from '../../../types/notification';

interface Props {
  data: (Event | Notification)[] | undefined;
  setId: (id: string | undefined) => void;
  setEditedCardName: React.Dispatch<React.SetStateAction<string>>;
  setEditedCardDescription: React.Dispatch<React.SetStateAction<string>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openInfoModal: (e: Event) => void;
  handleUpdate: (e: Event | Notification) => void;
}

const itemsPerPage = 5;

const GridComponent: React.FC<Props> = ({
  data,
  setId,
  setEditedCardName,
  setEditedCardDescription,
  setIsModalOpen,
  openInfoModal,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = data?.length;
  let totalPages;
  if (totalItems) totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedData = data?.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className={styles.heightControl}>
      <TableContainer sx={{ minHeight: '20vh' }}>
        <Table>
          <TableHead sx={{ position: 'sticky', top: 0 }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}></TableCell>

              <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData?.map((ele) => (
              <TableRow key={ele._id}>
                <TableCell>
                  <IconButton
                    aria-label='info'
                    sx={{ fontSize: '18px' }}
                    onClick={() => openInfoModal(ele)}
                  >
                    <InfoOutlinedIcon sx={{ fontSize: '18px' }} />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <Link
                    sx={{ cursor: 'pointer', color: 'black' }}
                    onClick={() => setId(ele._id)}
                  >
                    {ele.name}
                  </Link>
                </TableCell>
                <TableCell>
                  {ele.description.length > 50 ? (
                    <>
                      {ele.description.substring(0, 50)}
                      <span
                        style={{
                          color: 'blue',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                        }}
                        onClick={() => openInfoModal(ele)}
                      >
                        ...
                      </span>
                    </>
                  ) : (
                    ele.description
                  )}
                </TableCell>
                <TableCell>
                  <HandlerButtons
                    isActive={ele.isActive}
                    onEdit={() =>
                      handleEdit(
                        ele.name,
                        ele.description,
                        setEditedCardName,
                        setEditedCardDescription,
                        setIsModalOpen
                      )
                    }
                    onDelete={() => handleUpdate({ ...ele, isDeleted: true })}
                    onToggleActive={() =>
                      handleUpdate({ ...ele, isActive: !ele.isActive })
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default GridComponent;
