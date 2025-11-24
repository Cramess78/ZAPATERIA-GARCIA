from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from .models import Categoria, Producto, CarritoItem
from .serializers import CategoriaSerializer, ProductoSerializer, CarritoItemSerializer

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    def get_queryset(self):
        queryset = Producto.objects.all()
        categoria_id = self.request.query_params.get('categoria', None)
        if categoria_id:
            queryset = queryset.filter(categoria_id=categoria_id)
        return queryset
class CarritoViewSet(viewsets.ViewSet):

    def list(self, request):
        items = CarritoItem.objects.all()
        serializer = CarritoItemSerializer(items, many=True)
        return Response(serializer.data)
    def create(self, request):
        try:
            producto_id = request.data.get("producto_id")
            cantidad = request.data.get("cantidad", 1)
            
            if not producto_id:
                raise ValidationError({"producto_id": "Este campo es requerido"})
            if cantidad <= 0:
                raise ValidationError({"cantidad": "La cantidad debe ser mayor a 0"})
            if cantidad > 100:
                raise ValidationError({"cantidad": "La cantidad máxima permitida es 100"})
            
            try:
                producto = Producto.objects.get(id=producto_id)
            except Producto.DoesNotExist:
                raise ValidationError({"producto_id": "Producto no encontrado"})
            
            # validar stock 
            if producto.stock <= 0:
                raise ValidationError({
                    "cantidad": f"Producto sin stock"
                })
            elif cantidad > producto.stock:
                raise ValidationError({
                    "cantidad": f"Stock insuficiente: {producto.stock}"
                })

            # incrementar cantidad
            item, creado = CarritoItem.objects.get_or_create(
                producto=producto,
                defaults={"cantidad": cantidad}
            )

            if not creado:
                nueva_cantidad = item.cantidad + cantidad
                # Validar stock total
                if nueva_cantidad > producto.stock:
                    raise ValidationError({
                        "cantidad": f"Stock insuficiente. Ya tienes {item.cantidad} en el carrito. Disponible: {producto.stock}"
                    })
                item.cantidad = nueva_cantidad
                item.save()

            serializer = CarritoItemSerializer(item)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError:
            raise
        except Exception as e:
            # Log del error para debugging
            import traceback
            traceback.print_exc()
            raise ValidationError({"detail": f"Error del servidor: {str(e)}"})

    def update(self, request, pk=None):
        cantidad = request.data.get("cantidad")
        
        if cantidad is None:
            raise ValidationError({"cantidad":"Este campo es requerido"})
        if cantidad <= 0:
            raise ValidationError({"cantidad":"La cantidad debe ser mayor a 0"})
        if cantidad > 100:
            raise ValidationError({"cantidad":"La cantidad máxima permitida es 100"})
        
        try:
            item = CarritoItem.objects.get(id=pk)
        except CarritoItem.DoesNotExist:
            raise ValidationError({"detail":"Item del carrito no encontrado"})
        
        # validar stock disponible
        if cantidad > item.producto.stock:
            raise ValidationError({
                "cantidad": f"Stock insuficiente. Disponible: {item.producto.stock}"
            })
        
        item.cantidad = cantidad
        item.save()

        return Response(CarritoItemSerializer(item).data)

    def destroy(self, request, pk=None):
        try:
            item = CarritoItem.objects.get(id=pk)
            item.delete()
            return Response(status=204)
        except CarritoItem.DoesNotExist:
            raise ValidationError({"detail": "Item del carrito no encontrado"})