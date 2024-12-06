import React, { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '../firebase'; 
import { Avatar, IconButton, Menu, MenuItem, Tooltip, Button } from '@mui/material';

function Login({ user, setUser }) { // Aggiunto user e setUser come props
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // Invia le informazioni dell'utente al componente App tramite la prop setUser
      setUser(user); 
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null); // Rimuovi le informazioni dell'utente
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {user ? ( // Mostra il badge se l'utente è loggato
        <>
          <Tooltip title={user.displayName}>
            <IconButton onClick={handleClick} size="small" sx={{ ml: 2}}>
              <Avatar src={user.photoURL} />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem>
              <Avatar src={user.photoURL} /> Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              Logout
            </MenuItem>
          </Menu>
        </>
      ) : ( // Mostra il pulsante di login se l'utente non è loggato
        <Button variant="contained" onClick={signInWithGoogle}>
          Accedi con Google
        </Button>
      )}
    </>
  );
}

export default Login;