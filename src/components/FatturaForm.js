import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Alert,
  Snackbar,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Autocomplete
} from "@mui/material";
import {
  addDoc,
  collection,
  getDocs,
  doc,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { v4 as uuidv4 } from "uuid";
import RigaFattura from "./RigaFattura";
import CloseIcon from "@mui/icons-material/Close";

function FatturaForm({ onClose }) {
  const [user] = useAuthState(auth);
  const [numeroFattura, setNumeroFattura] = useState("");
  const [dataEmissione, setDataEmissione] = useState("");
  const [cliente, setCliente] = useState("");
  const [tipo, setTipo] = useState("");
  const [tipiFattura, setTipiFattura] = useState([]);
  const [articoli, setArticoli] = useState([]);
  const [righeFattura, setRigheFattura] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [anagrafiche, setAnagrafiche] = useState([]);

  useEffect(() => {
    const fetchTipiFattura = async () => {
      try {
        const tipiFatturaRef = collection(db, "tipiFattura");
        const tipiFatturaSnapshot = await getDocs(tipiFatturaRef);
        const tipiFatturaData = tipiFatturaSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTipiFattura(tipiFatturaData);
      } catch (error) {
        console.error(
          "Errore durante il recupero dei tipi di fattura: ",
          error,
        );
      }
    };


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

    const fetchAnagrafiche = async () => {
      try {
        const anagraficheRef = collection(db, "anagrafiche");
        const anagraficheSnapshot = await getDocs(anagraficheRef);
        const anagraficheData = anagraficheSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAnagrafiche(anagraficheData); // Salva le anagrafiche nello stato
      } catch (error) {
        console.error("Errore durante il recupero delle anagrafiche: ", error);
      }
    };

    fetchTipiFattura();
    fetchArticoli();
    fetchAnagrafiche();
  }, []);

  const fetchUltimoNumeroFattura = async (tipoFattura) => {
    try {
      const fattureRef = collection(db, "fatture");
      const q = query(
        fattureRef,
        where("tipo", "==", tipoFattura),
        orderBy("numeroFattura", "desc"),
        limit(1),
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return 1; // Nessuna fattura trovata, inizia da 1
      }

      const ultimaFattura = querySnapshot.docs[0].data();
      const ultimoNumero = parseInt(ultimaFattura.numeroFattura, 10) || 0;
      return ultimoNumero + 1;
    } catch (error) {
      console.error(
        "Errore durante il recupero dell'ultimo numero di fattura:",
        error,
      );
      return 1; // In caso di errore, inizia da 1
    }
  };

  useEffect(() => {
    const aggiornaNumeroFattura = async () => {
      if (tipo === "FVEN" || tipo === "NCCLI") {
        const nuovoNumero = await fetchUltimoNumeroFattura(tipo);
        setNumeroFattura(nuovoNumero.toString());
      } else {
        setNumeroFattura("");
      }
    };

    aggiornaNumeroFattura();
  }, [tipo]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      console.error("Utente non autenticato!");
      setErrorMessage("Utente non autenticato.");
      return;
    }

    const nuovaFattura = {
      numeroFattura,
      dataEmissione,
      cliente,
      tipo,
      userId: user.uid,
      createdAt: serverTimestamp(),
    };

    setIsLoading(true);

    try {
      const docRef = await addDoc(collection(db, "fatture"), nuovaFattura);
      console.log("Fattura creata con ID: ", docRef.id);

      await Promise.all(
        righeFattura.map(async (riga) => {
          let articoloId = riga.articoloId;

          if (!articoloId) {
            const nuovoArticoloRef = await addDoc(collection(db, "articoli"), {
              codice: riga.codiceArticolo,
              descrizione: riga.descrizioneArticolo,
              prezzoNetto: riga.prezzoNetto,
              iva: riga.iva,
              prezzoLordo: riga.prezzoLordo,
            });
            articoloId = nuovoArticoloRef.id;
          }

          const rigaFattura = {
            fatturaId: doc(db, "fatture", docRef.id),
            articoloId: articoloId,
            quantita: riga.quantita,
            prezzoNetto: riga.prezzoNetto,
            iva: riga.iva,
            prezzoLordo: riga.prezzoLordo,
          };
          await addDoc(collection(db, "righeFattura"), rigaFattura);
        }),
      );

      setSuccessMessage("Fattura inserita correttamente!");
    } catch (e) {
      console.error("Errore durante l'aggiunta del documento: ", e);
      setErrorMessage("Errore durante l'inserimento della fattura.");
    } finally {
      setIsLoading(false);
    }

    setTimeout(() => {
      onClose();
      setNumeroFattura("");
      setDataEmissione("");
      setCliente("");
      setTipo("");
      setRigheFattura([]);
      setSuccessMessage(null);
      setErrorMessage(null);
    }, 1500);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessMessage(null);
    setErrorMessage(null);
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
            {tipiFattura.map((tipo) => (
              <MenuItem key={tipo.id} value={tipo.id}>
                {tipo.Descrizione}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          margin="normal"
          required
          fullWidth
          id="numeroFattura"
          label="Numero Fattura"
          name="numeroFattura"
          value={Number (numeroFattura)}
          onChange={(e) => setNumeroFattura(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="dataEmissione"
          label="Data Emissione"
          name="dataEmissione"
          value={dataEmissione}
          onChange={(e) => setDataEmissione(e.target.value)}
        />
        <Autocomplete
          options={anagrafiche}
          getOptionLabel={(anagrafica) => anagrafica.descrizione} // Usa la descrizione come etichetta
          onChange={(event, newValue) => setCliente(newValue ? doc(db, 'anagrafiche', newValue.id) : null)} // Aggiorna il cliente con il DocumentReference
          renderInput={(params) => (
            <TextField
              {...params}
              margin="normal"
              required
              fullWidth
              id="cliente"
              label="Cliente"
              name="cliente"
            />
          )}
        />

        {righeFattura.map((riga) => (
          <RigaFattura
            key={riga.id}
            riga={riga}
            articoli={articoli}
            onRigaChange={(nuovaRiga) =>
              setRigheFattura((prevRighe) =>
                prevRighe.map((r) => (r.id === nuovaRiga.id ? nuovaRiga : r)),
              )
            }
            onRigaDelete={(rigaId) =>
              setRigheFattura((prevRighe) =>
                prevRighe.filter((r) => r.id !== rigaId),
              )
            }
          />
        ))}

        <Button
          variant="contained"
          onClick={() =>
            setRigheFattura([
              ...righeFattura,
              {
                id: uuidv4(),
                articoloId: "",
                quantita: 1,
                prezzoNetto: 0,
                iva: 0,
                prezzoLordo: 0,
              },
            ])
          }
        >
          Aggiungi riga
        </Button>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={isLoading}
        >
          {isLoading ? "Inserimento..." : "Inserisci"}
        </Button>

        <Snackbar
          open={successMessage !== null}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            sx={{ width: "100%" }}
          >
            {successMessage}
          </Alert>
        </Snackbar>

        <Snackbar
          open={errorMessage !== null}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="error"
            sx={{ width: "100%" }}
          >
            {errorMessage}
          </Alert>
        </Snackbar>
      </Box>
    </div>
  );
}

export default FatturaForm;