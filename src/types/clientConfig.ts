export interface ClientConfig {
    id: number;
    client_id: string;
    client_secret_key: string;
    client_access_token: string;
    client_shared_key: string;
    status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
    entity_id: number;
    created_at: string;
    updated_at: string;
    created_by: string;
    updated_by: string;
}

export interface ClientConfigCreateDto {
    client_id: string;
    entity_id: number;
    status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
}

export interface ClientConfigUpdateDto {
    client_id?: string;
    status?: 'ACTIVE' | 'INACTIVE' | 'PENDING';
}