import { Box, CssBaseline } from '@mui/material';
import { useState, useEffect } from 'react';
import TopBar from '../../components/commons/topbar/topbar';
import styles from './dashboard.module.css';
import { Applications } from '../../components/application/Applications';
import Events from '../../components/events/events';
import Notifications from '../../components/notifications/notifications';

const Dashboard = () => {
  const [params, setParams] = useState({});
  const [applicationId, setApplicationId] = useState<string | undefined>('');
  const [eventId, setEventId] = useState<string | undefined>('');
  const [notificationId, setNotificationId] = useState<string | undefined>('');

  return (
    <>
      <CssBaseline />
      <TopBar />
      <div className={styles.gutterMargins}>
        <Box
          bgcolor='white'
          display='flex'
          minHeight='100vh'
          flexDirection='column'
        >
          <Applications setApplicationID={setApplicationId} />
          {applicationId && (
            <Events applicationId={applicationId} setEventId={setEventId} />
          )}
          {eventId && (
            <Notifications
              eventId={eventId}
              setNotificationId={setNotificationId}
            />
          )}
        </Box>
      </div>
    </>
  );
};

export default Dashboard;
