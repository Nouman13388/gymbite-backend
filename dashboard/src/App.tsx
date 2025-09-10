import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
import { routes } from './routes';

// App Routes Component - using useRoutes hook
const AppRoutes = () => {
  const routing = useRoutes(routes);
  return routing;
};

function App() {
  return (
    // <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    // </AuthProvider>
  );
}

export default App;
