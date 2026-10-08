export default function ListaCiudades({ ciudades, onSeleccionarCiudad }) {
  return (
    <ul className="buscador__lista">
      {ciudades.map((c) => (
        <li
          key={c.id}
          className="buscador__item"
          onClick={() => onSeleccionarCiudad(c)}
        >
          {c.name}, {c.admin1 ? `${c.admin1}, ` : ''}{c.country}
        </li>
      ))}
    </ul>
  );
}
