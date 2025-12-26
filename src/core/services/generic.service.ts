import api from '../api/axios';
import { ApiResponse, ApiTable, QueryParams } from '../types';

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
        const { data } = await api.delete<ApiResponse<{ id: number }>>(`/${table}/${id}`);
        return data.data;
    }
};