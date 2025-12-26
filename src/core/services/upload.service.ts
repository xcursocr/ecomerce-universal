import api from '../api/axios';
import { ApiResponse, FileUploadResponse } from '../types/dtos.types';

export const uploadService = {
    /**
     * Sube un archivo al backend.
     * @param file El objeto File obtenido de un input type="file"
     */
    async uploadFile(file: File) {
        const formData = new FormData();
        formData.append('file', file); // 'file' debe coincidir con upload.single('file') en tu backend

        const { data } = await api.post<ApiResponse<FileUploadResponse>>(
            '/files/upload',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
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
    }
};