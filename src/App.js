import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme, AppBar, Toolbar, Typography, Tabs, Tab } from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

// Importa le tue pagine/componenti
import Home from './pages/Home';
import Fatture from './pages/Fatture';
import Magazzino from './pages/Magazzino';
import Login from './components/Login';
// ... altri componenti

const theme = createTheme({
  palette: {
    primary: {
      main: '#fbfbfb', 
    },
    secondary: {
      main: '#F2F2F2', 
    },
    error: {
      main: '#d90429', 
    },
    // ... altri colori ...
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    text: { // Definizione dello stile "text"
      color: '#4A4A4A'
    },
    title: {
      color: '#36535a'
    },
    btn: {
      color: '#36535a'
    },
    btnselected: {
      color: '#612c24'
    }
  },
  spacing: 8, // Spaziatura di base
  shape: {
    borderRadius: 4, // Raggio di default per i bordi
  },
  // ... altre proprietà ...
});

function App() {
  const [user, loading] = useAuthState(auth);
  const [value, setValue] = React.useState(0);
  // Rimossa la dichiarazione ridondante di user: const [user, setUser] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (loading) {
    return (<div>Loading...</div>)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}><img src="/images/logo.png" alt="Logo" style={{ height: '100px' }} /></Typography>
            <Tabs value={value} onChange={handleChange} position="right">
              <Tab label="Home" component={Link} to="/" sx={{ typography: 'btn','&.Mui-selected': { typography: 'btnselected'} }} />
              <Tab label="Fatture" component={Link} to="/fatture" sx={{ typography: 'btn','&.Mui-selected': { typography: 'btnselected'} }} />
              <Tab label="Magazzino" component={Link} to="/magazzino" sx={{ typography: 'btn','&.Mui-selected': { typography: 'btnselected'} }} /> {/* Corretto il percorso */}
            </Tabs>
            <Login user={user} setUser={useState} /> {/* Passate le props user e setUser a Login */}
          </Toolbar>
        </AppBar>

        <Routes>
          {!user && <Route path="/login" element={<Login user={user} setUser={useState} />} />} {/* Mostra la rotta /login solo se non loggato e passate le props */}
          {user && (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/fatture" element={<Fatture />} />
              <Route path="/magazzino" element={<Magazzino />} />
              {/* ... altre rotte */}
            </>
          )}
          {/* Rotta di fallback per gestire URL non validi */}
          <Route path="*" element={<Navigate to={user ? '/' : '/login'} />} /> 
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;