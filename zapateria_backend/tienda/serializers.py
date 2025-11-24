from rest_framework import serializers
from .models import Categoria, Producto, CarritoItem


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = "__all__"


class ProductoSerializer(serializers.ModelSerializer):
    imagen = serializers.ImageField(required=False, allow_null=True)
    
    class Meta:
        model = Producto
        fields = "__all__"


class CarritoItemSerializer(serializers.ModelSerializer):
    producto = ProductoSerializer(read_only=True)

    class Meta:
        model = CarritoItem
        fields = ["id", "producto", "cantidad"]
