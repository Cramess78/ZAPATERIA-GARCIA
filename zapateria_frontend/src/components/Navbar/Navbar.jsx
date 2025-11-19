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

      <Link to="/carrito" className={`carritoBtn ${pulse ? "pulse" : ""}`}>
        Carrito

        {carrito.length > 0 && (
          <span className={`badge ${pulse ? "badgePulse" : ""}`}>
            {carrito.length}
          </span>
        )}
      </Link>
    </nav>
  );
}

export default Navbar;
