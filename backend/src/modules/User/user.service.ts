import { prisma } from '../../lib/prisma';
import AppError from '../../errors/AppError';
import { Role } from '../../middlewares/auth.middleware';
import { getSkip, calculateTotalPages } from '../../utils/pagination';
import type { UpdateUserPayload, BanUserPayload } from './user.validation';

interface PaginationQuery {
  page?: number | undefined;
  limit?: number | undefined;
  search?: string | undefined;
  role?: string | undefined;
  banned?: boolean | undefined;
}

const getAllUsers = async (query: PaginationQuery) => {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = getSkip(page, limit);

  const where: any = {};
  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { email: { contains: query.search, mode: 'insensitive' } },
    ];
  }
  if (query.role !== undefined) where.role = query.role;
  if (query.banned !== undefined) where.banned = query.banned;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { pharmacy: true },
      omit: { password: true },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    meta: {
      page,
      limit,
      total,
      totalPages: calculateTotalPages(total, limit),
    },
  };
};

const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { pharmacy: true },
    omit: { password: true },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

const updateUser = async (
  id: string,
  payload: UpdateUserPayload,
  currentUser: { id: string; role: Role },
) => {
  if (currentUser.role !== Role.ADMIN && currentUser.id !== id) {
    throw new AppError('Forbidden. You can only update your own profile.', 403);
  }

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError('User not found', 404);
  }

  const updateData = Object.fromEntries(
    Object.entries(payload).filter(([, v]) => v !== undefined),
  );

  const updated = await prisma.user.update({
    where: { id },
    data: updateData,
    include: { pharmacy: true },
    omit: { password: true },
  });

  return updated;
};

const banUser = async (id: string, payload: BanUserPayload) => {
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError('User not found', 404);
  }

  const updated = await prisma.user.update({
    where: { id },
    data: {
      banned: payload.banned,
      banReason: payload.banned ? payload.banReason || null : null,
    },
    include: { pharmacy: true },
    omit: { password: true },
  });

  return updated;
};

const deleteUser = async (id: string) => {
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError('User not found', 404);
  }

  await prisma.user.delete({ where: { id } });
};

const uploadAvatar = async (
  id: string,
  imageUrl: string,
  currentUser: { id: string; role: Role },
) => {
  if (currentUser.role !== Role.ADMIN && currentUser.id !== id) {
    throw new AppError('Forbidden. You can only update your own avatar.', 403);
  }

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError('User not found', 404);
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { image: imageUrl },
    include: { pharmacy: true },
    omit: { password: true },
  });

  return updated;
};

const userService = {
  getAllUsers,
  getUserById,
  updateUser,
  banUser,
  deleteUser,
  uploadAvatar,
};

export default userService;
