/*
import axios from 'axios';
import { ClientConfig, ClientConfigCreateDto, ClientConfigUpdateDto } from '../types/clientConfig';

const API_BASE_URL = '/api/v1';

export const clientConfigApi = {
    getConfigs: async (params?: {
        tenant_id?: number;
        entity_id?: number;
        status?: string;
    }) => {
        const response = await axios.get<ClientConfig[]>(`${API_BASE_URL}/client-configs`, { params });
        return response.data;
    },

    getConfigById: async (id: number) => {
        const response = await axios.get<ClientConfig>(`${API_BASE_URL}/client-configs/${id}`);
        return response.data;
    },

    createConfig: async (data: ClientConfigCreateDto) => {
        const response = await axios.post<ClientConfig>(`${API_BASE_URL}/client-configs`, data);
        return response.data;
    },

    updateConfig: async (id: number, data: ClientConfigUpdateDto) => {
        const response = await axios.put<ClientConfig>(`${API_BASE_URL}/client-configs/${id}`, data);
        return response.data;
    },

    deleteConfig: async (id: number) => {
        await axios.delete(`${API_BASE_URL}/client-configs/${id}`);
    },

    rotateKeys: async (id: number) => {
        const response = await axios.post<ClientConfig>(`${API_BASE_URL}/client-configs/${id}/rotate-keys`);
        return response.data;
    },
};*/

import { ClientConfig, ClientConfigCreateDto, ClientConfigUpdateDto } from '../types/clientConfig';
import { MockClientConfigService } from '../services/mockData';

const mockService = MockClientConfigService.getInstance();

export const clientConfigApi = {
    getConfigs: async (params?: {
        tenant_id?: number;
        entity_id?: number;
        status?: string;
        search?: string;
    }): Promise<ClientConfig[]> => {
        return mockService.getConfigs(params);
    },

    getConfigById: async (id: number): Promise<ClientConfig | null> => {
        return mockService.getConfigById(id);
    },

    createConfig: async (data: ClientConfigCreateDto): Promise<ClientConfig> => {
        return mockService.createConfig(data);
    },

    updateConfig: async (id: number, data: ClientConfigUpdateDto): Promise<ClientConfig> => {
        return mockService.updateConfig(id, data);
    },

    deleteConfig: async (id: number): Promise<void> => {
        return mockService.deleteConfig(id);
    },

    rotateKeys: async (id: number): Promise<ClientConfig> => {
        return mockService.rotateKeys(id);
    },
};