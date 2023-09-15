import { Route, Routes } from 'react-router-dom';
import LogInPage from '../pages/login/login';
import SignUpPage from '../pages/signup/signup';
import Dashboard from '../pages/dashboard/dashboard';
import { RequireAuth } from '../utils/requireAuth';
import EditScreen from '../pages/editScreen/editScreen';

const AppRoutes = () => {
  return (
    // <React.Suspense fallback={<LoadingLayout>Loading...</LoadingLayout>}>
    <Routes>
      <Route path='/login' element={<LogInPage />} />
      <Route path='/register' element={<SignUpPage />} />
      <Route element={<RequireAuth />}>
        <Route path='/' element={<EditScreen />} />
      </Route>
      <Route path='/edit' element={<EditScreen />} />
    </Routes>
    // </React.Suspense>
  );
};

export default AppRoutes;
