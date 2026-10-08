import { describirClima } from '../clima';
import PronosticoSemanal from './PronosticoSemanal';

export default function PronosticoDetalle({ ciudad, datosPronostico, resumenSemana }) {
  if (!datosPronostico) return null;

  return (
    <div className="pronostico">
      <h2 className="pronostico__ciudad">{ciudad.name}</h2>

      {datosPronostico.current && (
        <div className="pronostico__actual">
          <span className="pronostico__temp">
            {datosPronostico.current.temperature_2m} °C
          </span>
          <span> · {describirClima(datosPronostico.current.weather_code)}</span>
          <span> · viento {datosPronostico.current.wind_speed_10m} km/h</span>
        </div>
      )}

      {resumenSemana && (
        <p className="pronostico__resumen">
          Esta semana: máxima {resumenSemana.max} °C, mínima {resumenSemana.min} °C. El día más caluroso es el {resumenSemana.diaMasCaluroso}.
        </p>
      )}

      {datosPronostico.daily && (
        <PronosticoSemanal daily={datosPronostico.daily} />
      )}
    </div>
  );
}
