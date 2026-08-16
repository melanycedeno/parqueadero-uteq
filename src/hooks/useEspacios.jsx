import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { ref, onValue } from "firebase/database";

export function useEspacios() {
  const [espacios, setEspacios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const espaciosRef = ref(db, "espacios");
    const unsubscribe = onValue(espaciosRef, (snapshot) => {
      const data = snapshot.val() || {};
      setEspacios(Object.values(data));
      setCargando(false);
    });
    return () => unsubscribe();
  }, []);

  return { espacios, cargando };
}