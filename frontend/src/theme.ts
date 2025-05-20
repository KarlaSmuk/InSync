// src/theme.ts
import { createTheme } from '@mui/material/styles';

// You can optionally define a custom theme type here too
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2196f3' // blue
    },
    secondary: {
      main: '#7e57c2' // deep purple
    },
    success: {
      main: '#4caf50' // green
    },
    warning: {
      main: '#ffc107' // amber
    },
    error: {
      main: '#f44336' // red
    },
    info: {
      main: '#03a9f4' // light blue
    },
    background: {
      default: '#212121',
      paper: '#1e1e1e'
    },
    text: {
      primary: '#ffffff',
      secondary: '#aaaaaa'
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          height: '100%'
        },
        body: {
          height: '100%',
          margin: 0,
          padding: 0,
          backgroundColor: '#212121'
        }
      }
    }
  }
});

export default theme;
