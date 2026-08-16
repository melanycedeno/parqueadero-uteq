import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { ref, onValue } from "firebase/database";

export function useHistorialEspacio(id) {
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    if (!id) return;
    const historialRef = ref(db, `historial/${id}`);
    const unsubscribe = onValue(historialRef, (snapshot) => {
      const data = snapshot.val() || {};
      const lista = Object.entries(data)
        .map(([ts, valor]) => ({ timestamp: Number(ts), ...valor }))
        .sort((a, b) => b.timestamp - a.timestamp);
      setHistorial(lista);
    });
    return () => unsubscribe();
  }, [id]);

  return historial;
}