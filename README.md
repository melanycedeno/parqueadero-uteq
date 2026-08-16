# Estacionamiento Inteligente UTEQ

Aplicación web que simula el funcionamiento de un estacionamiento inteligente ubicado en el campus de la UTEQ (Quevedo). El sistema monitorea **80 espacios de estacionamiento**, organizados en **4 columnas de 20 espacios**, cada uno asociado a un sensor ultrasónico simulado que reporta su estado en tiempo real a través de **Firebase Realtime Database**.

## Descripción del proyecto

Cada espacio cuenta con un sensor que mide una distancia (en centímetros). Con base en esa distancia se determina si el espacio está **libre** u **ocupado**:

```js
const estado = distanciaDetectada <= 50 ? 'ocupado' : 'libre';
```

La aplicación se conecta a Firebase RTDB, escucha los cambios en tiempo real, y una simulación interna actualiza periódicamente algunos sensores para imitar el comportamiento real de un parqueadero (autos entrando y saliendo).

## Ubicación del estacionamiento

El área simulada corresponde a un terreno dentro del campus UTEQ, delimitado por las siguientes coordenadas:

| Punto | Latitud | Longitud |
|-------|---------|----------|
| P1 | -1.0122617572453996 | -79.4682858877737 |
| P2 | -1.0125032549290254 | -79.4682998912032 |
| P3 | -1.0125709715003960 | -79.46748620024898 |
| P4 | -1.0123403901396444 | -79.46746240847104 |

**Bounding box general aproximado:**

```json
{
  "norte": -1.0122617572453996,
  "sur": -1.012570971500396,
  "oeste": -79.4682998912032,
  "este": -79.46746240847104
}
```

## Cálculo del espacio

A partir de las coordenadas del terreno se obtuvo:

- **Largo promedio:** 91,37 m
- **Ancho promedio:** 26,34 m
- **Área aproximada:** 2405,74 m²

Para una cuadrícula uniforme de 4 columnas x 20 espacios:

- **Ancho por columna:** 26,34 / 4 = 6,58 m
- **Largo por espacio:** 91,37 / 20 = 4,57 m
- **Superficie por celda:** ≈ 30,08 m²

Dentro de cada celda se representa un espacio de parqueo de aproximadamente **2,50 m x 5,00 m**, dejando el resto como calles de circulación.

## Tecnologías utilizadas

- **React** (Vite)
- **React Router DOM** — enrutamiento entre páginas
- **Firebase Realtime Database** — almacenamiento y sincronización en tiempo real
- **React Leaflet / Leaflet** — mapa con la ubicación del parqueadero
- **Recharts** — gráfico del historial de distancia por sensor

## Estructura del proyecto

```
src/
├── components/
│   ├── ResumenEstacionamiento.jsx
│   ├── CuadriculaEstacionamiento.jsx
│   ├── EspacioCard.jsx
│   ├── FiltrosEspacios.jsx
│   ├── HistorialEspacio.jsx
│   └── MapaEstacionamiento.jsx
├── hooks/
│   ├── useEspacios.jsx
│   └── useHistorialEspacio.jsx
├── pages/
│   ├── Inicio.jsx
│   ├── Estacionamiento.jsx
│   └── DetalleEspacio.jsx
├── services/
│   └── firebase.js
├── utils/
│   ├── generarEspacios.js
│   ├── cargarEspaciosIniciales.js
│   └── simulador.js
└── App.jsx
```

## Páginas

| Ruta | Descripción |
|------|-------------|
| `/` | Página de inicio con la descripción del proyecto y acceso al estacionamiento |
| `/estacionamiento` | Estadísticas, cuadrícula de 80 espacios, filtros por columna/estado, leyenda de colores y mapa |
| `/espacios/:id` | Detalle de un espacio: estado, distancia, ubicación, bounding box e historial de cambios |

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- Una cuenta de [Firebase](https://console.firebase.google.com/) con un proyecto y una Realtime Database creada

## Instalación y ejecución

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/TU_USUARIO/parqueadero-uteq.git
   cd parqueadero-uteq
   ```

2. Instalar las dependencias:
   ```bash
   npm install
   ```

3. Crear un archivo `.env` en la raíz del proyecto con las credenciales de tu proyecto de Firebase (Configuración del proyecto → Tus apps → Configuración del SDK):
   ```
   VITE_FIREBASE_API_KEY=AIzaSyDd-1ooLqdkXpIJNND8Djk-FYFIjX5VEv0
   VITE_FIREBASE_AUTH_DOMAIN=parqueadero-uteq-cc5e7.firebaseapp.com
   VITE_FIREBASE_DATABASE_URL=https://parqueadero-uteq-cc5e7-default-rtdb.firebaseio.com
   VITE_FIREBASE_PROJECT_ID=parqueadero-uteq-cc5e7
   VITE_FIREBASE_STORAGE_BUCKET=parqueadero-uteq-cc5e7.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=677363323084
   VITE_FIREBASE_APP_ID=1:677363323084:web:1642f555f7e9d6ccea3269
   ```

4. Cargar los 80 espacios iniciales en la base de datos (una sola vez). Puedes llamar a la función `cargarEspaciosIniciales()` desde un botón temporal en la app o desde la consola del navegador con la app corriendo.

5. Ejecutar la aplicación en modo desarrollo:
   ```bash
   npm run dev
   ```
   Abrir el navegador en `http://localhost:5173`.

6. (Opcional) Generar la build de producción:
   ```bash
   npm run build
   ```

## Estructura de datos en Firebase RTDB

```json
{
  "espacios": {
    "ESP-C01-01": {
      "id": "ESP-C01-01",
      "columna": 1,
      "numero": 1,
      "distanciaDetectada": 135.4,
      "estado": "libre",
      "fechaHora": 1786676400000,
      "ubicacion": {
        "nombre": "Parqueadero UTEQ",
        "latitud": -1.012270,
        "longitud": -79.468280,
        "boundingBox": {
          "norte": -1.012261,
          "sur": -1.012302,
          "oeste": -79.468299,
          "este": -79.468240
        }
      }
    }
  },
  "historial": {
    "ESP-C01-01": {
      "1786676100000": {
        "distanciaDetectada": 38.5,
        "estado": "ocupado",
        "fechaHora": 1786676100000
      }
    }
  }
}
```

## Simulación de sensores

La aplicación incluye una simulación (`src/utils/simulador.js`) que, cada cierto intervalo de tiempo, selecciona aleatoriamente algunos espacios y actualiza su distancia, estado, fecha/hora y registro histórico, manteniendo siempre una mezcla de espacios libres y ocupados.
