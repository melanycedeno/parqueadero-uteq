// Esquinas del terreno (P1..P4) dadas en el enunciado
const P1 = { lat: -1.0122617572453996, lng: -79.4682858877737 };  // esquina sup-izq
const P2 = { lat: -1.0125032549290254, lng: -79.4682998912032 };  // esquina inf-izq
const P3 = { lat: -1.0125709715003960, lng: -79.46748620024898 }; // esquina inf-der
const P4 = { lat: -1.0123403901396444, lng: -79.46746240847104 }; // esquina sup-der

const COLUMNAS = 4;
const FILAS = 20;

function interpolar(a, b, t) {
  return a + (b - a) * t;
}

// Punto dentro del rectángulo irregular según fracción de columna (u) y fila (v)
function puntoEnTerreno(u, v) {
  // lado superior: P1 -> P4 ; lado inferior: P2 -> P3
  const topLat = interpolar(P1.lat, P4.lat, u);
  const topLng = interpolar(P1.lng, P4.lng, u);
  const botLat = interpolar(P2.lat, P3.lat, u);
  const botLng = interpolar(P2.lng, P3.lng, u);
  return {
    lat: interpolar(topLat, botLat, v),
    lng: interpolar(topLng, botLng, v),
  };
}

export function generarEspacios() {
  const espacios = [];
  for (let col = 1; col <= COLUMNAS; col++) {
    for (let num = 1; num <= FILAS; num++) {
      const uCentro = (col - 0.5) / COLUMNAS;
      const vCentro = (num - 0.5) / FILAS;
      const uNorte = (col - 1) / COLUMNAS;
      const uSur = col / COLUMNAS;
      const vOeste = (num - 1) / FILAS;
      const vEste = num / FILAS;

      const centro = puntoEnTerreno(uCentro, vCentro);
      const esquinaNO = puntoEnTerreno(uNorte, vOeste);
      const esquinaSE = puntoEnTerreno(uSur, vEste);

      const distanciaInicial = Math.round(Math.random() * 200 + 10);
      const id = `ESP-C0${col}-${String(num).padStart(2, "0")}`;

      espacios.push({
        id,
        columna: col,
        numero: num,
        ubicacion: {
          nombre: "Parqueadero UTEQ",
          latitud: centro.lat,
          longitud: centro.lng,
          boundingBox: {
            norte: esquinaNO.lat,
            oeste: esquinaNO.lng,
            sur: esquinaSE.lat,
            este: esquinaSE.lng,
          },
        },
        distanciaDetectada: distanciaInicial,
        estado: distanciaInicial <= 50 ? "ocupado" : "libre",
        fechaHora: Date.now(),
      });
    }
  }
  return espacios;
}