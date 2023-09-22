import * as React from "react";
import Box from "@mui/material/Box";
import { useForm, FormProvider } from "react-hook-form";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { z, string } from "zod";
import FormInputText from "../formtextinput/formInputText";
import { Application } from "../../../types/application";

import { Notification } from "../../../types/notification";
import { Event } from "../../../types/event";
import { useMediaQuery, useTheme } from "@mui/material";
import UnsavedChangesDialog from "../dialogueBox/dialogue";

const validationSchema = z.object({
  name: string().min(5, "Name is too short").max(50, "Name is too long"),
  description: string()
    .min(5, "Description is too short")
    .max(255, "Description is too long"),
  code: string()
    .min(3, "Code is too short")
    .max(10, "Code is too long")
    .optional(),
});

interface Props {
  nameOriginal?: string | null;
  descriptionOriginal?: string | null;
  modalTitle: string;
  open: boolean;
  handleClose: () => void;
  submitCall: (element: unknown) => void;
  element?: {
    name: string;
    description: string;
    applicationId?: string;
    _id?: string;
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
  const isScreenLarge = useMediaQuery(theme.breakpoints.up("sm"));
  const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isScreenLarge ? "30vw" : "90vw",
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    gap: 1,
    minWidth: "30vw",
    minHeight: "30vh",
  };

  const methods = useForm<Application | Event | Notification>({});
  const { handleSubmit, setError, reset } = methods;
  const [unsavedChanges, setUnsavedChanges] = React.useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (unsavedChanges) {
        console.log("unsavedchanges : ", unsavedchanges);
        e.preventDefault();
        setIsDialogOpen(true);
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (unsavedChanges) {
        setIsDialogOpen(true);
      }
    };
  }, [unsavedChanges]);

  const handleConfirmCloseModal = () => {
    handleClose();
    // setUnsavedChanges(false);
    reset();
  };

  const handleCloseModal = () => {
    if (unsavedChanges) {
      setIsDialogOpen(true);
    } else {
      handleConfirmCloseModal();
    }
  };
  const onSubmit = async (data: Application | Event | Notification) => {
    try {
      await validationSchema.parseAsync(data);
      if (element?.applicationId) {
        data = { ...data, applicationId: element?.applicationId };
      }
      console.log("on submit");
      data = { _id: element?._id, ...data };
      await submitCall({ data, handleConfirmCloseModal });
    } catch (error) {
      console.log("error ", error);
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
  const handleConfirmLeave = () => {
    setIsDialogOpen(false);
    handleClose();
    // setUnsavedChanges(false);
    reset();
  };
  return (
    <div>
      {isDialogOpen && (
        <UnsavedChangesDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onConfirmLeave={handleConfirmLeave}
        />
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography
            sx={{
              color: "black",
              textAlign: "left",
              fontSize: "2rem",
            }}
          >
            {modalTitle}
          </Typography>

          <FormProvider {...methods}>
            <Box sx={{ marginBlock: "2rem" }}>
              <FormInputText
                name="name"
                label="Title"
                type="text"
                defaultValue={element?.name}
                onTextChange={() => {
                  setUnsavedChanges(true);
                }}
              />
              <FormInputText
                name="description"
                label="Description"
                type="text"
                defaultValue={element?.description}
                onTextChange={() => {
                  setUnsavedChanges(true);
                }}
              />
              {modalTitle.includes("Application") && (
                <FormInputText
                  name="code"
                  label="Code"
                  type="text"
                  defaultValue={element?.code}
                  onTextChange={() => {
                    setUnsavedChanges(true);
                  }}
                />
              )}
            </Box>
            <Box id="controller-buttons">
              <Button variant="text" onClick={handleCloseModal}>
                Close
              </Button>
              <Button variant="contained" onClick={handleSubmit(onSubmit)}>
                Save
              </Button>
            </Box>
          </FormProvider>
        </Box>
      </Modal>
    </div>
  );
}
