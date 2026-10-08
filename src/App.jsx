import './App.css';
import { useState, useMemo, useRef, useEffect } from 'react';
import useFetch from './hooks/useFetch';
import BarraBusqueda from './componentes/BarraBusqueda';
import ListaCiudades from './componentes/ListaCiudades';
import PronosticoDetalle from './componentes/PronosticoDetalle';

export default function App() {
  const [texto, setTexto] = useState("");
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const ciudad = texto.trim().toLowerCase();
  const buscar = ciudad.length >= 3;

  let urlCiudades = null;
  if (buscar) {
    urlCiudades = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(ciudad)}&count=5&language=es`;
  }

  const respuestaCiudades = useFetch(urlCiudades);

  // URL del pronóstico para la ciudad seleccionada usando el mismo hook useFetch
  const urlPronostico = ciudadSeleccionada
    ? `https://api.open-meteo.com/v1/forecast?latitude=${ciudadSeleccionada.latitude}&longitude=${ciudadSeleccionada.longitude}&current=temperature_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`
    : null;

  const respuestaPronostico = useFetch(urlPronostico);

  const resumenSemana = useMemo(() => {
    if (!respuestaPronostico.datos || !respuestaPronostico.datos.daily) return null;
    console.log("calculando resumen");

    const daily = respuestaPronostico.datos.daily;
    const maxSemana = Math.max(...daily.temperature_2m_max);
    const minSemana = Math.min(...daily.temperature_2m_min);
    const indiceMasCaluroso = daily.temperature_2m_max.indexOf(maxSemana);
    const diaMasCaluroso = daily.time[indiceMasCaluroso];

    return {
      max: maxSemana,
      min: minSemana,
      diaMasCaluroso
    };
  }, [respuestaPronostico.datos]);

  let ciudadesEncontradas = [];
  if (respuestaCiudades.datos && respuestaCiudades.datos.results) {
    ciudadesEncontradas = respuestaCiudades.datos.results;
  }

  const buscando = buscar && respuestaCiudades.cargando;
  const mostrarError = buscar && respuestaCiudades.error;
  const sinResultados = buscar && respuestaCiudades.datos !== null && !respuestaCiudades.cargando && respuestaCiudades.error === null && ciudadesEncontradas.length === 0;
  const mostrarCiudades = buscar && !respuestaCiudades.cargando && respuestaCiudades.error === null && ciudadesEncontradas.length > 0;

  const seleccionarCiudad = (c) => {
    setCiudadSeleccionada(c);
  };

  const limpiarBusqueda = () => {
    setTexto("");
    setCiudadSeleccionada(null);
    inputRef.current?.focus();
  };

  return (
    <div className="buscador">
      <h1 className="buscador__titulo">Clima</h1>

      <BarraBusqueda
        texto={texto}
        onCambiarTexto={setTexto}
        onLimpiar={limpiarBusqueda}
        inputRef={inputRef}
      />

      {buscando && <p className="buscador__mensaje">Buscando...</p>}
      {mostrarError && <p className="buscador__mensaje buscador__mensaje--error">{respuestaCiudades.error}</p>}
      {sinResultados && <p className="buscador__mensaje">Sin resultados</p>}

      {mostrarCiudades && (
        <ListaCiudades
          ciudades={ciudadesEncontradas}
          onSeleccionarCiudad={seleccionarCiudad}
        />
      )}

      {/* Sección del Pronóstico */}
      {ciudadSeleccionada && respuestaPronostico.cargando && (
        <p className="buscador__mensaje">Cargando pronóstico...</p>
      )}

      {ciudadSeleccionada && respuestaPronostico.error && (
        <p className="buscador__mensaje buscador__mensaje--error">{respuestaPronostico.error}</p>
      )}

      {ciudadSeleccionada && respuestaPronostico.datos && (
        <PronosticoDetalle
          ciudad={ciudadSeleccionada}
          datosPronostico={respuestaPronostico.datos}
          resumenSemana={resumenSemana}
        />
      )}
    </div>
  );
}
