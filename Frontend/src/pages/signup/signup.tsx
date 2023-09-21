import { Container, CssBaseline, Box, Button } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { Link } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import FormInputText from '../../components/commons/formtextinput/formInputText';
import { z, string } from 'zod';
import gslogo from '../../assets/gslogo-red.png';
import styles from './signup.module.css';
import { signUpService } from '../../services/authService';
import { ISignUp } from '../../types/auth';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/commons/footer/footer';

const validationSchema = z.object({
  email: string().email('Invalid email format').nonempty('Email is required'),
  password: string()
    .min(8, 'Password must be at least 8 characters')
    .nonempty('Password is required'),
  firstName: string()
    .min(3, 'Please enter atleast 3 characters')
    .max(15, 'Length exceeds allowed limit')
    .nonempty('Please enter your name'),
  lastName: string()
    .min(3, 'Please enter atleast 3 characters')
    .max(15, 'Length exceeds allowed limit'),
});

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

const SignUpPage = () => {
  const [showToast, setShowToast] = useState({
    state: false,
    message: '',
  });
  const navigate = useNavigate();
  const methods = useForm<ISignUp>();
  const { handleSubmit, setError } = methods;

  const handleCloseToast = () => {
    setShowToast({ state: false, message: '' });
  };

  const onSubmit = async (data: ISignUp) => {
    try {
      await validationSchema.parseAsync(data); // Validate the form data using Zod
      const response = await signUpService(data);
      if (response.token) {
        localStorage.setItem('token', response.token);
        navigate('/');
      } else {
        setShowToast({ state: true, message: response.response.data.error });
      }
      console.log(response.response.data.error); // Submit the data if it's valid
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
      <Box sx={{ minWidth: '100vw', minHeight: '80vh' }}>
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
          className={styles.signUpContainer} // Add a className for responsive styling
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
              <img
                src={gslogo}
                alt='GoSaaS logo'
                className={styles.ImageSize}
              />
              Sign Up
              <FormInputText name='firstName' label='First Name' />
              <FormInputText name='lastName' label='Last Name' type='email' />
              <FormInputText name='email' label='Email' type='email' />
              <FormInputText name='password' label='Password' type='password' />
              <Button
                sx={{ width: '100%' }}
                variant='contained'
                onClick={handleSubmit(onSubmit)}
              >
                Sign Up
              </Button>
              <p className={styles.registrationMsg}>
                Already have an account?{' '}
                <Link to='/' className={styles.resgistration}>
                  Log In
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

export default SignUpPage;
