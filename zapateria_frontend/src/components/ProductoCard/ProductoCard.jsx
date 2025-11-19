import { Link } from "react-router-dom";
import "./ProductoCard.css";

function ProductoCard({ p, onAddToCart }) {
  return (
    <div className="card">
      <img src={p.imagen} alt={p.nombre} className="card-img" />

      <h3>{p.nombre}</h3>
      <p className="descripcion">{p.descripcion}</p>
      <p className="precio">S/. {p.precio}</p>

      <Link to={`/producto/${p.id}`} className="btn-ver">
        Ver más
      </Link>

      <button className="btn-carrito" onClick={() => onAddToCart(p)}>
        Agregar al carrito
      </button>
    </div>
  );
}

export default ProductoCard;
