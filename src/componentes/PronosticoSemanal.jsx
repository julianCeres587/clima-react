import { describirClima } from '../clima';

export default function PronosticoSemanal({ daily }) {
  if (!daily || !daily.time) return null;

  return (
    <div className="pronostico__semana">
      {daily.time.map((fecha, i) => {
        const diaSemana = new Date(`${fecha}T00:00:00`).toLocaleDateString('es-ES', { weekday: 'short' });
        const diaCapitalizado = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1, 3);
        const codigoClima = daily.weather_code[i];
        const icono = describirClima(codigoClima).split(' ')[0];
        const min = Math.round(daily.temperature_2m_min[i]);
        const max = Math.round(daily.temperature_2m_max[i]);

        return (
          <div key={fecha} className="pronostico__dia">
            <div>{diaCapitalizado}</div>
            <div className="pronostico__dia-icono">{icono}</div>
            <div>{min}–{max}</div>
          </div>
        );
      })}
    </div>
  );
}
