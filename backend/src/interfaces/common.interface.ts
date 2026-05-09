export interface IGenericResponse<T> {
  success: boolean;
  message: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data?: T | T[];
}

export interface IErrorSource {
  path: string | number;
  message: string;
}

export interface IGenericErrorResponse {
  success: boolean;
  message: string;
  errorSources: IErrorSource[];
  stack?: string;
}

export interface IPaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface IFilterOptions {
  searchTerm?: string;
  [key: string]: string | number | boolean | undefined;
}
