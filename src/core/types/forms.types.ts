/**
 * ==========================================
 * REACT HOOK FORM TYPES
 * ==========================================
 * Propósito: Tipar los valores crudos del formulario.
 * Los inputs HTML suelen manejar strings antes de ser convertidos.
 */

// Formulario: Crear/Editar Producto
export interface CreateProductForm {
    name: string;
    description: string;

    // Usamos string | number porque el input HTML devuelve string por defecto
    price: string | number;
    stock: string | number;

    // Los <select> siempre devuelven el value como string
    brands_id: string;
    categories_id: string;
    subcategories_id: string;

    // El input type="file" devuelve un FileList, no un File único
    imageFile: FileList;
}

// Formulario: Login
export interface LoginForm {
    email: string;
    password: string;
}

// Formulario: Registro
export interface RegisterForm {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string; // Campo extra solo para validación visual
}