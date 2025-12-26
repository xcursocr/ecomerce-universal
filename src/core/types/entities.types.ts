/**
 * ==========================================
 * DATABASE ENTITIES (Modelos)
 * ==========================================
 * Propósito: Reflejar las tablas de la base de datos.
 * Se usan para mostrar datos en la UI (Tablas, Tarjetas, Perfiles).
 */

// Tabla: users
export interface User {
    id: number;
    email: string;
    role: 'admin' | 'user' | 'editor';
    name?: string;
    username?: string;
    avatar?: string;
    created_at?: string;
}

// Respuesta del Login (Combina tokens y usuario)
export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    userData: User;
}

// Tabla: brands
export interface Brand {
    id: number;
    name: string;
    slug: string;
    image?: string;
}

// Tabla: categories
export interface Category {
    id: number;
    name: string;
    slug: string;
    image?: string;
}

// Tabla: subcategories
export interface Subcategory {
    id: number;
    categories_id: number;
    name: string;
    slug: string;
    // Relación opcional (si haces include=categories)
    categories?: Category;
}

// Tabla: products
export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number; // En DB es DECIMAL, aquí es number
    stock: number;
    image_url: string;
    is_active: boolean;
    created_at: string;

    // Llaves Foráneas (pueden venir o no dependiendo del select)
    brands_id?: number;
    categories_id?: number;
    subcategories_id?: number;

    // ⚠️ RELACIONES DINÁMICAS
    // Tu backend usa nestData, así que si pides ?include=brands, 
    // te devolverá el objeto completo aquí.
    brands?: Brand;
    categories?: Category;
    subcategories?: Subcategory;
}