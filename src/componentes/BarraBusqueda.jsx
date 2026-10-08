export default function BarraBusqueda({ texto, onCambiarTexto, onLimpiar, inputRef }) {
  return (
    <div className="buscador__fila">
      <input
        ref={inputRef}
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
