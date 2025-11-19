import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DetalleProducto from './pages/DetalleProducto';
import Carrito from './pages/Carrito';
import Navbar from './components/Navbar/Navbar'; // Asegúrate de crearlo
import { useState } from 'react';

function App() {
  const [carrito, setCarrito] = useState([]);

  const handleAddToCart = (producto) => {
    setCarrito([...carrito, producto]);
  };

  return (
    <BrowserRouter>
      <Navbar carrito={carrito} />
      <Routes>
        <Route path="/" element={<Home onAddToCart={handleAddToCart} />} />
        <Route path="/producto/:id" element={<DetalleProducto onAddToCart={handleAddToCart} />} />
        <Route path="/carrito" element={<Carrito carrito={carrito} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;