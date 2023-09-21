import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Alert } from '@mui/material';
import styles from './editScreen.module.css';
import { FormProvider, useForm } from 'react-hook-form';
import FormInputText from '../../components/commons/formtextinput/formInputText';
import { INotificationEdit } from '../../types/notification';
import { useParams } from 'react-router-dom';
import { useGetNotification } from '../../services/notificationService';
import Loader from '../../components/commons/loader/loader';
import gslogo from '../../assets/gslogo-red.png';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { string, z } from 'zod';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/commons/topbar/topbar';
const validationSchema = z.object({
  name: string()
    .min(3, 'Name needs to be atleast 3 characters')
    .max(50, 'Name can not exceed 50 characters')
    .nonempty('Name is required'),
  description: string()
    .min(3, 'Description needs to be atleast 3 characters')
    .max(50, 'Description can not exceed 50 characters')
    .nonempty('Description is required'),
  templateSubject: string()
    .min(5, 'Subject needs to be atleast 5 characters')
    .max(255, 'Subject can not be this long')
    .nonempty('Subject is required'),
  templateBody: string()
    .min(10, 'Body needs to be atleast 10 characters')
    .max(1024, 'Body can not be this long')
    .nonempty('Body is required'),
});

const EditScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isLoading, error, isError, data } = useGetNotification(id);
  const [templateBodyText, setTemplateBodyText] = useState('');
  const [templateSubjectText, setTemplateSubject] = useState('');
  let notification;
  if (data) {
    notification = data[0];
  }

  useEffect(() => {
    // Check if data is available
    if (data) {
      setTemplateBodyText(data[0].templateBody);
      setTemplateSubject(data[0].templateSubject);
    }
  }, [data]);

  const methods = useForm<INotificationEdit>();
  const { handleSubmit, setError } = methods;
  const handleTemplateBodyChange = (text) => {
    setTemplateBodyText(text);
  };
  const handleTemplateSubjectChange = (text) => {
    setTemplateSubject(text);
  };
  const onSubmit = async (data: INotificationEdit) => {
    try {
      await validationSchema.parseAsync(data);
      console.log(data);
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
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '100vw',
          minHeight: '100vh',
          backgroundColor: 'white',
        }}
      >
        <Loader />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ overflow: 'hidden' }}>
        <TopBar />
        <Box
          sx={{
            marginBlockStart: '-4vh',
            display: 'flex',
            flexDirection: 'row',
            paddingInline: '5vw',
            paddingBlock: '5vh',
            minWidth: '90vw',
            minHeight: '90vh',
            backgroundColor: 'white',
          }}
        >
          {notification && (
            <Box
              sx={{
                flex: 1,
                marginRight: '1vw',
                backgroundColor: 'white',
              }}
            >
              <Typography variant='h2' color={'black'}>
                Notification Screen
              </Typography>

              <div className={styles.colorBand}></div>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  minWidth: '100%',
                  marginTop: '5vh',
                }}
              >
                <Box
                  sx={{
                    backgroundColor: 'white',
                    width: '40%',
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
                      sx={{ gap: 1, minWidth: '35vw' }}
                    >
                      <FormInputText
                        name='name'
                        label='Name'
                        defaultValue={notification.name}
                        type='text'
                      />
                      <FormInputText
                        defaultValue={notification.description}
                        name='description'
                        label='Description'
                        type='text'
                      />
                      <FormInputText
                        defaultValue={notification.templateSubject}
                        name='templateSubject'
                        label='Template Subject'
                        type='text'
                        onTextChange={handleTemplateSubjectChange}
                      />
                      <FormInputText
                        defaultValue={notification.templateBody}
                        name='templateBody'
                        label='Template Body'
                        type='text'
                        textBox={true}
                        rowNumber={20}
                        onTextChange={handleTemplateBodyChange}
                      />
                    </Box>
                  </FormProvider>
                </Box>
                <Box
                  sx={{
                    marginInline: 'auto',
                    padding: '1rem',
                    width: '30vw',
                    color: 'black',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                  }}
                >
                  <img src={gslogo} alt='GoSaaS logo' width='300px' />
                  <Box
                    sx={{
                      display: 'flex',
                      fontSize: '1.2rem',
                      alignItems: 'flex-start',
                      justifyItems: 'left',
                      textAlign: 'left',
                      flexDirection: 'column',
                      width: '100%',
                    }}
                  >
                    <Box sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                      Subject: {templateSubjectText}
                    </Box>
                    <div>
                      <strong>Body:</strong>
                    </div>
                    <div>{templateBodyText}</div>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  sx={{ marginInline: '1vw' }}
                  variant='outlined'
                  endIcon={<CloseOutlinedIcon />}
                  onClick={() => {
                    navigate('/');
                  }}
                >
                  Close
                </Button>
                <Button
                  variant='contained'
                  endIcon={<SaveOutlinedIcon />}
                  onClick={handleSubmit(onSubmit)}
                >
                  Save
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default EditScreen;
