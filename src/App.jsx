import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import { useState, useEffect } from 'react';


export default function App() {

  const [texto, setTexto] = useState("");
  const [datos, setDatos] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const ciudad = texto.trim().toLowerCase();
  const buscar = ciudad.length >= 3;

  let ciudadesEncontradas = [];
  if (datos && datos.results) {
    ciudadesEncontradas = datos.results;
  }
  useEffect(() => {    //consulta la api

    if (!buscar) return;

    const control = new AbortController(); //crea abortController, leugo lo enlaza a la peticion

    async function consultarApi() {
      setLoading(true);
      setError(null);

      try {
        const URL = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(ciudad)}&count=5&language=es`
        const respuesta = await fetch(URL, { signal: control.signal }) //enlaza ese abortController con esta peticion '
        if (!respuesta.ok) throw new Error("Error en la respuesta de la API");
        const ciudades = await respuesta.json();
        setDatos(ciudades);

      }
      catch (e) {
        if (e.name === "AbortError") return; //si la peticion fue abortada, no hace nada
        setError("Error al consultar la API: " + e.message);
      }
      setLoading(false);
    }
    consultarApi();

    return () => control.abort()
  }, [texto]); //efecto se activa cuando cambia texto

  const buscando = buscar && loading;
  const mostrarError = buscar && error;
  const sinResultados = buscar && !loading && !error && ciudadesEncontradas.length === 0;
  const mostrarCiudades = buscar && !loading && !error && ciudadesEncontradas.length > 0;

  return (
    <div>

      <h1>Clima</h1>
      <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Busca una ciudad" />

      {buscando && <p>Buscando...</p>}
      {mostrarError && <p>{error}</p>}
      {sinResultados && <p>Sin resultados</p>}
      {mostrarCiudades && (
        <ul>
          {ciudadesEncontradas.map((c) => (
            <li key={c.id}>
              {c.name}, {c.admin1}, {c.country} 
            </li>
          ))}
        </ul>
      )}
    </div>
  );

}

