import { Link } from "react-router-dom";
import { useCarrito } from "../servicios/useCarrito";


export default function Carrito() {
  const { carritoQuery, updateCantidad, deleteItem } = useCarrito();

  if (carritoQuery.isLoading) return <p>Cargando carrito...</p>;

  const carrito = carritoQuery.data || [];
  const total = carrito
    .reduce((sum, i) => sum + i.producto.precio * i.cantidad, 0)
    .toFixed(2);

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <h2
        style={{
          marginBottom: "2rem",
          textAlign: "center",
          fontSize: "1.8rem",
        }}
      >
        Tu Carrito
      </h2>

      {carrito.length === 0 ? (
        <>
          <p style={{ textAlign: "center", fontSize: "1rem" }}>
            Tu carrito está vacío.
          </p>

          <div style={{ textAlign: "center" }}>
            <Link
              to="/"
              style={{
                display: "inline-block",
                marginTop: "1rem",
                padding: "0.8rem 1.5rem",
                backgroundColor: "#007aff",
                color: "#fff",
                borderRadius: "14px",
                textDecoration: "none",
                fontSize: "1rem",
                boxShadow:
                  "2px 2px 6px rgba(0,0,0,0.2), -2px -2px 6px rgba(255,255,255,0.8)",
              }}
            >
              Volver a la tienda
            </Link>
          </div>
        </>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.2rem",
            }}
          >
            {carrito.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1rem",
                  borderRadius: "18px",
                  background: "#f2f2f7",
                  boxShadow:
                    "4px 4px 12px rgba(0,0,0,0.1), -4px -4px 12px rgba(255,255,255,0.9)",
                }}
              >
                <img
                  src={item.producto.imagen}
                  alt={item.producto.nombre}
                  style={{
                    width: "90px",
                    height: "90px",
                    objectFit: "contain",
                    borderRadius: "14px",
                    backgroundColor: "#fff",
                    padding: "0.5rem",
                    boxShadow:
                      "inset 2px 2px 5px rgba(0,0,0,0.1), inset -2px -2px 5px rgba(255,255,255,1)",
                  }}
                />

                <div style={{ flexGrow: 1 }}>
                  <h3 style={{ margin: 0, fontSize: "1.1rem" }}>
                    {item.producto.nombre}
                  </h3>

                  <strong style={{ fontSize: "1rem" }}>
                    S/. {item.producto.precio}
                  </strong>
                </div>

                {/* BOTONES + / - */}
                <button
                  onClick={() =>
                    updateCantidad.mutate({
                      id: item.id,
                      cantidad: item.cantidad - 1,
                    })
                  }
                  style={{
                    padding: "0.3rem 0.8rem",
                    borderRadius: "10px",
                  }}
                  disabled={item.cantidad === 1}
                >
                  -
                </button>

                <span>{item.cantidad}</span>

                <button
                  onClick={() =>
                    updateCantidad.mutate({
                      id: item.id,
                      cantidad: item.cantidad + 1,
                    })
                  }
                  style={{
                    padding: "0.3rem 0.8rem",
                    borderRadius: "10px",
                  }}
                >
                  +
                </button>

                <button
                  style={{
                    marginLeft: "1rem",
                    color: "red",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => deleteItem.mutate(item.id)}
                >
                  X
                </button>
              </div>
            ))}
          </div>

          <p
            style={{
              fontWeight: "bold",
              fontSize: "1.3rem",
              marginTop: "2rem",
              textAlign: "right",
            }}
          >
            Total: S/. {total}
          </p>

          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <Link
              to="/"
              style={{
                display: "inline-block",
                padding: "0.8rem 1.6rem",
                backgroundColor: "#007aff",
                color: "#fff",
                borderRadius: "14px",
                textDecoration: "none",
                fontSize: "1rem",
                boxShadow:
                  "2px 2px 6px rgba(0,0,0,0.2), -2px -2px 6px rgba(255,255,255,0.8)",
              }}
            >
              Seguir comprando
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
