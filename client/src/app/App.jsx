import { SpeedInsights } from '@vercel/speed-insights/react';
import AppRoutes from './routes';
import { AuthProvider } from '../shared/context/AuthContext';
import { ThemeProvider } from '../shared/context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
        <SpeedInsights />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
