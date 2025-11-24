import { Link } from "react-router-dom";
import { useCategorias } from "../servicios/useCategorias";
import { useQueryClient } from "@tanstack/react-query";
import api from "../servicios/api";

export default function Categorias() {
  const { data: categorias, isLoading, error } = useCategorias();
  const queryClient = useQueryClient();

  const handleMouseEnter = (categoriaId) => {
    queryClient.prefetchQuery({
      queryKey: ["productos", "categoria", categoriaId],
      queryFn: () =>
        api
          .get("/productos/", { params: { categoria: categoriaId } })
          .then((r) => r.data),
    });
  };

  if (isLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Cargando categorías...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p style={{ color: "red" }}>Error al cargar categorías</p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
        Categorías
      </h1>

      {categorias && categorias.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {categorias.map((categoria) => (
            <Link
              key={categoria.id}
              to={`/categoria/${categoria.id}`}
              onMouseEnter={() => handleMouseEnter(categoria.id)}
              style={{
                padding: "2rem",
                backgroundColor: "#f2f2f7",
                borderRadius: "18px",
                textDecoration: "none",
                color: "inherit",
                textAlign: "center",
                boxShadow:
                  "4px 4px 12px rgba(0,0,0,0.1), -4px -4px 12px rgba(255,255,255,0.9)",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "6px 6px 16px rgba(0,0,0,0.15), -6px -6px 16px rgba(255,255,255,1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "4px 4px 12px rgba(0,0,0,0.1), -4px -4px 12px rgba(255,255,255,0.9)";
              }}
            >
              <h2 style={{ margin: 0, fontSize: "1.5rem" }}>
                {categoria.nombre}
              </h2>
            </Link>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: "center" }}>No hay categorías disponibles</p>
      )}
    </div>
  );
}

