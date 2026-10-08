
import './App.css'
import { useState } from 'react';
import useFetch from './hooks/useFetch';
import { describirClima } from './clima';

export default function App() {

  const [texto, setTexto] = useState("");
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState(null);
 
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
  };

  return (
    <div className="buscador">

      <h1 className="buscador__titulo">Clima</h1>
      <div className="buscador__fila">
        <input
          className="buscador__input"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Busca una ciudad"
        />
        <button className="buscador__limpiar" onClick={limpiarBusqueda}>Limpiar</button>
      </div>
     
      {buscando && <p className="buscador__mensaje">Buscando...</p>}
      {mostrarError && <p className="buscador__mensaje buscador__mensaje--error">{respuestaCiudades.error}</p>}
      {sinResultados && <p className="buscador__mensaje">Sin resultados</p>}
      {mostrarCiudades && (
        <ul className="buscador__lista">
          {ciudadesEncontradas.map((c) => (
            <li
              key={c.id}
              className="buscador__item"
              onClick={() => seleccionarCiudad(c)}
            >
              {c.name}, {c.admin1 ? `${c.admin1}, ` : ''}{c.country} 
            </li>
          ))}
        </ul>
      )}

      {/* Sección del Pronóstico */}
      {ciudadSeleccionada && respuestaPronostico.cargando && (
        <p className="buscador__mensaje">Cargando pronóstico...</p>
      )}

      {ciudadSeleccionada && respuestaPronostico.error && (
        <p className="buscador__mensaje buscador__mensaje--error">{respuestaPronostico.error}</p>
      )}

      {ciudadSeleccionada && respuestaPronostico.datos && (
        <div className="pronostico">
          <h2 className="pronostico__ciudad">{ciudadSeleccionada.name}</h2>
          
          {respuestaPronostico.datos.current && (
            <div className="pronostico__actual">
              <span className="pronostico__temp">
                {respuestaPronostico.datos.current.temperature_2m} °C
              </span>
              <span> · {describirClima(respuestaPronostico.datos.current.weather_code)}</span>
              <span> · viento {respuestaPronostico.datos.current.wind_speed_10m} km/h</span>
            </div>
          )}

          {respuestaPronostico.datos.daily && (
            <div className="pronostico__semana">
              {respuestaPronostico.datos.daily.time.map((fecha, i) => {
                const diaSemana = new Date(`${fecha}T00:00:00`).toLocaleDateString('es-ES', { weekday: 'short' });
                const diaCapitalizado = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1, 3);
                const codigoClima = respuestaPronostico.datos.daily.weather_code[i];
                const icono = describirClima(codigoClima).split(' ')[0];
                const min = Math.round(respuestaPronostico.datos.daily.temperature_2m_min[i]);
                const max = Math.round(respuestaPronostico.datos.daily.temperature_2m_max[i]);

                return (
                  <div key={fecha} className="pronostico__dia">
                    <div>{diaCapitalizado}</div>
                    <div className="pronostico__dia-icono">{icono}</div>
                    <div>{min}–{max}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

