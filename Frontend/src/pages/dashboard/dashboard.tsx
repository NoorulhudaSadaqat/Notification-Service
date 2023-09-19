
import { Alert, Box, CssBaseline } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import TopBar from "../../components/commons/topbar/topbar";
import styles from "./dashboard.module.css";
import { Applications } from "../../components/application/Applications";
import Events from "../../components/events/events";
import Notifications from "../../components/notifications/notifications";
import { useAddApplication } from "../../services/applicationService";

const Dashboard = () => {
  const [applicationId, setApplicationId] = useState<string | undefined>("");
  const [eventId, setEventId] = useState<string | undefined>("");
  const [notificationId, setNotificationId] = useState<string | undefined>("");

  //try using mutations this way
  // const useTestFn = async () => {
  //   try {
  //     const mutation = useAddApplication();
  //     const result = await mutation.mutateAsync({
  //       name: "nddddmmzzzzzzdcccccccccdddddddddccccccccccddddzzzzzzzmmm",
  //       description: "2222222222dddddddddddd222222222222",
  //       code: "232323",
  //     });
  //     console.log("result ", result);
  //   } catch (error) {
  //     console.log("error : ", error.response.data.error);
  //   }
  // };

  // useTestFn();


  useEffect(() => {
    setEventId(undefined);
  }, [applicationId]);

  useEffect(() => {
    if (notificationId) {
      navigate(`/edit/${notificationId}`);
    }
  }, [navigate, notificationId]);
  return (
    <>
      <CssBaseline />
      <TopBar />
      <div className={styles.gutterMargins}>
        <Box
          bgcolor="white"
          display="flex"
          minHeight="100vh"
          flexDirection="column"
          marginBottom="10rem"
        >
          <Applications setApplicationId={setApplicationId} />
          {!applicationId && (
            <Alert severity="warning">
              Please select an application to see events.
            </Alert>
          )}
          {applicationId && (
            <Events applicationId={applicationId} setEventId={setEventId} />
          )}
          {applicationId && !eventId && (
            <Alert severity="warning">
              Please select an event to see notifications.
            </Alert>
          )}
          {eventId && (
            <Notifications
              eventId={eventId}
              setNotificationId={setNotificationId}
              applicationId={applicationId}
            />
          )}
        </Box>
      </div>
    </>
  );
};

export default Dashboard;
