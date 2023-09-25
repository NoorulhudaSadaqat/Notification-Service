import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Alert, Snackbar, Slide } from "@mui/material";
import styles from "./editScreen.module.css";
import { FormProvider, useForm } from "react-hook-form";
import FormInputText from "../../components/commons/formtextinput/formInputText";
import { INotificationEdit } from "../../types/notification";
import { useParams } from "react-router-dom";
import {
  useGetNotification,
  useAddNotification,
  useUpdateNotification,
} from "../../services/notificationService";
import { useGetTags } from "../../services/tagService";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/commons/loader/loader";
import gslogo from "../../assets/gslogo-red.png";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { string, z } from "zod";
import TopBar from "../../components/commons/topbar/topbar";
import UnsavedChangesDialog from "../../components/commons/dialogueBox/dialogue";
const validationSchema = z.object({
  name: string()
    .min(5, "Name is too short")
    .max(50, "Name is too long")
    .nonempty("Name is required"),
  description: string()
    .min(5, "Description is too short")
    .max(255, "Description is too long")
    .nonempty("Description is required"),
  templateSubject: string()
    .min(5, "Subject is too short")
    .max(255, "Subject is too long")
    .nonempty("Subject is required"),
  templateBody: string()
    .min(10, "Body is too short")
    .max(1024, "Body is too long")
    .nonempty("Body is required"),
});

const EditScreen = () => {
  const { eventId, id } = useParams();
  const addMutation = useAddNotification(eventId);
  const navigate = useNavigate();
  const updateMutation = useUpdateNotification(eventId);
  const { isLoading, data: tags } = useGetTags();
  const updatedTags = tags
    ? tags.map((tag) => {
        return {
          id: tag.label,
          display: tag.label,
        };
      })
    : "";
  const { error, isError, data } =
    id == -1
      ? { isLoading: false, error: null, isError: false, data: null }
      : // eslint-disable-next-line react-hooks/rules-of-hooks
        useGetNotification(id);
  const [templateBodyText, setTemplateBodyText] = useState("");
  const [templateSubjectText, setTemplateSubject] = useState("");
  let notification;
  if (data) {
    notification = data[0];
  }
  const [unsavedChanges, setUnsavedChanges] = React.useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [severity, setSeverity] = useState<AlertColor>();
  const [defaultFormData, setDefaultFormData] = useState<INotificationEdit>({
    name: "",
    description: "",
    templateSubject: "",
    templateBody: "",
  });
  React.useEffect(() => {
    if (notification) {
      setDefaultFormData({
        name: notification.name,
        description: notification.description,
        templateSubject: notification.templateSubject,
        templateBody: notification.templateBody,
      });
    }
  }, [notification]);
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (unsavedChanges) {
        e.preventDefault();
        setIsDialogOpen(true);
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [unsavedChanges]);

  const handleClose = () => {
    if (unsavedChanges) {
      setIsDialogOpen(true);
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    if (data) {
      setTemplateBodyText(data[0].templateBody);
      setTemplateSubject(data[0].templateSubject);
    }
  }, [data]);

  const methods = useForm<INotificationEdit>();
  const { handleSubmit, setError } = methods;
  const handleTemplateBodyChange = (text, fieldName) => {
    if (text != defaultFormData.templateBody) {
      setUnsavedChanges(true);
    } else {
      setUnsavedChanges(false);
    }
    setTemplateBodyText(text);
  };
  const handleTemplateSubjectChange = (text, fieldName) => {
    if (text != defaultFormData.templateSubject) {
      setUnsavedChanges(true);
    } else {
      setUnsavedChanges(false);
    }
    console.log(text);
    setTemplateSubject(text);
  };
  const handleConfirmLeave = () => {
    navigate("/");
  };
  const onSubmit = async (data: INotificationEdit) => {
    try {
      await validationSchema.parseAsync(data);
      if (id == -1) {
        const updatedData = { eventId, ...data };
        await addMutation.mutateAsync(updatedData);
        setSnackbarMessage("Notification has been added successfully!");
        setSnackbarOpen(true);
        setSeverity("success");
        navigate("/");
      } else {
        const updatedData = { eventId, _id: id, ...data };
        await updateMutation.mutateAsync(updatedData);
        setSnackbarMessage("Notification has been updated successfully!");
        setSnackbarOpen(true);
        setSeverity("success");
        navigate("/");
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
      console.log(error.response.data.error);
      setSnackbarMessage(`Error: ${error.response.data.error}`);
      setSnackbarOpen(true);
      setSeverity("error");
    }
  };
  const onTextChange = (e, fieldName) => {
    const newValue = e.target.value;
    if (newValue != defaultFormData[fieldName]) {
      setUnsavedChanges(true);
    } else {
      setUnsavedChanges(false);
    }
  };
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          minWidth: "100vw",
          minHeight: "100vh",
          backgroundColor: "white",
        }}
      >
        <Loader />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ overflow: "hidden" }}>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          TransitionComponent={Slide}
        >
          <Alert
            elevation={6}
            variant="filled"
            onClose={() => setSnackbarOpen(false)}
            severity={severity}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
        <TopBar />
        {isDialogOpen && (
          <UnsavedChangesDialog
            open={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onConfirmLeave={handleConfirmLeave}
          />
        )}
        <Box
          sx={{
            marginBlockStart: "-4vh",
            display: "flex",
            flexDirection: "row",
            paddingInline: "5vw",
            paddingBlock: "5vh",
            minWidth: "90vw",
            minHeight: "90vh",
            backgroundColor: "white",
          }}
        >
          <Box
            sx={{
              flex: 1,
              marginRight: "1vw",
              backgroundColor: "white",
            }}
          >
            <Typography variant="h2" color={"black"}>
              Notification Screen
            </Typography>

            <div className={styles.colorBand}></div>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                minWidth: "100%",
                marginTop: "5vh",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "white",
                  width: "40%",
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
                    sx={{ gap: 1, minWidth: "35vw" }}
                  >
                    <FormInputText
                      name="name"
                      label="Name"
                      defaultValue={notification?.name}
                      type="text"
                      onChangeText={onTextChange}
                    />
                    <FormInputText
                      defaultValue={notification?.description}
                      name="description"
                      label="Description"
                      type="text"
                      onChangeText={onTextChange}
                    />
                    <FormInputText
                      defaultValue={notification?.templateSubject}
                      name="templateSubject"
                      label="Template Subject"
                      type="text"
                      onTextChange={handleTemplateSubjectChange}
                    />
                    <FormInputText
                      defaultValue={notification?.templateBody}
                      name="templateBody"
                      label="Template Body"
                      type="text"
                      textBox={true}
                      rowNumber={20}
                      tags={updatedTags}
                      onTextChange={handleTemplateBodyChange}
                    />
                  </Box>
                </FormProvider>
              </Box>
              <Box
                sx={{
                  marginInline: "auto",
                  padding: "1rem",
                  width: "30vw",
                  color: "black",
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                }}
              >
                <img src={gslogo} alt="GoSaaS logo" width="300px" />
                <Box
                  sx={{
                    display: "flex",
                    fontSize: "1.2rem",
                    alignItems: "flex-start",
                    justifyItems: "left",
                    textAlign: "left",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <Box sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                    Subject: {templateSubjectText}
                  </Box>
                  <div>
                    <strong>Body:</strong>
                  </div>
                  <div>{templateBodyText}</div>
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                sx={{ marginInline: "1vw" }}
                variant="outlined"
                endIcon={<CloseOutlinedIcon />}
                onClick={() => {
                  handleClose();
                }}
              >
                Close
              </Button>
              <Button
                variant="contained"
                endIcon={<SaveOutlinedIcon />}
                onClick={handleSubmit(onSubmit)}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default EditScreen;
