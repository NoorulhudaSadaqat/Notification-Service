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
  handleDelete: (e: string) => void;
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
          key={e._id}
          sx={{
            curor: 'pointer',
            backgroundColor: currentCard === e._id ? '#00000008' : '',

            border: currentCard === e._id ? '0.5px solid black' : '',
            minWidth: isScreenLarge ? 275 : 200,
            justifyContent: 'space-between',
            margin: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            boxShadow:
              currentCard === e._id
                ? '1px 1px 5px rgba(0, 0, 0, 1)'
                : '5px 5px 10px rgba(0, 0, 0, 0.100)',
            //add more properties that can be changed on hover
            '&:hover': {
              transform: 'scale(1.01)',
              boxShadow:
                '5px 5px 10px rgba(0, 0, 0, 0.200), 1px 1px 5px rgba(0, 0, 0, 0.4)',
            },
            transition: 'all 0.2s ease-in-out',
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
              <Tooltip title='Bulk Delete' arrow>
                <Checkbox
                  checked={selectedCards.includes(e._id)}
                  onChange={() => toggleCardSelection(e._id)}
                />
              </Tooltip>
              <Typography sx={{ textAlign: 'left', fontSize: '0.75rem' }}>
                {e.code}
              </Typography>
            </Box>
            <div className={styles.colorBand}></div>
            <Box
              sx={{
                cursor: 'pointer',
              }}
              onClick={() => {
                setApplicationId(e._id);
                setCurrentCard(e._id);
              }}
            >
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
                {e.description.length > 50 ? (
                  <>
                    {e.description.substring(0, 50)}
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
            </Box>
          </CardContent>
          <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <HandlerButtons
              onInfo={() => openInfoModal(e)}
              isActive={e.isActive}
              onEdit={() => handleEdit(e)}
              onDelete={async () => {
                await handleDelete(e._id!);
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
