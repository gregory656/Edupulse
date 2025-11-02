import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#6A0DAD' },   // Purple
    secondary: { main: '#1E90FF' }, // Blue
    success: { main: '#32CD32' },   // Green
    background: { default: '#FFFFFF' },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
  shape: {
    borderRadius: 16,
  },
});

export default theme;