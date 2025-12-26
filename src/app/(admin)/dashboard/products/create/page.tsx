'use client';

import { genericService } from '@/core/services/generic.service';
import { uploadService } from '@/core/services/upload.service';
import { Brand, Category, CreateProductForm, CreateProductPayload, Product, Subcategory } from '@/core/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form'; // Importamos SubmitHandler
import { toast } from 'sonner';

export default function CreateProductPage() {
    const router = useRouter();

    // 1. Tipamos el useForm con nuestra interfaz
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<CreateProductForm>();

    const [brands, setBrands] = useState<Brand[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Tipado explícito en la llamada al servicio
                const [brandsData, catData, subsData] = await Promise.all([
                    genericService.getAll<Brand[]>('brands'),
                    genericService.getAll<Category[]>('categories'),
                    genericService.getAll<Subcategory[]>('subcategories')
                ]);

                setBrands(brandsData);
                setCategories(catData);
                setSubcategories(subsData);
            } catch (error) {
                toast.error('Error cargando listas');
                console.error(error);
            }
        };
        fetchData();
    }, []);


    // 2. Tipamos la función onSubmit
    const onSubmit: SubmitHandler<CreateProductForm> = async (data) => {
        try {
            let imageUrl = '';

            if (data.imageFile && data.imageFile.length > 0) {
                const file = data.imageFile[0];
                const uploadRes = await uploadService.uploadFile(file);
                imageUrl = uploadRes.location;
            }

            // 3. Conversión de Tipos Segura (Form -> Payload)
            const productPayload: CreateProductPayload = {
                name: data.name,
                slug: data.name.toLowerCase().replace(/ /g, '-'),
                description: data.description,
                price: Number(data.price), // Convertir string a number
                stock: Number(data.stock),
                brands_id: Number(data.brands_id),
                categories_id: Number(data.categories_id),
                subcategories_id: Number(data.subcategories_id),
                image_url: imageUrl,
                is_active: true
            };

            // 4. Llamada al servicio con tipos (Product = Respuesta, CreateProductPayload = Envío)
            await genericService.create<Product, CreateProductPayload>('products', productPayload);

            toast.success('Producto creado correctamente');
            router.push('/dashboard/products');

        } catch (error) {
            console.error(error);
            toast.error('Error al crear el producto');
        }
    };

    console.log(categories)

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <h1 className="text-2xl font-bold mb-6">Nuevo Producto</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                <div>
                    <label className="block text-sm font-medium mb-1">Nombre</label>
                    <input
                        {...register('name', { required: 'El nombre es obligatorio' })}
                        className="w-full border rounded-lg p-2"
                    />
                    {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Precio</label>
                        <input
                            type="number" step="0.01"
                            {...register('price', { required: 'Requerido', min: 0 })}
                            className="w-full border rounded-lg p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Stock</label>
                        <input
                            type="number"
                            {...register('stock', { required: 'Requerido', min: 0 })}
                            className="w-full border rounded-lg p-2"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Marca</label>
                        <select
                            {...register('brands_id', { required: 'Selecciona una marca' })}
                            className="w-full border rounded-lg p-2 bg-white"
                        >
                            <option value="">Seleccionar...</option>
                            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                        {errors.brands_id && <span className="text-red-500 text-sm">{errors.brands_id.message}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Categoria</label>
                        <select
                            {...register('categories_id', { required: 'Selecciona una categoría' })}
                            className="w-full border rounded-lg p-2 bg-white"
                        >
                            <option value="">Seleccionar...</option>
                            {categories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Subcategoría</label>
                        <select
                            {...register('subcategories_id', { required: 'Selecciona una subcategoría' })}
                            className="w-full border rounded-lg p-2 bg-white"
                        >
                            <option value="">Seleccionar...</option>
                            {subcategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Descripción</label>
                    <textarea
                        {...register('description')}
                        className="w-full border rounded-lg p-2 h-24"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Imagen</label>
                    <input
                        type="file"
                        accept="image/*"
                        {...register('imageFile')}
                        className="w-full border rounded-lg p-2"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 w-full disabled:opacity-50"
                >
                    {isSubmitting ? 'Guardando...' : 'Crear Producto'}
                </button>

            </form>
        </div>
    );
}