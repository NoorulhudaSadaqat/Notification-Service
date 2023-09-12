import CssBaseline from "@mui/material/CssBaseline";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Box from "@mui/material/Box";
import { Container } from "@mui/material";
import { Link } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import FormInputText from "../../components/commons/formtextinput/formInputText";
import { z, string } from "zod";
import gslogo from "../../assets/gslogo-red.png";
import styles from "./login.module.css";
import Button from "../../components/commons/button/button";
import { ILogin } from "../../types/auth";
import { loginService } from "../../services/authService";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const validationSchema = z.object({
  email: string().email("Invalid email format").nonempty("Email is required"),
  password: string()
    .min(8, "Password must be at least 8 characters")
    .nonempty("Password is required"),
});

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const LogInPage = () => {
  const [showToast, setShowToast] = useState({
    state: false,
    message: "",
  });
  const navigate = useNavigate();
  const methods = useForm<ILogin>();
  const { handleSubmit, setError } = methods;

  const handleCloseToast = () => {
    setShowToast({ state: false, message: "" });
  };

  const onSubmit = async (data: ILogin) => {
    try {
      await validationSchema.parseAsync(data); // Validate the form data using Zod
      const response = await loginService(data);
      if (response.token) {
        localStorage.setItem("token", response.token);
        navigate("/");
      } else {
        setShowToast({ state: true, message: response.response.data.error });
      }
      console.log(response.response.data.error); // Submit the data if it's valid
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle Zod validation error
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
      <CssBaseline />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={showToast?.state}
        onClose={handleCloseToast}
        message={showToast?.message}
        autoHideDuration={6000}
      >
        <Alert
          onClose={handleCloseToast}
          sx={{ width: "100%" }}
          severity="error"
        >
          {showToast?.message}
        </Alert>
      </Snackbar>
      <Container
        component="main"
        maxWidth="xs"
        style={{
          border: "1px solid #007fff",
          borderRadius: "0 10%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "5rem",
          marginInlineStart: "35vw",
          minHeight: "70vh",
          minWidth: "30vw",
        }}
      >
        <FormProvider {...methods}>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            display="flex"
            flexDirection="column"
            alignItems="center"
            sx={{ gap: 1 }}
          >
            <img src={gslogo} alt="GoSaaS logo" />
            <FormInputText name="email" label="Email" type="email" />
            <FormInputText name="password" label="Password" type="password" />
            <Button
              text={"Sign In"}
              border={"outlineOnHover"}
              onClick={handleSubmit(onSubmit)} // Call handleSubmit when the button is clicked
            />
            <p className={styles.registrationMsg}>
              Don't have an account?{" "}
              <Link to="/register" className={styles.resgistration}>
                Register Here
              </Link>
            </p>
          </Box>
        </FormProvider>
      </Container>
    </>
  );
};

export default LogInPage;
