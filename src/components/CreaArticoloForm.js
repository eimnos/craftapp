import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

function CreaArticoloForm({ onClose, onArticoloCreato }) {
  const [codice, setCodice] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [prezzoNetto, setPrezzoNetto] = useState(0);
  const [iva, setIva] = useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Impedisci il refresh della pagina
  
    try {
      // Crea un oggetto con i dati da inviare
      const nuovoArticolo = {
        codice,
        descrizione,
        prezzoNetto: parseFloat(prezzoNetto), // Converti in numero
        iva: parseFloat(iva), // Converti in numero
      };
  
      // Invia i dati alla collezione "articoli" in Firestore
      const docRef = await addDoc(collection(db, "articoli"), nuovoArticolo);
      console.log("Articolo creato con ID: ", docRef.id);
  
      // Chiama la funzione onArticoloCreato per passare l'ID dell'articolo creato al componente padre
      onArticoloCreato(docRef.id);
  
      /*const handleClose = (event) => {
        event.stopPropagation(); // Impedisci la propagazione dell'evento
        onClose(); // Chiama la funzione onClose passata come prop
      };*/
    } catch (error) {
      console.error("Errore durante la creazione dell'articolo: ", error);
      // Eventuale gestione dell'errore (es. messaggio di errore)
    }
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
      }}
    >
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        <CloseIcon />
      </IconButton>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ mt: 1 }}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          id="codice"
          label="Codice"
          name="codice"
          autoFocus
          value={codice}
          onChange={(e) => setCodice(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="descrizione"
          label="Descrizione"
          name="descrizione"
          value={descrizione}
          onChange={(e) => setDescrizione(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="prezzoNetto"
          label="Prezzo Netto"
          name="prezzoNetto"
          type="number"
          value={prezzoNetto}
          onChange={(e) => setPrezzoNetto(parseFloat(e.target.value))}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="iva"
          label="IVA"
          name="iva"
          type="number"
          value={iva}
          onChange={(e) => setIva(parseFloat(e.target.value))}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Crea Articolo
        </Button>
      </Box>
    </Box>
  );
}

export default CreaArticoloForm;