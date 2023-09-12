import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { Button, TextField, Container, Grid, Typography } from "@mui/material";

interface FormValues {
  name: string;
  subject: string;
  body: string;
}

const EditScreen = () => {
  const history = useHistory();
  const { control, handleSubmit, setValue, watch } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    // Perform any action you need with the form data
    console.log(data);

    // Assuming you want to go back to the previous page after submission
    history.goBack();
  };

  const name = watch("name", "");
  const subject = watch("subject", "");
  const body = watch("body", "");

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Name"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
            <Controller
              name="subject"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Subject"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
            <Controller
              name="body"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Body"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                />
              )}
            />
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </form>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h5">Preview:</Typography>
          <Typography variant="body1">Name: {name}</Typography>
          <Typography variant="body1">Subject: {subject}</Typography>
          <Typography variant="body1">Body: {body}</Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EditScreen;
