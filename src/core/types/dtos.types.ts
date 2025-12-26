/**
 * ==========================================
 * DTOs (Data Transfer Objects)
 * ==========================================
 * Propósito: Definir el JSON exacto que se envía al Backend.
 * Aquí ya no hay FileList, sino URLs strings, y los números son reales.
 */

// Payload para POST /products
export interface CreateProductPayload {
    name: string;
    slug: string;
    description: string;
    price: number;       // Convertido de string a number
    stock: number;       // Convertido de string a number
    brands_id: number;   // Convertido de string a number
    categories_id: number;
    subcategories_id: number;
    image_url: string;   // URL obtenida tras subir el archivo a DomCloud
    is_active: boolean;
}

// Payload para PUT /products/:id (Partial porque puedes editar solo el precio)
export type UpdateProductPayload = Partial<CreateProductPayload>;

// Payload para POST /auth/register
export interface RegisterUserPayload {
    name: string;
    email: string;
    password: string;
    username?: string;
    role?: string; // Opcional, el backend asigna 'user' por defecto
}