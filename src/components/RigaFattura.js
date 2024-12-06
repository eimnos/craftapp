import React, { useState, useEffect } from "react";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function RigaFattura({ riga, onRigaChange, onRigaDelete }) {
  const [articoli, setArticoli] = useState([]);
  const [codiceArticolo, setCodiceArticolo] = useState(riga.codiceArticolo || "");
  const [descrizioneArticolo, setDescrizioneArticolo] = useState(
    riga.descrizioneArticolo || ""
  );

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

  const handleArticoloChange = (event) => {
    const articoloSelezionato = articoli.find(
      (articolo) => articolo.codice === event.target.value,
    );
    if (articoloSelezionato) {
      // Se l'articolo è presente nel database, usa i suoi dati
      onRigaChange({
        ...riga,
        articoloId: event.target.value,
        codiceArticolo: articoloSelezionato.codice,
        descrizioneArticolo: articoloSelezionato.descrizione,
        prezzoNetto: articoloSelezionato.prezzoNetto,
        iva: articoloSelezionato.iva,
        prezzoLordo: Number (
          articoloSelezionato.prezzoNetto *
          (1 + articoloSelezionato.iva / 100)), // Prezzo lordo unitario
      });
      setCodiceArticolo(articoloSelezionato.codice);
      setDescrizioneArticolo(articoloSelezionato.descrizione);
    } else {
      // Altrimenti, usa i dati inseriti manualmente
      onRigaChange({
        ...riga,
        articoloId: null, // Nessun articoloId se inserito manualmente
        codiceArticolo: codiceArticolo,
        descrizioneArticolo: descrizioneArticolo,
        prezzoLordo: Number (
          parseFloat(riga.prezzoNetto) * (1 + parseFloat(riga.iva) / 100)) || 0, // Conversione a numero
      });
    }
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
      <FormControl sx={{ minWidth: 120, mr: 2 }}>
        <InputLabel id="articolo-label">Articolo</InputLabel>
        <Select
          labelId="articolo-label"
          id="articolo"
          label="Articolo"
          value={riga.articoloId || ""} // Aggiunto controllo per valore vuoto
          onChange={handleArticoloChange}
        >
          {articoli.map((articolo) => (
            <MenuItem key={articolo.id} value={articolo.id}>
              {articolo.codice} - {articolo.descrizione}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Codice Articolo"
        value={codiceArticolo}
        onChange={(e) => {
          setCodiceArticolo(e.target.value);
          onRigaChange({ ...riga, codiceArticolo: e.target.value });
        }}
        sx={{ mr: 2, width: 100 }}
      />
      <TextField
        label="Descrizione Articolo"
        value={descrizioneArticolo}
        onChange={(e) => {
          setDescrizioneArticolo(e.target.value);
          onRigaChange({ ...riga, descrizioneArticolo: e.target.value });
        }}
        sx={{ mr: 2, width: 200 }}
      />

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