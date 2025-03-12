import axios, { AxiosError, AxiosInstance } from 'axios';

// API Response Types
export interface ApiResponse<T = any> {
    status: string;
    data?: T;
    message?: string;
    details?: Record<string, any>;
}

export interface HealthCheckResponse {
    status: string;
    timestamp: string;
    uptime: number;
    version: string;
}

export interface GameListResponse {
    status: string;
    games: Game[];
}

export interface Game {
    id: string;
    status: 'waiting' | 'in_progress' | 'completed';
    players: string[];
    created_at: string;
    updated_at: string;
}

// API Error
export class ApiError extends Error {
    constructor(
        public status: number,
        message: string,
        public details?: Record<string, any>
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

// API Client
class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Add response interceptor for error handling
        this.client.interceptors.response.use(
            (response) => response,
            (error: AxiosError<ApiResponse>) => {
                if (error.response) {
                    const { status, data } = error.response;
                    throw new ApiError(
                        status,
                        data?.message || 'An unexpected error occurred',
                        data?.details
                    );
                }
                throw new ApiError(500, 'Network error');
            }
        );
    }

    async healthCheck(): Promise<HealthCheckResponse> {
        const { data } = await this.client.get<HealthCheckResponse>('/api/health');
        return data;
    }

    async listGames(): Promise<GameListResponse> {
        const { data } = await this.client.get<GameListResponse>('/api/game');
        return data;
    }

    async createGame(): Promise<Game> {
        const { data } = await this.client.post<ApiResponse<Game>>('/api/game');
        return data.data!;
    }

    async getGame(id: string): Promise<Game> {
        const { data } = await this.client.get<ApiResponse<Game>>(`/api/game/${id}`);
        return data.data!;
    }
}

export const api = new ApiClient(); 