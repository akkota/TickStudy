import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './Landing';
import Login from './Login';
import Signup from './Signup';
import { AuthProvider } from './components/utils/AuthContext';
import Dashboard from './Dashboard';
import PrivateRoutes from './components/utils/PrivateRoutes';
import Statistics from './Statistics';
import Pomodoro from './Pomodoro';
import Tasklist from './Tasklist'
import Habits from './Habits';
import Shop from './Shop';

function App() {

  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/signup" element={<Signup />}></Route>
            <Route element={<PrivateRoutes />}>
              <Route path="/dashboard" element={ <Dashboard /> }></Route>
              <Route path="/statistics" element={<Statistics />}></Route>
              <Route path="/pomodoro" element={<Pomodoro />}></Route>
              <Route path="/tasklist" element={<Tasklist />}></Route>
              <Route path="/habits" element={<Habits />}></Route>
              <Route path="/shop" element={<Shop />}></Route>
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </>
  )
}

export default App
