// import 'antd/dist/antd.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { Loader } from './components/Loader';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';

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