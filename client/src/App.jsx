import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { Loader } from './components/Loader';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';
import { ApplyDoctor } from './pages/ApplyDoctor';
import { Notifications } from './pages/Notifications';
import { UsersList } from './pages/Admin/UsersList';
import { DoctorsList } from './pages/Admin/DoctorsList';
import { Profile } from './pages/Doctor/Profile';

function App() {
  const { loading } = useSelector(state => state.alerts)

  return (
    <BrowserRouter>
      {loading && <Loader />}
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>

        <Route path='/login' element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />

        <Route path='/register' element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />

        <Route path='/apply-doctor' element={
          <ProtectedRoute>
            <ApplyDoctor />
          </ProtectedRoute>
        } />

        <Route path='/notifications'
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        {/* admin */}
        <Route path='/admin/users-list' element={
          <ProtectedRoute>
            <UsersList />
          </ProtectedRoute>
        } />
        <Route path='/admin/doctors-list' element={
          <ProtectedRoute>
            <DoctorsList />
          </ProtectedRoute>
        } />


        {/* doctor */}
        <Route
          path='/doctor/profile/:userId'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />


        <Route path='/' element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
