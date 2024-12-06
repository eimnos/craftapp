import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

function PrivateRoute({ children }) {
  const [user, loading] = useAuthState(auth);
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Mostra un loader mentre controlli l'autenticazione
  }

  if (!user) {
    // Reindirizza alla pagina di login se l'utente non è autenticato
    return <Navigate to="/login" state={{ from: location }} replace />; 
  }

  return children; // Renderizza la pagina protetta se l'utente è autenticato
}

export default PrivateRoute;