'use client';

import { genericService } from '@/core/services/generic.service';
import { Product } from '@/core/types';
import { Edit, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Función para cargar datos
    const loadProducts = async () => {
        try {
            // ?include=brands,subcategories para que el backend traiga los nombres
            const { data, error, message, success, meta } = await genericService.getAll<Product[]>('products', {
                include: 'brands,subcategories,categories',
                sort: 'id:DESC'
            });
            console.log(error)
            console.log(message)
            console.log(success)
            console.log(meta)
            setProducts(data);
        } catch (error) {
            console.log(error)
            toast.error('Error al cargar productos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    // Función para eliminar
    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;

        try {
            await genericService.delete('products', id);
            toast.success('Producto eliminado');
            loadProducts(); // Recargar lista
        } catch (error) {
            console.log(error)
            toast.error('No se pudo eliminar (quizás tiene órdenes asociadas)');
        }
    };

    if (loading) return <div className="p-8">Cargando productos...</div>;
    console.log(products)

    return (
        <div>
            {/* Cabecera */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Productos</h1>
                <Link
                    href="/dashboard/products/create"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
                >
                    <Plus size={18} /> Nuevo Producto
                </Link>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 border-b font-medium text-gray-900">
                        <tr>
                            <th className="p-4">Imagen</th>
                            <th className="p-4">Nombre</th>
                            <th className="p-4">Precio</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4">Marca</th>
                            <th className="p-4">Categoría</th>
                            <th className="p-4">Sub Categoría</th>
                            <th className="p-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50 transition">
                                <td className="p-4">
                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-12 h-12 object-cover rounded-md border"
                                        // width={512}
                                        // height={512}
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-xs">N/A</div>
                                    )}
                                </td>
                                <td className="p-4 font-medium text-gray-900">{product.name}</td>
                                <td className="p-4">${Number(product.price).toFixed(2)}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {product.stock} un.
                                    </span>
                                </td>
                                <td className="p-4">{product.brands?.name || '-'}</td>
                                <td className="p-4">{product.categories?.name || '-'}</td>
                                <td className="p-4">{product.subcategories?.name || '-'}</td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {products.length === 0 && (
                            <tr>
                                <td colSpan={7} className="p-8 text-center text-gray-400">
                                    No hay productos registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}