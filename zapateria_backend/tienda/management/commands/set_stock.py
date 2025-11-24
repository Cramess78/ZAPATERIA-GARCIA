from django.core.management.base import BaseCommand
from tienda.models import Producto


class Command(BaseCommand):
    help = 'Establece stock para productos que no tienen stock'

    def add_arguments(self, parser):
        parser.add_argument(
            '--stock',
            type=int,
            default=10,
            help='Cantidad de stock a asignar (default: 10)',
        )

    def handle(self, *args, **options):
        stock_value = options['stock']
        productos = Producto.objects.filter(stock=0)
        
        count = productos.update(stock=stock_value)
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Se actualizó el stock de {count} producto(s) a {stock_value}'
            )
        )

