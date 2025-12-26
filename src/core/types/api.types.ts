/**
 * ==========================================
 * API RESPONSE WRAPPERS
 * ==========================================
 * Propósito: Definir la estructura estándar que devuelve tu Backend.
 * Coincide con tu utils/response.utils.js del servidor.
 */

// Estructura de paginación que viene dentro de 'meta'
export interface PaginationMeta {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
}

// Respuesta Genérica de la API
// T = El tipo de dato que esperas (ej: Product, User[])
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    meta?: PaginationMeta; // Opcional, solo viene en listas paginadas
    error: string | null;
}

// Respuesta específica del endpoint /files/upload
export interface FileUploadResponse {
    originalname: string;
    filename: string;
    location: string; // URL pública de la imagen
    mimetype: string;
    size: number;
}

// Tipos para los Query Params estándar de tu Backend
export interface QueryParams {
    page?: number;
    limit?: number;
    sort?: string;    // ej: 'price:DESC'
    q?: string;       // Búsqueda global
    include?: string; // ej: 'brands,categories'
    // Permite filtros dinámicos extra (ej: price_min=100)
    [key: string]: string | number | boolean | undefined;
}

// Tipos literales para evitar errores de dedo en las tablas
export type ApiTable = 'products' | 'users' | 'brands' | 'categories' | 'subcategories' | 'orders';