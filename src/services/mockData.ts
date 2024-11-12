import { ClientConfig, ClientConfigCreateDto, ClientConfigUpdateDto } from '../types/clientConfig';

// Helper function to generate random keys
const generateRandomKey = (length: number = 32): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

// Initial mock data
const mockConfigs: ClientConfig[] = [
    {
        id: 1,
        client_id: 'AHIS',
        client_secret_key: generateRandomKey(),
        client_access_token: generateRandomKey(48),
        client_shared_key: generateRandomKey(24),
        status: 'ACTIVE',
        entity_id: 1,
        created_at: '2024-11-08T10:00:00Z',
        updated_at: '2024-11-08T10:00:00Z',
        created_by: 'admin',
        updated_by: 'admin'
    },
    {
        id: 2,
        client_id: 'AHCC',
        client_secret_key: generateRandomKey(),
        client_access_token: generateRandomKey(48),
        client_shared_key: generateRandomKey(24),
        status: 'ACTIVE',
        entity_id: 1,
        created_at: '2024-11-08T11:00:00Z',
        updated_at: '2024-11-08T11:00:00Z',
        created_by: 'admin',
        updated_by: 'admin'
    },
    {
        id: 3,
        client_id: 'AHIS',
        client_secret_key: generateRandomKey(),
        client_access_token: generateRandomKey(48),
        client_shared_key: generateRandomKey(24),
        status: 'INACTIVE',
        entity_id: 2,
        created_at: '2024-11-08T12:00:00Z',
        updated_at: '2024-11-08T12:00:00Z',
        created_by: 'admin',
        updated_by: 'admin'
    },
    {
        id: 4,
        client_id: 'AHPI',
        client_secret_key: generateRandomKey(),
        client_access_token: generateRandomKey(48),
        client_shared_key: generateRandomKey(24),
        status: 'PENDING',
        entity_id: 2,
        created_at: '2024-11-08T13:00:00Z',
        updated_at: '2024-11-08T13:00:00Z',
        created_by: 'admin',
        updated_by: 'admin'
    },
    {
        id: 5,
        client_id: 'mobile_client_002',
        client_secret_key: generateRandomKey(),
        client_access_token: generateRandomKey(48),
        client_shared_key: generateRandomKey(24),
        status: 'ACTIVE',
        entity_id: 3,
        created_at: '2024-11-08T14:00:00Z',
        updated_at: '2024-11-08T14:00:00Z',
        created_by: 'admin',
        updated_by: 'admin'
    }
];

export class MockClientConfigService {
    private static instance: MockClientConfigService;
    private configs: ClientConfig[] = mockConfigs;
    private lastId: number = 5;

    private constructor() {}

    public static getInstance(): MockClientConfigService {
        if (!MockClientConfigService.instance) {
            MockClientConfigService.instance = new MockClientConfigService();
        }
        return MockClientConfigService.instance;
    }

    public async getConfigs(params?: {
        tenant_id?: number;
        entity_id?: number;
        status?: string;
        search?: string;
    }): Promise<ClientConfig[]> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        let filteredConfigs = [...this.configs];

        if (params) {
            if (params.entity_id) {
                filteredConfigs = filteredConfigs.filter(config =>
                    config.entity_id === params.entity_id
                );
            }

            if (params.status) {
                filteredConfigs = filteredConfigs.filter(config =>
                    config.status === params.status
                );
            }

            if (params.search) {
                const searchLower = params.search.toLowerCase();
                filteredConfigs = filteredConfigs.filter(config =>
                    config.client_id.toLowerCase().includes(searchLower)
                );
            }
        }

        return filteredConfigs;
    }

    public async getConfigById(id: number): Promise<ClientConfig | null> {
        await new Promise(resolve => setTimeout(resolve, 300));
        return this.configs.find(config => config.id === id) || null;
    }

    public async createConfig(data: ClientConfigCreateDto): Promise<ClientConfig> {
        await new Promise(resolve => setTimeout(resolve, 700));

        const newConfig: ClientConfig = {
            id: ++this.lastId,
            ...data,
            client_secret_key: generateRandomKey(),
            client_access_token: generateRandomKey(48),
            client_shared_key: generateRandomKey(24),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            created_by: 'admin',
            updated_by: 'admin'
        };

        this.configs.push(newConfig);
        return newConfig;
    }

    public async updateConfig(id: number, data: ClientConfigUpdateDto): Promise<ClientConfig> {
        await new Promise(resolve => setTimeout(resolve, 500));

        const index = this.configs.findIndex(config => config.id === id);
        if (index === -1) {
            throw new Error('Configuration not found');
        }

        const updatedConfig = {
            ...this.configs[index],
            ...data,
            updated_at: new Date().toISOString(),
            updated_by: 'admin'
        };

        this.configs[index] = updatedConfig;
        return updatedConfig;
    }

    public async deleteConfig(id: number): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 400));

        const index = this.configs.findIndex(config => config.id === id);
        if (index === -1) {
            throw new Error('Configuration not found');
        }

        this.configs.splice(index, 1);
    }

    public async rotateKeys(id: number): Promise<ClientConfig> {
        await new Promise(resolve => setTimeout(resolve, 600));

        const index = this.configs.findIndex(config => config.id === id);
        if (index === -1) {
            throw new Error('Configuration not found');
        }

        const updatedConfig = {
            ...this.configs[index],
            client_secret_key: generateRandomKey(),
            client_access_token: generateRandomKey(48),
            client_shared_key: generateRandomKey(24),
            updated_at: new Date().toISOString(),
            updated_by: 'admin'
        };

        this.configs[index] = updatedConfig;
        return updatedConfig;
    }
}