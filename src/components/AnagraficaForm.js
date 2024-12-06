import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
// ... (eventuali import per il servizio di ricerca indirizzo) ...

function AnagraficaForm({ onClose }) {
  const [tipo, setTipo] = useState("");
  const [codice, setCodice] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [partitaIva, setPartitaIva] = useState("");
  const [indirizzo, setIndirizzo] = useState("");
  // ... (altri stati per i campi dell'indirizzo) ...

  const handleSubmit = async (event) => {
    event.preventDefault();
    // ... (logica per salvare i dati dell'anagrafica) ...
  };

  return (
    <div>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        <CloseIcon />
      </IconButton>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="tipo-label">Tipo</InputLabel>
          <Select
            labelId="tipo-label"
            id="tipo"
            label="Tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <MenuItem value="cliente">Cliente</MenuItem>
            <MenuItem value="fornitore">Fornitore</MenuItem>
          </Select>
        </FormControl>

        {/* ... (altri campi del form: codice, descrizione, partita IVA) ... */}

        <TextField
          margin="normal"
          required
          fullWidth
          id="indirizzo"
          label="Indirizzo sede legale"
          name="indirizzo"
          value={indirizzo}
          onChange={(e) => setIndirizzo(e.target.value)}
        />

        {/* ... (campi per via, numero civico, cap, città, provincia) ... */}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Salva
        </Button>
      </Box>
    </div>
  );
}

export default AnagraficaForm;