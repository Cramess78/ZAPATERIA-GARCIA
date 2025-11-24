import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";

function Navbar({ carrito }) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (carrito.length > 0) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 700);
      return () => clearTimeout(timer);
    }
  }, [carrito.length]);

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        Zapatería
      </Link>

      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Link
          to="/categorias"
          style={{
            textDecoration: "none",
            color: "inherit",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          Categorías
        </Link>

        <Link to="/carrito" className={`carritoBtn ${pulse ? "pulse" : ""}`}>
          Carrito

          {carrito.length > 0 && (
            <span className={`badge ${pulse ? "badgePulse" : ""}`}>
              {carrito.length}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
