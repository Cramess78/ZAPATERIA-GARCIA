import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function DetalleProducto({ onAddToCart }) {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/productos/${id}/`)
      .then(res => setProducto(res.data))
      .catch(err => console.error('Error al cargar producto:', err));
  }, [id]);

  if (!producto) return <p style={{ padding: '2rem' }}>Cargando producto...</p>;

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2>{producto.nombre}</h2>
      <img src={producto.imagen} alt={producto.nombre} style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} />
      <p style={{ marginTop: '1rem' }}>{producto.descripcion}</p>
      <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>S/. {producto.precio}</p>
      <button
        onClick={() => onAddToCart(producto)}
        style={{
          marginTop: '1rem',
          padding: '0.6rem 1.2rem',
          backgroundColor: '#28a745',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Añadir al carrito
      </button>
    </div>
  );
}

export default DetalleProducto;