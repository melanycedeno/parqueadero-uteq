import { db } from "../services/firebase";
import { ref, set } from "firebase/database";
import { generarEspacios } from "./generarEspacios";

export async function cargarEspaciosIniciales() {
  const espacios = generarEspacios();
  const updates = {};
  espacios.forEach((e) => {
    updates[`espacios/${e.id}`] = e;
  });
  await set(ref(db, "espacios"), Object.fromEntries(
    espacios.map((e) => [e.id, e])
  ));
  console.log("Espacios cargados:", espacios.length);
}