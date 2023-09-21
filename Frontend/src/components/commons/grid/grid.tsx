import styles from './grid.module.css';
import {
  Checkbox,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import HandlerButtons from '../handlers/handler';
import { Event } from '../../../types/event';
import PaginationControls from '../paginationControl/paginationControl';
import { Notification } from '../../../types/notification';

interface Props {
  data: (Event | Notification)[] | undefined;
  setId: (id: string | undefined) => void;
  setEditedCardName: React.Dispatch<React.SetStateAction<string>>;
  setEditedCardDescription: React.Dispatch<React.SetStateAction<string>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openInfoModal: (e: Event) => void;
  handleUpdate: (e: object) => void;
  setElement?: React.Dispatch<React.SetStateAction<object>>;
  selectedIds: string[];
  currentPage: number;
  setIdsToDelete: React.Dispatch<React.SetStateAction<string[]>>;
  handlePageChange: (page: number) => void;
  totalPages: number;
  handleEdit: (ele: Event | Notification) => void;
}

const GridComponent: React.FC<Props> = ({
  currentPage,
  totalPages,
  data,
  setId,
  selectedIds,
  handleUpdate,
  handlePageChange,
  handleEdit,
  setIdsToDelete,

  openInfoModal,
}) => {
  const theme = useTheme();
  const isScreenLarge = useMediaQuery(theme.breakpoints.up('sm'));
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const id = event.target.value;

    if (event.target.checked) {
      setIdsToDelete((prevSelectedIds) => [...prevSelectedIds, id]);
    } else {
      setIdsToDelete((prevSelectedIds) =>
        prevSelectedIds.filter((selectedId) => selectedId !== id)
      );
    }
  };

  return (
    <div className={styles.heightControl}>
      <TableContainer sx={{ minHeight: '20vh', marginBottom: '3vh' }}>
        <Table>
          <TableHead sx={{ position: 'sticky', top: 0 }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>
                {/* Checkbox Header */}
                <Checkbox
                  color='primary'
                  onChange={(e) => {
                    if (e.target.checked) {
                      setIdsToDelete(data?.map((ele) => ele._id!) || []);
                    } else {
                      setIdsToDelete([]);
                    }
                  }}
                />
              </TableCell>

              <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
              {isScreenLarge && (
                <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
              )}
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((ele) => (
              <TableRow key={ele._id}>
                <TableCell>
                  <Checkbox
                    color='primary'
                    value={ele._id}
                    onChange={handleCheckboxChange}
                    checked={selectedIds.includes(ele._id!)}
                  />
                </TableCell>
                <TableCell>
                  <Link
                    sx={{ cursor: 'pointer', color: 'black' }}
                    onClick={() => setId(ele._id)}
                  >
                    {ele.name}
                  </Link>
                </TableCell>
                {isScreenLarge && (
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
                )}
                <TableCell>
                  <HandlerButtons
                    isActive={ele.isActive}
                    onEdit={() => handleEdit(ele)}
                    onDelete={() =>
                      handleUpdate({ _id: ele._id, isDeleted: true })
                    }
                    onToggleActive={() =>
                      handleUpdate({ _id: ele._id, isActive: !ele.isActive })
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
