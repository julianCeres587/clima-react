
import './App.css'
import { useState} from 'react';
import useFetch from './hooks/useFetch';

export default function App() {

  const [texto, setTexto] = useState("");
 
  const ciudad = texto.trim().toLowerCase();
  const buscar = ciudad.length >= 3;

  let url = null;
  if(buscar){
    url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(ciudad)}&count=5&language=es`
  }

  const respuesta = useFetch(url);

  let ciudadesEncontradas = [];
  if (respuesta.datos &&  respuesta.datos.results) {
    ciudadesEncontradas = respuesta.datos.results;
  }
  

  const buscando = buscar && respuesta.cargando;
  const mostrarError = buscar && respuesta.error;
  const sinResultados = buscar && respuesta.datos!==null && !respuesta.cargando && respuesta.error === null && ciudadesEncontradas.length === 0;
  const mostrarCiudades = buscar && !respuesta.cargando && respuesta.error === null && ciudadesEncontradas.length > 0;

  return (
    <div className="buscador">

      <h1  className="buscador__titulo">Clima</h1>
      <div className="buscador__fila">

         <input className="buscador__input" value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Busca una ciudad" />
         <button className="buscador__limpiar" onClick={()=>setTexto("")}>Limpiar</button>

      </div>
     
      {buscando && <p className="buscador__mensaje">Buscando...</p>}
      {mostrarError && <p className="buscador__mensaje buscador__mensaje--error">{respuesta.error}</p>}
      {sinResultados && <p className="buscador__mensaje">Sin resultados</p>}
      {mostrarCiudades && (
        <ul className="buscador__lista">
          {ciudadesEncontradas.map((c) => (
            <li key={c.id} className="buscador__item">
              {c.name}, {c.admin1}, {c.country} 
            </li>
          ))}
        </ul>
      )}
    </div>
  );

}

