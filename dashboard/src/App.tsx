import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import { NotificationProvider } from './context/NotificationContext';
import { NotificationInitializer } from './components/providers/NotificationInitializer';
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
        <NotificationInitializer />
        <Router>
          <AppRoutes />
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
