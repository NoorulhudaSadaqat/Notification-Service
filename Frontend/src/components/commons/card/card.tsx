import {
  Typography,
  CardContent,
  Card,
  CardActions,
  Box,
  Checkbox,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import styles from './card.module.css';
import HandlerButtons from '../handlers/handler';
import IconButton from '@mui/material/IconButton';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Application } from '../../../types/application';
import { useState } from 'react';

interface Props {
  data: Application[] | undefined;
  openInfoModal: (element: Application) => void;
  setApplicationId: React.Dispatch<React.SetStateAction<string | undefined>>;
  handleEdit: (ele: Application) => void;
  handleUpdate: (ele: Application | Event | Notification) => void;
  handleDelete: () => void;
  setSelectedCards: React.Dispatch<React.SetStateAction<string[]>>;
  selectedCards: string[];
  setIdsToDelete: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function InfoCard({
  handleUpdate,
  data,
  openInfoModal,
  handleDelete,
  setApplicationId,
  handleEdit,
  selectedCards,
  setSelectedCards,
  setIdsToDelete,
}: Props) {
  const [selectedCard, setSelectedCard] = useState<string>();
  const toggleCardSelection = (cardId: string) => {
    if (selectedCards.includes(cardId)) {
      setSelectedCards(selectedCards.filter((id) => id !== cardId));
    } else {
      setSelectedCards([...selectedCards, cardId]);
    }
    console.log(selectedCards);
  };
  const theme = useTheme();
  const isScreenLarge = useMediaQuery(theme.breakpoints.up('sm'));
  const [currentCard, setCurrentCard] = useState();
  return (
    <>
      {data?.map((e) => (
        <Card
          onClick={() => {
            setApplicationId(e._id);
            setCurrentCard(e._id);
          }}
          key={e._id}
          sx={{
            curor: 'pointer',
            backgroundColor: currentCard === e._id ? '#A0D0FF' : '',
            minWidth: 275,
            justifyContent: 'space-between',
            margin: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.197)',
          }}
        >
          <CardContent sx={{ minHeight: 200 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Checkbox
                checked={selectedCards.includes(e._id)}
                onChange={() => toggleCardSelection(e._id)}
              />

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
                whiteSpace: 'pre-line',
                wordWrap: 'break-word',
              }}
              variant='body2'
              color='text.secondary'
            >
              {e.description.length > 100 ? (
                <>
                  {e.description.substring(0, 100)}
                  <span
                    style={{
                      color: 'blue',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    }}
                    onClick={() => openInfoModal(e)}
                  >
                    ...
                  </span>
                </>
              ) : (
                e.description
              )}
            </Typography>
          </CardContent>
          <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <HandlerButtons
              isActive={e.isActive}
              onEdit={() => handleEdit(e)}
              onDelete={async () => {
                setIdsToDelete([e._id!]);
                await handleDelete();
              }}
              onToggleActive={() =>
                handleUpdate({ _id: e._id, isActive: !e.isActive })
              }
            />
          </CardActions>
        </Card>
      ))}
    </>
  );
}
