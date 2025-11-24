import { useEffect, useState } from "react";
import api from "../servicios/api";
import Filtros from "../components/Filtros/Filtros";
import ProductoCard from "../components/ProductoCard/ProductoCard";

function Home({ onAddToCart }) {
  const [productos, setProductos] = useState([]);
  const [search, setSearch] = useState("");

  const [categoria, setCategoria] = useState("todos");
  const [precioFiltro, setPrecioFiltro] = useState("todos");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");

  useEffect(() => {
    api.get("/productos/")
      .then((res) => setProductos(res.data))
      .catch((err) => console.error("Error al cargar productos:", err));
  }, []);

  const nombres = {
    1: "Niños",
    2: "Sandalias",
    3: "Botas",
    4: "Casuales",
    5: "Deportivos",
  };

  const formatearCategoria = (c) => nombres[c] || c;

  const categoriasUnicas = ["todos", ...new Set(productos.map((p) => formatearCategoria(p.categoria)))];

  const promedio = productos.length
    ? productos.reduce((a, p) => a + parseFloat(p.precio), 0) / productos.length
    : 0;

  const productosFiltrados = productos.filter((p) => {
    const nombreCoincide = p.nombre.toLowerCase().includes(search.toLowerCase());
    const cat = formatearCategoria(p.categoria);
    const categoriaCoincide = categoria === "todos" || cat === categoria;

    let precioCoincide = true;
    if (precioFiltro === "mayor") precioCoincide = p.precio > promedio;
    if (precioFiltro === "menor") precioCoincide = p.precio < promedio;

    if (precioMin && p.precio < precioMin) return false;
    if (precioMax && p.precio > precioMax) return false;

    return nombreCoincide && categoriaCoincide && precioCoincide;
  });

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Zapatería</h1>

      <Filtros
        categoria={categoria}
        setCategoria={setCategoria}
        categoriasUnicas={categoriasUnicas}
        precioFiltro={precioFiltro}
        setPrecioFiltro={setPrecioFiltro}
        precioMin={precioMin}
        setPrecioMin={setPrecioMin}
        precioMax={precioMax}
        setPrecioMax={setPrecioMax}
        search={search}
        setSearch={setSearch}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {productosFiltrados.map((p) => (
          <ProductoCard key={p.id} p={p} onAddToCart={onAddToCart} />
        ))}
      </div>
    </div>
  );
}

export default Home;
