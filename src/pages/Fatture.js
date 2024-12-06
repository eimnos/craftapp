import { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  TableSortLabel,
  Box,
  Popover,
  ButtonGroup,
} from "@mui/material";
import { collection, getDocs, getDoc, doc, query, where } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import FatturaForm from "../components/FatturaForm";


function Fatture() {
  const [fatture, setFatture] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [filtri, setFiltri] = useState({});
  const [ordinamento, setOrdinamento] = useState({
    colonna: null,
    direzione: "asc",
  });
  const [colonnaFiltroAperta, setColonnaFiltroAperta] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [user] = useAuthState(auth); 

  useEffect(() => {
    const fetchFatture = async () => {
      try {
        const fattureRef = collection(db, "fatture");
        
        const q = user 
        ? query(fattureRef, where("userId", "==", user.uid)) 
        : fattureRef;
        
        const fattureSnapshot = await getDocs(q);
      

        const fattureData = await Promise.all(
          fattureSnapshot.docs.map(async (docSnapshot) => {
            const fatturaData = docSnapshot.data();
            const tipoFatturaRef = doc(db, "tipiFattura", fatturaData.tipo);
            const tipoFatturaSnapshot = await getDoc(tipoFatturaRef);
            const tipoFatturaData = tipoFatturaSnapshot.data();

            return {
              id: docSnapshot.id,
              ...fatturaData,
              descrizioneTipo: tipoFatturaData?.Descrizione || "Tipo non trovato",
            };
          })
        );

        setFatture(fattureData);
      } catch (error) {
        console.error("Errore durante il recupero delle fatture: ", error);
      }
    };

    fetchFatture();
  }, []);

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleFiltroChange = (colonna, valore) => {
    setFiltri((prevFiltri) => ({
      ...prevFiltri,
      [colonna]: valore,
    }));
  };

  const handleOrdinamentoChange = (colonna) => {
    setOrdinamento((prevOrdinamento) => ({
      colonna: colonna,
      direzione:
        prevOrdinamento.colonna === colonna &&
        prevOrdinamento.direzione === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const handleClick = (event, colonna) => {
    setAnchorEl(event.currentTarget);
    setColonnaFiltroAperta(colonna);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setColonnaFiltroAperta(null);
  };

  const fattureFiltrateOrdinate = fatture
    .filter((fattura) =>
      Object.entries(filtri).every(([colonna, valore]) => {
        if (!valore) return true;
        return String(fattura[colonna])
          .toLowerCase()
          .includes(valore.toLowerCase());
      })
    )
    .sort((a, b) => {
      if (ordinamento.colonna) {
        const valoreA = a[ordinamento.colonna];
        const valoreB = b[ordinamento.colonna];
        if (valoreA < valoreB)
          return ordinamento.direzione === "asc" ? -1 : 1;
        if (valoreA > valoreB)
          return ordinamento.direzione === "asc" ? 1 : -1;
      }
      return 0;
    });

  return (
    <div>
      {/* Menu con i bottoni */}
      <ButtonGroup variant="contained" aria-label="outlined primary button group">
        <Button onClick={() => setOpenForm(true)}>Nuova Fattura</Button>
        {/* ... altri bottoni ... */}
      </ButtonGroup>

      {openForm && <FatturaForm onClose={handleCloseForm} />}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={ordinamento.colonna === "numeroFattura"}
                  direction={ordinamento.direzione}
                  onClick={(event) => {
                    handleOrdinamentoChange("numeroFattura");
                    handleClick(event, "numeroFattura");
                  }}
                >
                  Numero Fattura
                </TableSortLabel>
                <Popover
                  open={open && colonnaFiltroAperta === "numeroFattura"}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <TextField
                    size="small"
                    label="Numero"
                    value={filtri.numeroFattura || ""}
                    onChange={(e) =>
                      handleFiltroChange("numeroFattura", e.target.value)
                    }
                    sx={{ mt: 1, width: "100px" }}
                  />
                </Popover>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={ordinamento.colonna === "dataEmissione"}
                  direction={ordinamento.direzione}
                  onClick={(event) => {
                    handleOrdinamentoChange("dataEmissione");
                    handleClick(event, "dataEmissione");
                  }}
                >
                  Data Emissione
                </TableSortLabel>
                <Popover
                  open={open && colonnaFiltroAperta === "dataEmissione"}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <TextField
                    size="small"
                    label="Data"
                    value={filtri.dataEmissione || ""}
                    onChange={(e) =>
                      handleFiltroChange("dataEmissione", e.target.value)
                    }
                    sx={{ mt: 1, width: "100px" }}
                  />
                </Popover>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={ordinamento.colonna === "cliente"}
                  direction={ordinamento.direzione}
                  onClick={(event) => {
                    handleOrdinamentoChange("cliente");
                    handleClick(event, "cliente");
                  }}
                >
                  Cliente
                </TableSortLabel>
                <Popover
                  open={open && colonnaFiltroAperta === "cliente"}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <TextField
                    size="small"
                    label="Cliente"
                    value={filtri.cliente || ""}
                    onChange={(e) =>
                      handleFiltroChange("cliente", e.target.value)
                    }
                    sx={{ mt: 1, width: "100px" }}
                  />
                </Popover>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={ordinamento.colonna === "descrizioneTipo"}
                  direction={ordinamento.direzione}
                  onClick={(event) => {
                    handleOrdinamentoChange("descrizioneTipo");
                    handleClick(event, "descrizioneTipo");
                  }}
                >
                  Tipo
                </TableSortLabel>
                <Popover
                  open={open && colonnaFiltroAperta === "descrizioneTipo"}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <TextField
                    size="small"
                    label="Tipo"
                    value={filtri.descrizioneTipo || ""}
                    onChange={(e) =>
                      handleFiltroChange("descrizioneTipo", e.target.value)
                    }
                    sx={{ mt: 1, width: "100px" }}
                  />
                </Popover>
              </TableCell>
              {/* ... altre colonne ... */}
            </TableRow>
          </TableHead>
          <TableBody>
            {fattureFiltrateOrdinate.map((fattura) => (
              <TableRow key={fattura.id}>
                <TableCell>{fattura.numeroFattura}</TableCell>
                <TableCell>{fattura.dataEmissione}</TableCell>
                <TableCell>{fattura.cliente}</TableCell>
                <TableCell>{fattura.descrizioneTipo}</TableCell>
                {/* ... altre colonne ... */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Fatture;