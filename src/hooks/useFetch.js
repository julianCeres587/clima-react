
import {useState, useEffect} from "react";

export default function useFetch(url) {

  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {    //consulta la api

    if(!url)return;

    const control = new AbortController(); //crea abortController, leugo lo enlaza a la peticion

    async function consultarApi() {
      setCargando(true);
      setError(null);
      
      try {
        
        const respuesta = await fetch(url, { signal: control.signal }) //enlaza ese abortController con esta peticion '
        if (!respuesta.ok) throw new Error("Error en la respuesta de la API");
        const ciudades = await respuesta.json();
        setDatos(ciudades);

      }
      catch (e) {
        if (e.name === "AbortError") return; //si la peticion fue abortada, no hace nada
        setError("Error al consultar la API: " + e.message);
      }
      setCargando(false);
    }
    consultarApi();

    return () => control.abort()
  }, [url]); //efecto se activa cuando cambia texto de la url a consultar

  return {datos, cargando, error};
}