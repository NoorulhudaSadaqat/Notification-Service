import * as React from 'react';
import Box from '@mui/material/Box';
import { useForm, FormProvider } from 'react-hook-form';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { z, string } from 'zod';
import FormInputText from '../formtextinput/formInputText';
import { Application } from '../../../types/application';

import { Notification } from '../../../types/notification';
import { Event } from '../../../types/event';
import { useMediaQuery, useTheme } from '@mui/material';

const validationSchema = z.object({
  name: string().min(5, 'Name is too short').max(50, 'Name is too long'),
  description: string()
    .min(50, 'Description is too short')
    .max(130, 'Description is too long'),
});

interface Props {
  nameOriginal?: string | null;
  descriptionOriginal?: string | null;
  modalTitle: string;
  open: boolean;
  handleClose: () => void;
  submitCall: (element: Application | Event | Notification) => void;
  element?: {
    name: string;
    description: string;
    applicationId?: string;
    _id: string;
  };
}

export default function EditModal({
  element,
  submitCall,
  modalTitle,
  open,
  handleClose,
}: Props) {
  const theme = useTheme();
  const isScreenLarge = useMediaQuery(theme.breakpoints.up('sm'));
  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: isScreenLarge ? '30vw' : '90vw',
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    gap: 1,
    minWidth: '30vw',
    minHeight: '30vh',
  };

  const methods = useForm<Application | Event | Notification>({});
  const { handleSubmit, setError } = methods;
  const [name, setName] = React.useState<string>('');
  const [description, setDescription] = React.useState<string>('');
  React.useEffect(() => {
    if (element) {
      setName(element.name);
      setDescription(element.description);
      console.log('Element', element);
    }
  }, [element]);
  const onSubmit = async (data: Application | Event | Notification) => {
    try {
      await validationSchema.parseAsync(data);
      console.log('Called On Submit');
      if (element?.applicationId) {
        data = { ...data, applicationId: element?.applicationId };
      }
      data = { _id: element?._id || '', ...data };
      console.log('Data', data);
      await submitCall(data);
      handleClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((validationError) => {
          if (validationError.path[0]) {
            const fieldName = validationError.path[0];
            setError(fieldName, { message: validationError.message });
          }
        });
      }
    }
  };
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box
          sx={style}
          display='flex'
          flexDirection='column'
          alignItems='center'
          justifyContent='space-between'
        >
          <Typography
            sx={{
              color: 'black',
              textAlign: 'left',
              fontSize: '2rem',
            }}
          >
            {modalTitle}
          </Typography>

          <FormProvider {...methods}>
            <Box sx={{ marginBlock: '2rem' }}>
              <FormInputText
                name='name'
                label='Title'
                type='text'
                defaultValue={name!}
              />
              <FormInputText
                name='description'
                label='Description'
                type='text'
                defaultValue={description!}
              />
            </Box>
            <Box id='controller-buttons'>
              <Button variant='text' onClick={handleClose}>
                Close
              </Button>
              <Button variant='contained' onClick={handleSubmit(onSubmit)}>
                Save
              </Button>
            </Box>
          </FormProvider>
        </Box>
      </Modal>
    </div>
  );
}
