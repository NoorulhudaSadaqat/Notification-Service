import { Alert, Box, CssBaseline } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import TopBar from "../../components/commons/topbar/topbar";
import styles from "./dashboard.module.css";
import { Applications } from "../../components/application/applications";
import Events from "../../components/events/events";
import Notifications from "../../components/notifications/notifications";
import { useAddApplication } from "../../services/applicationService";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/commons/footer/footer";

const Dashboard = () => {
  const navigate = useNavigate();
  const [applicationId, setApplicationId] = useState<string | undefined>("");
  const [eventId, setEventId] = useState<string | undefined>("");
  const [notificationId, setNotificationId] = useState<string | undefined>("");
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
          <Box sx={{ minHeight: "20vh" }}></Box>
          {applicationId && !eventId && (
            <Alert severity="warning">
              Please select an event to see notifications.
            </Alert>
          )}
          {console.log("application Id : ", applicationId)}
          {console.log("event Id : ", eventId)}
          {eventId && (
            <Notifications
              eventId={eventId}
              setNotificationId={setNotificationId}
            />
          )}
        </Box>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
