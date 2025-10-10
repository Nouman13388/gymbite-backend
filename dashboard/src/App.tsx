import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import { NotificationProvider } from './context/NotificationContext';
import { routes } from './routes';

// App Routes Component - using useRoutes hook
const AppRoutes = () => {
  const routing = useRoutes(routes);
  return routing;
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <AppRoutes />
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
