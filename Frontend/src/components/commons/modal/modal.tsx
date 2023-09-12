import * as React from 'react';
import Box from '@mui/material/Box';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { z, string } from 'zod';
import FormInputText from '../formtextinput/formInputText';
import styles from './modal.module.css';
const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  gap: 1,
  minWidth: '30vw',
  minHeight: '30vh',
};

const validationSchema = z.object({
  name: string().min(3, 'Length should be more than 3'),
  description: string()
    .min(2, 'Length is too short')
    .max(128, 'Length is too long'),
});

interface IFormInput {
  name: string;
  description: string;
}

interface Props {
  nameOriginal: string | null;
  descriptionOriginal: string | null;
  modalTitle: string;
  open: boolean;
  handleClose: () => void;
}

export default function EditModal({
  modalTitle,
  nameOriginal,
  descriptionOriginal,
  open,
  handleClose,
}: Props) {
  const methods = useForm<IFormInput>({});
  const { handleSubmit, setError, control } = methods;

  const onSubmit = async (data: IFormInput) => {
    try {
      await validationSchema.parseAsync(data);
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
                defaultValue={nameOriginal}
              />
              <FormInputText
                name='description'
                label='Description'
                type='text'
                defaultValue={descriptionOriginal}
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
