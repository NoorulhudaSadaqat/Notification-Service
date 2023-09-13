import { Box, CssBaseline } from '@mui/material';
import Applications from '../../components/application/applications';
import TopBar from '../../components/commons/topbar/topbar';
import styles from './dashboard.module.css';
import Events from '../../components/events/events';
import Notifications from '../../components/notifications/notifications';
import { useEffect, useState } from 'react';
import { Application } from '../../types/application';
import { useGetApplications } from '../../services/applicationService';

const Dashboard = () => {
  //todo: create states for app and event id
  //set function propogates down
  //onClick calls set function
  const [params, setParams] = useState({});
  const [applicationID, setApplicationID] = useState<string | undefined>('');
  const [applications, setApplications] = useState<Application[] | undefined>();
  const { isLoading, isError, data, error } = useGetApplications(params);
  useEffect(() => {
    if (data && !isLoading && !isError) {
      const applicationFetched = data.applications;
      setApplications(applicationFetched);
      console.log('Fetched Applications:', applicationFetched);
    }
  }, [data]);

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
          <Applications
            data={applications}
            setData={setApplications}
            isLoading={isLoading}
            applicationID={applicationID}
            setApplicationID={setApplicationID}
          />
          {/* <Events />
          <Notifications /> */}
        </Box>
      </div>
    </>
  );
};

export default Dashboard;
