import { Box, Container } from '@mui/material';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import FormInputText from '../../components/commons/formtextinput/formInputText';
import { INotificationEdit } from '../../types/notification';

const EditScreen = () => {
  const methods = useForm<INotificationEdit>();
  const { handleSubmit, setError } = methods;

  return (
    <Box
      sx={{
        minWidth: '100vw',
        minHeight: '100vh',
        backgroundColor: 'white',
      }}
    >
      <FormProvider {...methods}>
        <Box
          component='form'
          noValidate
          autoComplete='off'
          display='flex'
          flexDirection='column'
          alignItems='center'
          sx={{ gap: 1 }}
        >
          <FormInputText name='email' label='Email' type='email' />
          <FormInputText name='password' label='Password' type='password' />
        </Box>
      </FormProvider>
    </Box>
  );
};

export default EditScreen;
