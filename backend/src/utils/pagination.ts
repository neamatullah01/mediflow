interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface PaginationResult<T> {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: T[];
}

export const getPaginationOptions = (query: Record<string, unknown>): PaginationOptions => {
  const page = Math.max(1, parseInt(query.page as string, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit as string, 10) || 20));
  const sortBy = (query.sortBy as string) || 'createdAt';
  const sortOrder = (query.sortOrder as 'asc' | 'desc') || 'desc';

  return { page, limit, sortBy, sortOrder };
};

export const paginate = <T>(items: T[], options: PaginationOptions): PaginationResult<T> => {
  const { page = 1, limit = 20 } = options;
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  return {
    page,
    limit,
    total,
    totalPages,
    data: items.slice(startIndex, endIndex),
  };
};

export const getSkip = (page: number, limit: number): number => {
  return (page - 1) * limit;
};

export const calculateTotalPages = (total: number, limit: number): number => {
  return Math.ceil(total / limit);
};

export default {
  getPaginationOptions,
  paginate,
  getSkip,
  calculateTotalPages,
};
