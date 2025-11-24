import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import DetalleProducto from "./pages/DetalleProducto";
import Carrito from "./pages/Carrito";
import Categorias from "./pages/Categorias";
import ProductosPorCategoria from "./pages/ProductosPorCategoria";
import Navbar from "./components/Navbar/Navbar";
import Notificacion from "./components/Notificacion/Notificacion";
import { useCarrito } from "./servicios/useCarrito";

function App() {
  const { addToCart, carritoQuery } = useCarrito();
  const [notificacion, setNotificacion] = useState({ mensaje: null, tipo: "error" });

  useEffect(() => {
    if (addToCart.isError) {
      const error = addToCart.error?.response?.data;
      let mensaje = "Error al agregar producto al carrito";
      
      if (error) {
        if (error.cantidad) {
          mensaje = Array.isArray(error.cantidad) ? error.cantidad[0] : error.cantidad;
        } else if (error.producto_id) {
          mensaje = Array.isArray(error.producto_id) ? error.producto_id[0] : error.producto_id;
        } else if (error.detail) {
          mensaje = Array.isArray(error.detail) ? error.detail[0] : error.detail;
        } else if (typeof error === "string") {
          mensaje = error;
        }
      }
      
      setNotificacion({ mensaje, tipo: "error" });
    }
  }, [addToCart.isError, addToCart.error]);

  const handleAddToCart = (producto) => {
    setNotificacion({ mensaje: null, tipo: "error" });
    addToCart.mutate({
      producto_id: producto.id,
      cantidad: 1,
    });
  };

  return (
    <BrowserRouter>
      <Navbar carrito={carritoQuery.data || []} />
      <Notificacion
        mensaje={notificacion.mensaje}
        tipo={notificacion.tipo}
        onClose={() => setNotificacion({ mensaje: null, tipo: "error" })}
      />

      <Routes>
        <Route path="/" element={<Home onAddToCart={handleAddToCart} />} />
        <Route
          path="/producto/:id"
          element={<DetalleProducto onAddToCart={handleAddToCart} />}
        />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route
          path="/categoria/:id"
          element={<ProductosPorCategoria onAddToCart={handleAddToCart} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
