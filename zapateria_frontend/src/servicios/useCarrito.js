import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../servicios/api";

export function useCarrito() {
  const queryClient = useQueryClient();

  const carritoQuery = useQuery({
    queryKey: ["carrito"],
    queryFn: () => api.get("/carrito/").then((r) => r.data),
  });

  // AGREGAR
  const addToCart = useMutation({
    mutationFn: ({ producto_id, cantidad }) =>
      api.post("/carrito/", { producto_id, cantidad }).then((r) => r.data),

    onMutate: async (nuevo) => {
      // rollback
      await queryClient.cancelQueries({ queryKey: ["carrito"] });
      const previo = queryClient.getQueryData(["carrito"]) || [];
      queryClient.setQueryData(["carrito"], (old = []) => {
        const existe = old.find((i) => i.producto?.id === nuevo.producto_id);

        if (existe) {
          return old.map((i) =>
            i.producto?.id === nuevo.producto_id
              ? Object.assign({}, i, { cantidad: i.cantidad + nuevo.cantidad })
              : i
          );
        }

        return [...old,
          { id: Date.now(), cantidad: nuevo.cantidad,producto: { id: nuevo.producto_id },},
        ];
      });

      return { previo };
    },

    onError: (err, nuevo, ctx) => {
      if (ctx?.previo) {
        queryClient.setQueryData(["carrito"], ctx.previo);
      }
      
      // Invalidar para refrescar datos del servidor
      queryClient.invalidateQueries({ queryKey: ["carrito"] });
    },

    onSuccess: () => {
      // Invalidar para sincronizar con el servidor
      queryClient.invalidateQueries({ queryKey: ["carrito"] });
    },
  });

  // ACTUALIZAR CANTIDAD
  const updateCantidad = useMutation({
    mutationFn: ({ id, cantidad }) =>
      api.patch(`/carrito/${id}/`, { cantidad }).then((r) => r.data),

    onMutate: async ({ id, cantidad }) => {
      // Cancelar queries en curso
      await queryClient.cancelQueries({ queryKey: ["carrito"] });
      
      // Guardar estado previo para rollback
      const previo = queryClient.getQueryData(["carrito"]) || [];
      queryClient.setQueryData(["carrito"], (old = []) =>
        old.map((i) => (i.id === id ? { ...i, cantidad } : i))
      );
      return { previo };
    },
    onError: (err, data, ctx) => {
      //error
      if (ctx?.previo) {
        queryClient.setQueryData(["carrito"], ctx.previo);
      }
      queryClient.invalidateQueries({ queryKey: ["carrito"] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carrito"] });
    },
  });
  // ELIMINAR
  const deleteItem = useMutation({
    mutationFn: (id) => api.delete(`/carrito/${id}/`),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["carrito"] });
      const previo = queryClient.getQueryData(["carrito"]) || [];

      // Optimistic update
      queryClient.setQueryData(["carrito"], (old = []) =>
        old.filter((i) => i.id !== id)
      );

      return { previo };
    },

    onError: (err, id, ctx) => {
      // Rollback en caso de error
      if (ctx?.previo) {
        queryClient.setQueryData(["carrito"], ctx.previo);
      }
      // Invalidar para refrescar datos del servidor
      queryClient.invalidateQueries({ queryKey: ["carrito"] });
    },

    onSuccess: () => {
      // Invalidar para sincronizar con el servidor
      queryClient.invalidateQueries({ queryKey: ["carrito"] });
    },
  });

  return { carritoQuery, addToCart, updateCantidad, deleteItem };
}
