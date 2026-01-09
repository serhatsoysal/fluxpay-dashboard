export interface ApiResponse<T = unknown> {
    data: T;
    message?: string;
    success: boolean;
}

export interface PaginatedResponse<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export interface ApiError {
    message: string;
    code: string;
    details?: Record<string, string[]>;
}
