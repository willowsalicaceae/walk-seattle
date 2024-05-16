import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#085d37',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 500,
    },
  },
});

export default theme;