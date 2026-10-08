# Clima React

Aplicación web desarrollada con **React** y **Vite** para consultar el clima actual y el pronóstico de los próximos siete días de cualquier ciudad del mundo, utilizando la API gratuita de **[Open-Meteo](https://open-meteo.com/)**.

---

## ¿Qué hace la aplicación?

- **Búsqueda inteligente de ciudades:** Busca ciudades por nombre con geocodificación automática y optimización mediante debounce (`useDebounce`) para evitar peticiones innecesarias mientras escribes.
- **Clima actual:** Muestra la temperatura en tiempo real, descripción de la condición del clima con iconos descriptivos y velocidad del viento.
- **Pronóstico a 7 días:** Desglose diario con temperaturas máximas y mínimas proyectadas.
- **Resumen semanal optimizado:** Calcula de forma eficiente con `useMemo` la temperatura máxima y mínima de la semana y resalta el día más caluroso.
- **Control de interfaz:** Enfoque automático y botón de limpieza rápida implementados con `useRef`.
- **Hooks personalizados:** Manejo centralizado y desacoplado de peticiones asíncronas con cancelación vía `AbortController` (`useFetch`).

---

## Tecnologías utilizadas

- **React 19**
- **Vite**
- **Hooks de React:** `useState`, `useEffect`, `useMemo`, `useRef`, y hooks personalizados (`useFetch`, `useDebounce`).
- **Open-Meteo API:**
  - *Geocoding API:* búsqueda de coordenadas de ciudades.
  - *Weather Forecast API:* obtención del clima actual y diario.

---

## Instalación y ejecución local

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/julianCeres587/clima-react.git
   ```

2. Entrar al directorio del proyecto:
   ```bash
   cd clima-react
   ```

3. Instalar las dependencias:
   ```bash
   npm install
   ```

4. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

5. Abrir en el navegador en la URL indicada (usualmente `http://localhost:5173`).
