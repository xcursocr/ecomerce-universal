import { genericService } from '@/core/services/generic.service';
import { Product } from '@/core/types';
import ProductCard from '@/ui/molecules/ProductCard';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Hacemos la página async para pedir datos al servidor
export default async function HomePage() {

  // 1. Fetch de productos destacados (Últimos 8)
  // Nota: genericService funciona en el servidor porque axios ignora el interceptor 
  // si no hay window (token), lo cual está bien para datos públicos.
  let products: Product[] = [];

  try {
    products = await genericService.getAll<Product[]>('products', {
      limit: 8,
      sort: 'id:DESC',
      include: 'brands' // Importante para mostrar la marca en la tarjeta
    });

  } catch (error) {
    console.error("Error cargando productos home:", error);
    // Fallback silencioso (array vacío) para que no explote la home
  }

  return (
    <div>
      {/* 🦸 HERO SECTION */}
      <section className="bg-gradient-to-r from-gray-900 to-blue-900 text-white py-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              La Mejor Tecnología <br />
              <span className="text-blue-400">Al Mejor Precio</span>
            </h1>
            <p className="text-lg text-gray-300">
              Descubre nuestra nueva colección de productos importados con garantía oficial y envío a todo el país.
            </p>
            <div className="flex gap-4 pt-4">
              <Link
                href="/shop"
                className="bg-white text-blue-900 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition flex items-center gap-2"
              >
                Ver Catálogo <ArrowRight size={20} />
              </Link>
            </div>
          </div>

          {/* Imagen decorativa (opcional) */}
          <div className="hidden md:block w-96 h-96 bg-white/10 rounded-full blur-3xl absolute right-20 top-20 pointer-events-none"></div>
        </div>
      </section>

      {/* 🛍️ PRODUCTOS DESTACADOS */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Nuevos Ingresos</h2>
          <Link href="/shop" className="text-blue-600 font-medium hover:underline">
            Ver todo
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Aún no hay productos destacados.</p>
            <p className="text-sm text-gray-400 mt-2">Ve al Dashboard para crear algunos.</p>
          </div>
        )}
      </section>

      {/* 📦 FEATURES SECTION */}
      <section className="bg-gray-50 py-16 border-t">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🚀</div>
            <h3 className="font-bold mb-2">Envío Rápido</h3>
            <p className="text-sm text-gray-500">Recibe tu pedido en 24/48hs en todo el país.</p>
          </div>
          <div className="p-6">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🛡️</div>
            <h3 className="font-bold mb-2">Garantía Asegurada</h3>
            <p className="text-sm text-gray-500">Compra protegido con nuestra garantía de satisfacción.</p>
          </div>
          <div className="p-6">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">💳</div>
            <h3 className="font-bold mb-2">Pagos Seguros</h3>
            <p className="text-sm text-gray-500">Aceptamos todas las tarjetas y transferencias.</p>
          </div>
        </div>
      </section>
    </div>
  );
}