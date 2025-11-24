from rest_framework.routers import DefaultRouter
from .views import CategoriaViewSet, ProductoViewSet, CarritoViewSet

router = DefaultRouter()
router.register(r'categorias', CategoriaViewSet)
router.register(r'productos', ProductoViewSet)
router.register(r'carrito', CarritoViewSet, basename='carrito')

urlpatterns = router.urls