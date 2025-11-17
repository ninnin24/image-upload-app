// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

// ธีมมืออาชีพ (ฟ้า-ส้ม) - ตามรูป 100%
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1E88E5',
      light: '#42A5F5',
      dark: '#1565C0',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF9800',
      light: '#FFB74D',
      dark: '#F57C00',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#f8fafc',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1a202c',
      secondary: '#718096',
    },
  },
  typography: {
    fontFamily: '"Prompt", "Roboto", sans-serif',
    h4: {
      fontWeight: 800,
      fontSize: '2rem',
      background: 'linear-gradient(90deg, #1E88E5, #1565C0)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: {
      fontWeight: 700,
      textTransform: 'none',
    },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiCssBaseline: {
      styleOverrides: { body: { backgroundColor: '#f8fafc' } },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
          borderRadius: 20,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 15px 40px rgba(0,0,0,0.12)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 16, padding: '12px 24px', fontWeight: 700 },
        containedSecondary: {
          background: 'linear-gradient(45deg, #FF9800, #FFB74D)',
          '&:hover': { background: 'linear-gradient(45deg, #F57C00, #FF8A65)' },
        },
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
);