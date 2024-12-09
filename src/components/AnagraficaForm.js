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
  Grid2,
  Typography,
  Divider
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { formFieldStyle } from "../formStyles";
// ... (eventuali import per il servizio di ricerca indirizzo) ...

function AnagraficaForm({ onClose }) {
  const [tipo, setTipo] = useState("");
  const [codice, setCodice] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [partitaIva, setPartitaIva] = useState("");
  const [via, setVia] = useState("");
  const [numeroCivico, setNumeroCivico] = useState("");
  const [cap, setCap] = useState("");
  const [localita, setLocalita] = useState("");
  const [provincia, setProvincia] = useState("");
  const [nazione, setNazione] = useState("");

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
      <Divider textAlign="left">
          <Typography variant="title" gutterBottom>
            Dati generali
          </Typography>
        </Divider>
        <Grid2 container rowSpacing={0} columnSpacing={2}>
          <Grid2 size={3}>
            <TextField
              sx={formFieldStyle}
              margin="normal"
              required
              fullWidth
              id="codice"
              label="Codice"
              name="codice"
              value={codice}
              onChange={(e) => setCodice(e.target.value)}
            />
          </Grid2>
          <Grid2 size={9}>
            <TextField
              sx={formFieldStyle}
              margin="normal"
              required
              fullWidth
              id="descrizione"
              label="Descrizione"
              name="descrizione"
              value={descrizione}
              onChange={(e) => setDescrizione(e.target.value)}
            />
          </Grid2>
          <Grid2 size={3}>
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
            </Grid2>
          <Grid2 size={9}>
            <TextField
              sx={formFieldStyle}
              margin="normal"
              required
              fullWidth
              id="partitaIva"
              label="Partita Iva"
              name="partitaIva"
              value={partitaIva}
              onChange={(e) => setPartitaIva(e.target.value)}
            />
          </Grid2>
        </Grid2>
        <Divider textAlign="left">
          <Typography variant="title" gutterBottom>
            Indirizzo sede legale
          </Typography>
        </Divider>
        <Box sx={{ flexGrow: 1 }}>
        <Grid2 container rowSpacing={0} columnSpacing={2}>
          <Grid2 size={8}>
            <TextField
              sx={formFieldStyle}
              margin="normal"
              required
              fullWidth
              id="via"
              label="Via"
              name="via"
              value={via}
              onChange={(e) => setVia(e.target.value)}
            />
          </Grid2>
          <Grid2 size={4}>
            <TextField
              sx={formFieldStyle}
              margin="normal"
              fullWidth
              id="numeroCivico"
              label="Numero civico"
              name="numeroCivico"
              value={numeroCivico}
              onChange={(e) => setNumeroCivico(e.target.value)}
            />
          </Grid2>
          <Grid2 size={4}>
            <TextField
              sx={formFieldStyle}
              margin="normal"
              required
              fullWidth
              id="cap"
              label="CAP"
              name="cap"
              value={cap}
              onChange={(e) => setCap(e.target.value)}
            />
          </Grid2>
          <Grid2 size={8}>
            <TextField
              sx={formFieldStyle}
              margin="normal"
              required
              fullWidth
              id="localita"
              label="Località"
              name="localita"
              value={localita}
              onChange={(e) => setLocalita(e.target.value)}
            />
          </Grid2>
          <Grid2 size={6}>
            <TextField
              sx={formFieldStyle}
              margin="normal"
              required
              fullWidth
              id="provincia"
              label="Provincia"
              name="provincia"
              value={provincia}
              onChange={(e) => setProvincia(e.target.value)}
            />
          </Grid2>
          <Grid2 size={6}>
            <TextField
              sx={formFieldStyle}
              margin="normal"
              required
              fullWidth
              id="nazione"
              label="Nazione"
              name="nazione"
              value={nazione}
              onChange={(e) => setNazione(e.target.value)}
            />
          </Grid2>
        </Grid2>
        </Box>

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