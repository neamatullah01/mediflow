import { Response } from 'express';

interface TMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  meta?: TMeta;
  data?: T;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message || null,
    meta: data.meta || null || undefined,
    data: data.data || null || undefined,
  });
};

export default sendResponse;
