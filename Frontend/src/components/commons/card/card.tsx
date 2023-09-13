import { Typography, CardContent, Card, CardActions } from '@mui/material';
import styles from './card.module.css';
import HandlerButtons from '../handlers/handler';
import {
  handleEdit,
  handleDelete,
  handleToggleActive,
} from '../../../utils/dataUtils';
import { Application } from '../../../types/application';
interface Props {
  data: Application[] | undefined;
  setData: React.Dispatch<React.SetStateAction<Application[] | undefined>>;

  setApplicationID: React.Dispatch<React.SetStateAction<string | undefined>>;
  setEditedCardName: React.Dispatch<React.SetStateAction<string>>;
  setEditedCardDescription: React.Dispatch<React.SetStateAction<string>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function InfoCard({
  data,
  setData,
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
          <CardContent>
            <Typography
              sx={{ textAlign: 'left', fontSize: '0.75rem' }}
              gutterBottom
            >
              {e.code}
            </Typography>
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
              sx={{ textAlign: 'left' }}
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
              onDelete={() => handleDelete(e.id, data, setData)}
              onToggleActive={() => handleToggleActive(e.id, data, setData)}
            />
          </CardActions>
        </Card>
      ))}
    </>
  );
}
