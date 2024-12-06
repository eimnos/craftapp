import React from 'react';
import Login from '../components/Login'; // Importa il componente Login

function Home() {
  return (
    <div>
      <h6>Benvenuto in CraftApp!</h6>
      <Login /> {/* Aggiungi il componente Login */}
    </div>
  );
}

export default Home;