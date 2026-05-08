import { prisma } from '../../lib/prisma';

const getStats = async () => {
  const now = new Date();

  // Start of current month
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Start of current week (Monday)
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + 1);
  startOfWeek.setHours(0, 0, 0, 0);

  const [
    totalPharmacies,
    totalPharmacists,
    totalDrugs,
    dispensingThisMonth,
    activeOrders,
    newRegistrationsThisWeek,
  ] = await Promise.all([
    prisma.pharmacy.count(),
    prisma.user.count({ where: { role: 'PHARMACIST' } }),
    prisma.drug.count({ where: { isActive: true } }),
    prisma.dispensingLog.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.supplierOrder.count({ where: { status: { in: ['PENDING', 'SHIPPED'] } } }),
    prisma.user.count({
      where: {
        role: 'PHARMACIST',
        createdAt: { gte: startOfWeek },
      },
    }),
  ]);

  // Pharmacies registered per month (last 6 months)
  const sixMonthsAgo = new Date(now);
  sixMonthsAgo.setMonth(now.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const pharmaciesPerMonth = await prisma.$queryRaw<
    { month: string; count: bigint }[]
  >`
    SELECT
      TO_CHAR(DATE_TRUNC('month', "createdAt"), 'YYYY-MM') AS month,
      COUNT(*) AS count
    FROM pharmacies
    WHERE "createdAt" >= ${sixMonthsAgo}
    GROUP BY DATE_TRUNC('month', "createdAt")
    ORDER BY DATE_TRUNC('month', "createdAt") ASC
  `;

  // Platform-wide dispensing activity last 30 days (daily counts)
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const dispensingActivity = await prisma.$queryRaw<
    { date: string; count: bigint }[]
  >`
    SELECT
      TO_CHAR(DATE_TRUNC('day', "dispensedAt"), 'YYYY-MM-DD') AS date,
      COUNT(*) AS count
    FROM dispensing_logs
    WHERE "dispensedAt" >= ${thirtyDaysAgo}
    GROUP BY DATE_TRUNC('day', "dispensedAt")
    ORDER BY DATE_TRUNC('day', "dispensedAt") ASC
  `;

  // Drug category distribution in master catalogue
  const categoryDistribution = await prisma.$queryRaw<
    { category: string; count: bigint }[]
  >`
    SELECT category, COUNT(*) AS count
    FROM drugs
    WHERE "isActive" = true
    GROUP BY category
    ORDER BY count DESC
  `;

  return {
    stats: {
      totalPharmacies,
      totalPharmacists,
      totalDrugs,
      dispensingThisMonth,
      activeOrders,
      newRegistrationsThisWeek,
    },
    charts: {
      pharmaciesPerMonth: pharmaciesPerMonth.map((r) => ({
        month: r.month,
        count: Number(r.count),
      })),
      dispensingActivity: dispensingActivity.map((r) => ({
        date: r.date,
        count: Number(r.count),
      })),
      categoryDistribution: categoryDistribution.map((r) => ({
        category: r.category,
        count: Number(r.count),
      })),
    },
  };
};

const getActivity = async () => {
  const recentRegistrations = await prisma.user.findMany({
    where: { role: 'PHARMACIST' },
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      banned: true,
      pharmacy: {
        select: {
          id: true,
          name: true,
          licenseNumber: true,
          status: true,
        },
      },
    },
  });

  return recentRegistrations;
};

const adminService = {
  getStats,
  getActivity,
};

export default adminService;
