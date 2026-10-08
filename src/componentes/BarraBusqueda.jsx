export default function BarraBusqueda({ texto, onCambiarTexto, onLimpiar }) {
  return (
    <div className="buscador__fila">
      <input
        className="buscador__input"
        value={texto}
        onChange={(e) => onCambiarTexto(e.target.value)}
        placeholder="Busca una ciudad"
      />
      <button className="buscador__limpiar" onClick={onLimpiar}>
        Limpiar
      </button>
    </div>
  );
}
