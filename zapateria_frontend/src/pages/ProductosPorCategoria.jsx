import { useParams, Link } from "react-router-dom";
import { useProductosPorCategoria, useCategorias } from "../servicios/useCategorias";
import ProductoCard from "../components/ProductoCard/ProductoCard";
import { useQueryClient } from "@tanstack/react-query";
import api from "../servicios/api";

export default function ProductosPorCategoria({ onAddToCart }) {
  const { id } = useParams();
  const { data: productos, isLoading, error } = useProductosPorCategoria(id);
  const { data: categorias } = useCategorias();
  const queryClient = useQueryClient();

  // Prefetch detalle de producto al pasar el mouse
  const handleProductMouseEnter = (productoId) => {
    queryClient.prefetchQuery({
      queryKey: ["producto", productoId],
      queryFn: () => api.get(`/productos/${productoId}/`).then((r) => r.data),
    });
  };

  const categoria = categorias?.find((c) => c.id === parseInt(id));

  if (isLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p style={{ color: "red" }}>Error al cargar productos</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <Link
          to="/categorias"
          style={{
            display: "inline-block",
            marginBottom: "1rem",
            color: "#007aff",
            textDecoration: "none",
          }}
        >
          ← Volver a categorías
        </Link>
        <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          {categoria ? `Productos: ${categoria.nombre}` : "Productos"}
        </h1>
      </div>

      {productos && productos.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {productos.map((p) => (
            <div
              key={p.id}
              onMouseEnter={() => handleProductMouseEnter(p.id)}
            >
              <ProductoCard p={p} onAddToCart={onAddToCart} />
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: "center" }}>
          No hay productos en esta categoría
        </p>
      )}
    </div>
  );
}

