import CssBaseline from '@mui/material/CssBaseline';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Box from '@mui/material/Box';
import { Container, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import FormInputText from '../../components/commons/formtextinput/formInputText';
import { z, string } from 'zod';
import gslogo from '../../assets/gslogo-red.png';
import styles from './login.module.css';
import { ILogin } from '../../types/auth';
import { loginService } from '../../services/authService';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/commons/footer/footer';

const validationSchema = z.object({
  email: string().email('Invalid email format').nonempty('Email is required'),
  password: string()
    .min(8, 'Password must be at least 8 characters')
    .nonempty('Password is required'),
});

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

const LogInPage = () => {
  const [showToast, setShowToast] = useState({
    state: false,
    message: '',
  });
  const navigate = useNavigate();
  const methods = useForm<ILogin>();
  const { handleSubmit, setError } = methods;

  const handleCloseToast = () => {
    setShowToast({ state: false, message: '' });
  };

  const onSubmit = async (data: ILogin) => {
    try {
      await validationSchema.parseAsync(data);
      const response = await loginService(data);
      console.log(response);
      if (response.token) {
        localStorage.setItem('token', response.token);
        console.log(response);
        navigate('/');
      } else {
        console.log('token not received');
        setShowToast({ state: true, message: response.response.data.error });
      }
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
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          minWidth: '100vw',
        }}
      >
        <CssBaseline />
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={showToast?.state}
          onClose={handleCloseToast}
          message={showToast?.message}
          autoHideDuration={6000}
        >
          <Alert
            onClose={handleCloseToast}
            sx={{ width: '100%' }}
            severity='error'
          >
            {showToast?.message}
          </Alert>
        </Snackbar>
        <Container
          component='main'
          maxWidth='xs'
          className={styles.loginContainer} // Add a className for responsive styling
        >
          <FormProvider {...methods}>
            <Box
              component='form'
              noValidate
              autoComplete='off'
              display='flex'
              flexDirection='column'
              alignItems='center'
              marginTop='10vh'
              sx={{ gap: 1 }}
            >
              <img
                src={gslogo}
                alt='GoSaaS logo'
                className={styles.ImageSize}
              />
              Log In
              <FormInputText name='email' label='Email' type='email' />
              <FormInputText name='password' label='Password' type='password' />
              <Button
                sx={{ width: '100%' }}
                variant='contained'
                onClick={handleSubmit(onSubmit)}
              >
                Log In
              </Button>
              <p className={styles.registrationMsg}>
                Don't have an account?{' '}
                <Link to='/register' className={styles.resgistration}>
                  Register Here
                </Link>
              </p>
            </Box>
          </FormProvider>
        </Container>
        <Footer />
      </Box>
    </>
  );
};

export default LogInPage;
