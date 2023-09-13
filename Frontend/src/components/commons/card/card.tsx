import { Typography, CardContent, Card, CardActions, Box } from '@mui/material';
import styles from './card.module.css';
import HandlerButtons from '../handlers/handler';
import IconButton from '@mui/material/IconButton';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  handleEdit,
  handleDelete,
  handleToggleActive,
} from '../../../utils/dataUtils';
import { Application } from '../../../types/application';
interface Props {
  data: Application[] | undefined;
  openInfoModal: (element: Application) => void;
  setApplicationID: React.Dispatch<React.SetStateAction<string | undefined>>;
  setEditedCardName: React.Dispatch<React.SetStateAction<string>>;
  setEditedCardDescription: React.Dispatch<React.SetStateAction<string>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function InfoCard({
  data,
  openInfoModal,
  setApplicationID,
  setEditedCardName,
  setEditedCardDescription,
  setIsModalOpen,
}: Props) {
  return (
    <>
      {data?.map((e) => (
        <Card
          onClick={() => {
            setApplicationID(e._id);

            console.log(e._id);
          }}
          key={e._id}
          sx={{
            curor: 'pointer',
            minWidth: 275,

            margin: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.197)',
          }}
        >
          <CardContent sx={{ minHeight: 250 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography sx={{ textAlign: 'left', fontSize: '0.75rem' }}>
                {e.code}
              </Typography>
              <IconButton
                aria-label='info'
                sx={{ fontSize: '18px' }}
                onClick={() => openInfoModal(e)}
              >
                <InfoOutlinedIcon sx={{ fontSize: '18px' }} />
              </IconButton>
            </Box>
            <div className={styles.colorBand}></div>
            <Typography
              sx={{ fontWeight: 'bold', textAlign: 'left' }}
              variant='h4'
              component='div'
              gutterBottom
            >
              {e.name}
            </Typography>

            <Typography
              sx={{
                textAlign: 'left',
                whiteSpace: 'pre-line', // or wordWrap: 'break-word'
                wordWrap: 'break-word',
              }}
              variant='body2'
              color='text.secondary'
            >
              {e.description}
            </Typography>
          </CardContent>
          <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <HandlerButtons
              isActive={e.isActive}
              onEdit={() =>
                handleEdit(
                  e.name,
                  e.description,
                  setEditedCardName,
                  setEditedCardDescription,
                  setIsModalOpen
                )
              }
              onDelete={() => handleDelete(e._id, data)}
              onToggleActive={() => handleToggleActive(e._id, data)}
            />
          </CardActions>
        </Card>
      ))}
    </>
  );
}
