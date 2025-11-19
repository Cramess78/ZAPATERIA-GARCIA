import "./Filtros.css";

function Filtros({
  categoria,
  setCategoria,
  categoriasUnicas,
  precioFiltro,
  setPrecioFiltro,
  precioMin,
  setPrecioMin,
  precioMax,
  setPrecioMax,
  search,
  setSearch
}) {
  return (
    <div className="filtros-container">
      
      <select
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        className="filtro-select"
      >
        {categoriasUnicas.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>

      <select
        value={precioFiltro}
        onChange={(e) => setPrecioFiltro(e.target.value)}
        className="filtro-select"
      >
        <option value="todos">Precio: Todos</option>
        <option value="menor">Menor al promedio</option>
        <option value="mayor">Mayor al promedio</option>
      </select>

      <input
        type="number"
        placeholder="Precio min"
        value={precioMin}
        onChange={(e) => setPrecioMin(e.target.value)}
        className="filtro-input"
      />

      <input
        type="number"
        placeholder="Precio max"
        value={precioMax}
        onChange={(e) => setPrecioMax(e.target.value)}
        className="filtro-input"
      />

      <input
        type="text"
        placeholder="Buscar..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="filtro-input"
      />
    </div>
  );
}

export default Filtros;
