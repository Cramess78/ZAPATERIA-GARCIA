"""
Script para verificar si el campo stock existe en la base de datos
Ejecutar: python verificar_stock.py
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'zapateria_backend.settings')
django.setup()

from tienda.models import Producto
from django.db import connection

# Verificar si el campo stock existe en la tabla
cursor = connection.cursor()
cursor.execute("PRAGMA table_info(tienda_producto)")
columns = [row[1] for row in cursor.fetchall()]

if 'stock' in columns:
    print("✅ El campo 'stock' existe en la base de datos")
    
    # Verificar productos sin stock
    productos_sin_stock = Producto.objects.filter(stock=0).count()
    productos_con_stock = Producto.objects.exclude(stock=0).count()
    
    print(f"📊 Productos con stock > 0: {productos_con_stock}")
    print(f"📊 Productos con stock = 0: {productos_sin_stock}")
    
    if productos_sin_stock > 0:
        print(f"\n⚠️  Hay {productos_sin_stock} productos sin stock.")
        print("   Ejecuta: python manage.py set_stock --stock 10")
else:
    print("❌ El campo 'stock' NO existe en la base de datos")
    print("   Ejecuta: python manage.py migrate")
    print("   Luego: python manage.py set_stock --stock 10")

