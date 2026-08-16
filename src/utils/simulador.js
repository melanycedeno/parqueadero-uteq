import { db } from "../services/firebase";
import { ref, update, get } from "firebase/database";

export function iniciarSimulacion(intervaloMs = 8000, cantidadPorCiclo = 6) {
  return setInterval(async () => {
    const snapshot = await get(ref(db, "espacios"));
    const data = snapshot.val();
    if (!data) return;

    const ids = Object.keys(data);
    const seleccionados = [...ids]
      .sort(() => 0.5 - Math.random())
      .slice(0, cantidadPorCiclo);

    const updates = {};
    const ahora = Date.now();

    seleccionados.forEach((id) => {
      const distancia = Math.round(Math.random() * 200 + 10);
      const estado = distancia <= 50 ? "ocupado" : "libre";

      updates[`espacios/${id}/distanciaDetectada`] = distancia;
      updates[`espacios/${id}/estado`] = estado;
      updates[`espacios/${id}/fechaHora`] = ahora;
      updates[`historial/${id}/${ahora}`] = { distanciaDetectada: distancia, estado, fechaHora: ahora };
    });

    update(ref(db), updates);
  }, intervaloMs);
}