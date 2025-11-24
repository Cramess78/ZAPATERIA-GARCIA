import { useQuery } from "@tanstack/react-query";
import api from "./api";

export function useCategorias() {
  return useQuery({
    queryKey: ["categorias"],
    queryFn: () => api.get("/categorias/").then((r) => r.data),
  });
}

export function useProductosPorCategoria(categoriaId) {
  return useQuery({
    queryKey: ["productos", "categoria", categoriaId],
    queryFn: () =>
      api
        .get("/productos/", { params: { categoria: categoriaId } })
        .then((r) => r.data),
    enabled: !!categoriaId,
  });
}

