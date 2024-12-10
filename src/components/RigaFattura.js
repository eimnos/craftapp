import React, { useState, useEffect } from "react";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Box,
  Autocomplete,
  IconButton,
  Modal
} from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import AddIcon from "@mui/icons-material/Add"; // Icona per il bottone "+"
import CreaArticoloForm from "./CreaArticoloForm";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function RigaFattura({ riga, onRigaChange, onRigaDelete }) {
  const [articoli, setArticoli] = useState([]);
  const [codiceArticolo, setCodiceArticolo] = useState(riga.codiceArticolo || "");
  const [descrizioneArticolo, setDescrizioneArticolo] = useState(
    riga.descrizioneArticolo || ""
  );
  const [openCreaArticoloModal, setOpenCreaArticoloModal] = useState(false);
  const [articoloSelezionato, setArticoloSelezionato] = useState(null);

  useEffect(() => {
    const fetchArticoli = async () => {
      try {
        const articoliRef = collection(db, "articoli");
        const articoliSnapshot = await getDocs(articoliRef);
        const articoliData = articoliSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setArticoli(articoliData);
      } catch (error) {
        console.error("Errore durante il recupero degli articoli: ", error);
      }
    };

    fetchArticoli();
  }, []);

  const handleArticoloChange = (event, newValue) => {
    setArticoloSelezionato(newValue);
    if (newValue) {
      onRigaChange({
        ...riga,
        articoloId: newValue.id, // Imposta l'ID dell'articolo selezionato
        codiceArticolo: newValue.codice,
        descrizioneArticolo: newValue.descrizione,
        prezzoNetto: newValue.prezzoNetto,
        iva: newValue.iva,
        prezzoLordo: newValue.prezzoNetto * (1 + newValue.iva / 100),
      });
    } else {
      // Reimposta i campi della riga se nessun articolo è selezionato
      onRigaChange({
        ...riga,
        articoloId: null,
        codiceArticolo: "",
        descrizioneArticolo: "",
        prezzoNetto: 0,
        iva: 0,
        prezzoLordo: 0,
      });
    }
  };

  const handleCreaArticolo = (articoloId) => {
    // Aggiorna la riga con l'articolo appena creato
    const articoloCreato = articoli.find((a) => a.id === articoloId);
    setArticoloSelezionato(articoloCreato);
    onRigaChange({
      ...riga,
      articoloId: articoloId,
      codiceArticolo: articoloCreato.codice,
      descrizioneArticolo: articoloCreato.descrizione,
      prezzoNetto: articoloCreato.prezzoNetto,
      iva: articoloCreato.iva,
      prezzoLordo:
        articoloCreato.prezzoNetto * (1 + articoloCreato.iva / 100),
    });
  };

  const handleCloseCreaArticoloModal = () => {
    setOpenCreaArticoloModal(false);
  };

  const handleQuantitaChange = (event) => {
    const nuovaQuantita = parseInt(event.target.value) || 0;
    onRigaChange({ ...riga, quantita: nuovaQuantita }); // Invia solo la quantità
  };

  const handlePrezzoNettoChange = (event) => {
    const nuovoPrezzoNetto = parseFloat(event.target.value) || 0;
    const nuovoPrezzoLordo = (
      nuovoPrezzoNetto *
      (1 + riga.iva / 100)
    ).toFixed(2); // Prezzo lordo unitario
    onRigaChange({
      ...riga,
      prezzoNetto: nuovoPrezzoNetto,
      prezzoLordo: Number (nuovoPrezzoLordo), // Invia solo il prezzo lordo unitario
    });
  };

  const handleIvaChange = (event) => {
    const nuovaIva = parseFloat(event.target.value) || 0;
    const nuovoPrezzoLordo = (
      riga.prezzoNetto *
      (1 + nuovaIva / 100)
    ).toFixed(2); // Prezzo lordo unitario
    onRigaChange({
      ...riga,
      iva: nuovaIva,
      prezzoLordo: Number (nuovoPrezzoLordo), // Invia solo il prezzo lordo unitario
    });
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
      <Autocomplete
        options={articoli}
        getOptionLabel={(articolo) =>
          `${articolo.codice} - ${articolo.descrizione}`
        }
        value={articoloSelezionato}
        onChange={handleArticoloChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Articolo"
            sx={{ mr: 2, width: 200 }}
          />
        )}
      />

      <IconButton onClick={() => setOpenCreaArticoloModal(true)}>
        <AddIcon />
      </IconButton>

      <Modal
        open={openCreaArticoloModal}
        onClose={() => setOpenCreaArticoloModal(false)}
      >
        <Box sx={style}> {/* Definisci lo stile per la modale */}
          <CreaArticoloForm
            onClose={handleCloseCreaArticoloModal}
            onArticoloCreato={handleCreaArticolo} // Funzione per gestire l'articolo creato
          />
        </Box>
      </Modal>

      <TextField
        label="Quantità"
        type="number"
        value={riga.quantita}
        onChange={handleQuantitaChange}
        sx={{ mr: 2, width: 80 }}
      />
      <TextField
        label="Prezzo Netto"
        type="number"
        value={riga.prezzoNetto}
        onChange={handlePrezzoNettoChange}
        sx={{ mr: 2, width: 100 }}
      />
      <TextField
        label="IVA"
        type="number"
        value={riga.iva}
        onChange={handleIvaChange}
        sx={{ mr: 2, width: 80 }}
      />
      <TextField
        label="Prezzo Lordo"
        type="number"
        value={riga.prezzoLordo}
        disabled
        sx={{ mr: 2, width: 100 }}
      />
      <TextField
        label="Prezzo Totale Netto"
        type="number"
        value={(riga.prezzoNetto * riga.quantita).toFixed(2)}
        disabled
        sx={{ mr: 2, width: 120 }}
      />
      <TextField
        label="Prezzo Totale Lordo"
        type="number"
        value={(riga.prezzoLordo * riga.quantita).toFixed(2)}
        disabled
        sx={{ mr: 2, width: 120 }}
      />
      <Button
        variant="outlined"
        color="error"
        onClick={() => onRigaDelete(riga.id)}
      >
        Elimina
      </Button>
    </Box>
  );
}

export default RigaFattura;