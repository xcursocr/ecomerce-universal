## Documentando mi proyecto, tanto la estructura como cada archivo.

#### Tratar errores de Axios

```tsx
if (error instanceof AxiosError) {
  console.error(error.response?.data);
  const msg = error.response?.data?.message || "Credenciales incorrectas";
  toast.error(msg);
}
```

#### ./package.json

```json
{
  "name": "ecomerce-universal",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "axios": "^1.13.2",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "lucide-react": "^0.562.0",
    "next": "16.1.1",
    "nuqs": "^2.8.6",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "react-hook-form": "^7.69.0",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.4.0",
    "zustand": "^5.0.9"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.1.1",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

#### .env.local

```
# URL de tu Backend en Producción (DomCloud)
NEXT_PUBLIC_API_URL=https://gonzapi.domcloud.dev/api/v1
```

#### ./next.config.js

```tsx
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "avatar.iran.liara.run",
      },
      {
        protocol: "https",
        hostname: "gonzapi.domcloud.dev",
        // port: '5004',
        // pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
```

#### Estructura de carpetas

```txt
src/
├── core/                 # 🧠 LÓGICA PURA (Reutilizable)
│   ├── api/              # Axios instance
│   ├── services/         # auth.service, products.service, upload.service
│   ├── store/            # auth.store (Zustand)
│   ├── types/            # Interfaces (User, Product, Brand)
│   └── hooks/            # useAuth, useCart
│
├── ui/                   # 🎨 COMPONENTES VISUALES
│   ├── atoms/            # Button, Input, FileUploadInput
│   ├── components/       # ProductCard, Navbar, AdminSidebar
│   └── styles/           # globals.css
│
└── app/                  # 🌐 RUTAS NEXT.JS
    ├── (auth)/           # Login / Register
    ├── (shop)/           # Tienda Pública (Layout público)
    │     ├── page.tsx
    │     └── product/[slug]/page.tsx
    └── (admin)/          # Dashboard Privado (Layout con Sidebar)
          ├── dashboard/
          └── products/   # CRUD de Productos
```

#### Logica de los types

```txt
src/core/types/
├── api.types.ts       # 📨 El "Sobre": Estructura de respuesta de tu API (meta, success, error)
├── entities.types.ts  # 🗄️ El "Espejo": Reflejo exacto de tus tablas MySQL
├── forms.types.ts     # 📝 El "Borrador": Lo que el usuario escribe en los inputs (strings, files)
├── dtos.types.ts      # 📦 El "Paquete": El JSON limpio que envías al Backend
└── index.ts           # 🔄 El "Barril": Para importar todo desde una sola línea
```

#### ./src/core/types/api.types.ts

```tsx
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
  sort?: string; // ej: 'price:DESC'
  q?: string; // Búsqueda global
  include?: string; // ej: 'brands,categories'
  // Permite filtros dinámicos extra (ej: price_min=100)
  [key: string]: string | number | boolean | undefined;
}

// Tipos literales para evitar errores de dedo en las tablas
export type ApiTable =
  | "products"
  | "users"
  | "brands"
  | "categories"
  | "subcategories"
  | "orders";
```

#### ./src/core/types/entities.types.ts

```tsx
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
  role: "admin" | "user" | "editor";
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
```

#### ./src/core/types/forms.types.ts

```tsx
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
```

#### ./src/core/types/dtos.types.ts

```tsx
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
  price: number; // Convertido de string a number
  stock: number; // Convertido de string a number
  brands_id: number; // Convertido de string a number
  categories_id: number;
  subcategories_id: number;
  image_url: string; // URL obtenida tras subir el archivo a DomCloud
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
```

#### ./src/core/types/index.ts

```tsx
export * from "./api.types";
export * from "./dtos.types";
export * from "./entities.types";
export * from "./forms.types";
```

#### ./src/core/api/axios.ts

```tsx
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. Interceptor de Solicitud: Inyectar Token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Interceptor de Respuesta: Manejo de Refresh Token (401)
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 🛑 VALIDACIÓN CLAVE: Si el error viene del LOGIN, no hacemos nada, solo devolvemos el error.
    // Esto evita el bucle de recarga cuando la contraseña está mal.
    if (originalRequest.url?.includes("/auth/login")) {
      return Promise.reject(error);
    }

    // Si error es 401 y no es un reintento
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        // Si no hay refresh token, no podemos renovar.
        // Pero NO redirigimos si ya estamos en /login para evitar bucles.
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Llamada a tu endpoint de backend para renovar
        const { data } = await axios.post(`${baseURL}/auth/refresh-token`, {
          token: refreshToken,
        });

        const newAccessToken = data.data.token;

        // Guardar nuevo token
        localStorage.setItem("accessToken", newAccessToken);

        // Actualizar header y reintentar la petición original
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        // Si falla la renovación, limpiamos
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        // 🛑 VALIDACIÓN CLAVE 2: Solo redirigir si NO estamos ya en el login
        if (
          typeof window !== "undefined" &&
          window.location.pathname !== "/login"
        ) {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

#### ./src/core/services/upload.service.ts

```tsx
import api from "../api/axios";
import { ApiResponse, FileUploadResponse } from "../types";

export const uploadService = {
  /**
   * Sube un archivo al backend.
   * @param file El objeto File obtenido de un input type="file"
   */
  async uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file); // 'file' debe coincidir con upload.single('file') en tu backend

    const { data } = await api.post<ApiResponse<FileUploadResponse>>(
      "/files/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return data.data; // Retorna { location: 'https://...', filename: '...' }
  },

  async deleteFile(filename: string) {
    const { data } = await api.delete<ApiResponse<{ filename: string }>>(
      `/files/delete/${filename}`
    );
    return data;
  },
};
```

#### ./src/core/services/auth.service.ts

```tsx
import api from "../api/axios";
// Importamos todo desde el "barril" (index.ts)
import {
  ApiResponse,
  AuthResponse,
  LoginForm,
  RegisterUserPayload,
  User,
} from "../types";

export const authService = {
  /**
   * Inicia sesión en el sistema.
   * @param credentials - Objeto tipado con email y password (LoginForm)
   */
  async login(credentials: LoginForm) {
    // En vez de definir { email: string... } manualmente, usamos la interfaz
    const { data } = await api.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      credentials
    );
    return data;
  },

  /**
   * Registra un nuevo usuario.
   * @param userData - Objeto tipado con los datos de registro (RegisterUserPayload)
   */
  async register(userData: RegisterUserPayload) {
    // Usamos el DTO correcto para registro
    const { data } = await api.post<ApiResponse<{ id: number }>>(
      "/auth/register",
      userData
    );
    return data;
  },

  /**
   * Obtiene el perfil del usuario actual usando el token.
   */
  async getProfile() {
    const { data } = await api.get<ApiResponse<User>>("/auth/profile");
    return data;
  },

  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    }
  },
};
```

#### ./src/core/services/generic.service.ts

```tsx
import api from "../api/axios";
import { ApiResponse, ApiTable, QueryParams } from "../types";

export const genericService = {
  /**
   * Obtiene una lista de recursos.
   * @param table Nombre de la tabla (ej: 'products')
   * @param params Filtros, paginación, includes (ej: { page: 1, q: 'nike' })
   */
  async getAll<T>(table: ApiTable, params: QueryParams = {}) {
    // Axios serializa automáticamente los params en la URL
    // ej: /products?page=1&q=nike
    const { data } = await api.get<ApiResponse<T>>(`/${table}`, { params });

    // ⚠️ NOTA IMPORANTE:
    // Aquí estamos retornando solo la data (T).
    // Si en el futuro necesitas la paginación (total, last_page),
    // deberías retornar 'data' completo en lugar de 'data.data'.
    // Por ahora, para dropdowns y listas simples, esto está perfecto.
    return data;
  },

  /**
   * Obtiene una lista CON paginación (Útil para tablas grandes)
   * Retorna { data: T, meta: ... }
   */
  async getPaginated<T>(table: ApiTable, params: QueryParams = {}) {
    const { data } = await api.get<ApiResponse<T>>(`/${table}`, { params });
    return data; // Devuelve todo: data, meta, success
  },

  /**
   * Crea un nuevo registro.
   * @param item El DTO con los datos a crear.
   */
  async create<T, D>(table: ApiTable, item: D) {
    const { data } = await api.post<ApiResponse<T>>(`/${table}`, item);
    return data.data;
  },

  /**
   * Busca por ID.
   */
  async getById<T>(table: ApiTable, id: number) {
    const { data } = await api.get<ApiResponse<T>>(`/${table}/${id}`);
    return data.data;
  },

  /**
   * Actualiza un registro.
   * D = Partial<T> por defecto, pero puedes pasar un DTO específico.
   */
  async update<T, D = Partial<T>>(table: ApiTable, id: number, item: D) {
    const { data } = await api.put<ApiResponse<T>>(`/${table}/${id}`, item);
    return data.data;
  },

  /**
   * Elimina un registro.
   */
  async delete(table: ApiTable, id: number) {
    // Especificamos que la respuesta suele ser el ID o mensaje
    const { data } = await api.delete<ApiResponse<{ id: number }>>(
      `/${table}/${id}`
    );
    return data.data;
  },
};
```

#### ./src/app/layout.tsx

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
```

#### ./src/app/page.tsx

```tsx
export default function Home() {
  return (
    <div>
      <h1>Home Page</h1>
    </div>
  );
}
```

#### ./src/ui/components/auth/AdminGuard.tsx

```tsx
"use client";

import { useAuthStore } from "@/core/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuth, hasHydrated } = useAuthStore();

  useEffect(() => {
    // Solo intentamos redirigir si el store ya cargó (hydrated)
    // y confirmamos que NO está autenticado.
    if (hasHydrated && !isAuth) {
      router.push("/login");
    }
  }, [isAuth, hasHydrated, router]);

  // 1. Mostrar carga mientras Zustand lee el localStorage
  if (!hasHydrated) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 2. Si ya cargó y no tiene permiso, retornamos null para evitar parpadeos
  // (El useEffect de arriba se encargará de redirigir en milisegundos)
  if (!isAuth) {
    return null;
  }

  // 3. Si tiene permiso, renderizamos el contenido
  return <>{children}</>;
}
```

#### ./src/app/(admin)/layout.tsx

```tsx
import AdminGuard from "@/ui/components/auth/AdminGuard";
import AdminSidebar from "@/ui/organisms/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />
        <main className="ml-64 p-8">
          <div className="max-w-5xl mx-auto">{children}</div>
        </main>
      </div>
    </AdminGuard>
  );
}
```

#### ./src/ui/organisms/AdminSidebar.tsx

```tsx
"use client";

import { authService } from "@/core/services/auth.service";
import { LayoutDashboard, LogOut, Package, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Productos", href: "/dashboard/products", icon: Package },
  { name: "Órdenes", href: "/dashboard/orders", icon: ShoppingBag },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-blue-600">AdminPanel</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={() => authService.logout()}
          className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 w-full rounded-lg"
        >
          <LogOut size={20} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
```

#### ./src/app/(admin)/dashboard/products/create/page.tsx

```tsx
"use client";

import { genericService } from "@/core/services/generic.service";
import { uploadService } from "@/core/services/upload.service";
import {
  Brand,
  Category,
  CreateProductForm,
  CreateProductPayload,
  Product,
  Subcategory,
} from "@/core/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form"; // Importamos SubmitHandler
import { toast } from "sonner";

export default function CreateProductPage() {
  const router = useRouter();

  // 1. Tipamos el useForm con nuestra interfaz
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateProductForm>();

  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Tipado explícito en la llamada al servicio
        const [brandsData, catData, subsData] = await Promise.all([
          genericService.getAll<Brand[]>("brands"),
          genericService.getAll<Category[]>("categories"),
          genericService.getAll<Subcategory[]>("subcategories"),
        ]);

        setBrands(brandsData);
        setCategories(catData);
        setSubcategories(subsData);
      } catch (error) {
        toast.error("Error cargando listas");
        console.error(error);
      }
    };
    fetchData();
  }, []);

  // 2. Tipamos la función onSubmit
  const onSubmit: SubmitHandler<CreateProductForm> = async (data) => {
    try {
      let imageUrl = "";

      if (data.imageFile && data.imageFile.length > 0) {
        const file = data.imageFile[0];
        const uploadRes = await uploadService.uploadFile(file);
        imageUrl = uploadRes.location;
      }

      // 3. Conversión de Tipos Segura (Form -> Payload)
      const productPayload: CreateProductPayload = {
        name: data.name,
        slug: data.name.toLowerCase().replace(/ /g, "-"),
        description: data.description,
        price: Number(data.price), // Convertir string a number
        stock: Number(data.stock),
        brands_id: Number(data.brands_id),
        categories_id: Number(data.categories_id),
        subcategories_id: Number(data.subcategories_id),
        image_url: imageUrl,
        is_active: true,
      };

      // 4. Llamada al servicio con tipos (Product = Respuesta, CreateProductPayload = Envío)
      await genericService.create<Product, CreateProductPayload>(
        "products",
        productPayload
      );

      toast.success("Producto creado correctamente");
      router.push("/dashboard/products");
    } catch (error) {
      console.error(error);
      toast.error("Error al crear el producto");
    }
  };

  console.log(categories);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h1 className="text-2xl font-bold mb-6">Nuevo Producto</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            {...register("name", { required: "El nombre es obligatorio" })}
            className="w-full border rounded-lg p-2"
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Precio</label>
            <input
              type="number"
              step="0.01"
              {...register("price", { required: "Requerido", min: 0 })}
              className="w-full border rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock</label>
            <input
              type="number"
              {...register("stock", { required: "Requerido", min: 0 })}
              className="w-full border rounded-lg p-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Marca</label>
            <select
              {...register("brands_id", { required: "Selecciona una marca" })}
              className="w-full border rounded-lg p-2 bg-white"
            >
              <option value="">Seleccionar...</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
            {errors.brands_id && (
              <span className="text-red-500 text-sm">
                {errors.brands_id.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Categoria</label>
            <select
              {...register("categories_id", {
                required: "Selecciona una categoría",
              })}
              className="w-full border rounded-lg p-2 bg-white"
            >
              <option value="">Seleccionar...</option>
              {categories.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Subcategoría
            </label>
            <select
              {...register("subcategories_id", {
                required: "Selecciona una subcategoría",
              })}
              className="w-full border rounded-lg p-2 bg-white"
            >
              <option value="">Seleccionar...</option>
              {subcategories.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea
            {...register("description")}
            className="w-full border rounded-lg p-2 h-24"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Imagen</label>
          <input
            type="file"
            accept="image/*"
            {...register("imageFile")}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 w-full disabled:opacity-50"
        >
          {isSubmitting ? "Guardando..." : "Crear Producto"}
        </button>
      </form>
    </div>
  );
}
```

#### ./src/app/(admin)/dashboard/products/page.tsx

```tsx
"use client";

import { genericService } from "@/core/services/generic.service";
import { Product } from "@/core/types";
import { Edit, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Función para cargar datos
  const loadProducts = async () => {
    try {
      // ?include=brands,subcategories para que el backend traiga los nombres
      const { data, error, message, success, meta } =
        await genericService.getAll<Product[]>("products", {
          include: "brands,subcategories,categories",
          sort: "id:DESC",
        });
      console.log(error);
      console.log(message);
      console.log(success);
      console.log(meta);
      setProducts(data);
    } catch (error) {
      console.log(error);
      toast.error("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Función para eliminar
  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      await genericService.delete("products", id);
      toast.success("Producto eliminado");
      loadProducts(); // Recargar lista
    } catch (error) {
      console.log(error);
      toast.error("No se pudo eliminar (quizás tiene órdenes asociadas)");
    }
  };

  if (loading) return <div className="p-8">Cargando productos...</div>;
  console.log(products);

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
                    <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-xs">
                      N/A
                    </div>
                  )}
                </td>
                <td className="p-4 font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="p-4">${Number(product.price).toFixed(2)}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      product.stock > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.stock} un.
                  </span>
                </td>
                <td className="p-4">{product.brands?.name || "-"}</td>
                <td className="p-4">{product.categories?.name || "-"}</td>
                <td className="p-4">{product.subcategories?.name || "-"}</td>
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
```

#### ./src/core/store/auth.store.ts

```tsx
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../types";

interface AuthState {
  token: string | null;
  user: User | null;
  isAuth: boolean;

  // Acciones
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  // Hidratación (para saber si ya leyó del localStorage al iniciar)
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuth: false,
      hasHydrated: false,

      setAuth: (token, user) => set({ token, user, isAuth: true }),
      logout: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        set({ token: null, user: null, isAuth: false });
      },
      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: "auth-storage", // Clave en localStorage
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
```

#### ./src/app/(auth)/login/page.tsx

```tsx
"use client";

import { authService } from "@/core/services/auth.service";
import { useAuthStore } from "@/core/store/auth.store";
import { LoginForm } from "@/core/types";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    console.log("🚀 Enviando formulario...", data);

    try {
      const response = await authService.login(data);
      // console.log("✅ Respuesta recibida:", response);

      if (!response || !response.data) {
        throw new Error("La respuesta del servidor está vacía");
      }

      // Guardar sesión
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      setAuth(response.data.accessToken, response.data.userData);

      toast.success(`Bienvenido, ${response.data.userData.name}`);

      // Redirigir
      if (response.data.userData.role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("❌ Error en Login:", error);

      // Manejo de errores ROBUSTO
      let message = "Ocurrió un error desconocido";

      if (error instanceof AxiosError) {
        // Error que viene del Backend (400, 401, 500)
        message = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        // Error genérico de JS (ej: throw new Error)
        message = error.message;
      }

      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Iniciar Sesión
        </h1>

        <form
          // 🛡️ CORRECCIÓN CLAVE:
          // Forzamos el preventDefault manual para asegurar que NO recargue
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit)(e);
          }}
          className="space-y-4"
          noValidate
        >
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Correo Electrónico
            </label>
            <input
              type="email"
              {...register("email", { required: "El correo es obligatorio" })}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none text-black"
              placeholder="admin@test.com"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              {...register("password", {
                required: "La contraseña es obligatoria",
              })}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none text-black"
              placeholder="******"
            />
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium cursor-pointer"
          >
            {isSubmitting ? "Verificando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
```
