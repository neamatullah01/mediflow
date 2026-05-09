
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { DosageForm, DrugCategory, InteractionSeverity, OrderStatus, PharmacyStatus } from '../generated/prisma/enums';
import { Role } from '../middlewares/auth.middleware';


async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Clean existing data to prevent duplicates on re-runs
  await prisma.dispensingLog.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.orderLineItem.deleteMany();
  await prisma.supplierOrder.deleteMany();
  await prisma.drugInteractionCheck.deleteMany();
  await prisma.aiChatMessage.deleteMany();
  await prisma.aiChatSession.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.drug.deleteMany();
  await prisma.user.deleteMany();
  await prisma.pharmacy.deleteMany();

  // 2. Create Demo Pharmacy
  const pharmacy = await prisma.pharmacy.create({
    data: {
      name: 'MediFlow Central Pharmacy',
      licenseNumber: 'PHARM-DEMO-001',
      address: '123 Health Ave, Dhaka',
      phone: '+8801700000000',
      status: PharmacyStatus.ACTIVE,
    },
  });
  console.log('✅ Pharmacy created');

  // 3. Create Admin and Pharmacist (Passwords hashed for Better Auth compatibility)
  const adminPassword = await bcrypt.hash('Admin@1234', 10);
  const pharmacistPassword = await bcrypt.hash('Demo@1234', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'System Admin',
      email: 'admin@mediflow.com',
      password: adminPassword,
      role: Role.ADMIN,
      emailVerified: true,
    },
  });

  const pharmacist = await prisma.user.create({
    data: {
      name: 'Demo Pharmacist',
      email: 'pharmacist@mediflow.com',
      password: pharmacistPassword,
      role: Role.PHARMACIST,
      pharmacyId: pharmacy.id,
      emailVerified: true,
    },
  });
  console.log('✅ Users created (Admin & Pharmacist)');

  // 4. Create 50 Master Drugs
  const baseDrugs = [
    { name: 'Amoxicillin 500mg', generic: 'Amoxicillin', cat: DrugCategory.ANTIBIOTIC, form: DosageForm.CAPSULE },
    { name: 'Napa Extend', generic: 'Paracetamol', cat: DrugCategory.ANALGESIC, form: DosageForm.TABLET },
    { name: 'Metfo 500', generic: 'Metformin', cat: DrugCategory.ANTIDIABETIC, form: DosageForm.TABLET },
    { name: 'Seclo 20mg', generic: 'Omeprazole', cat: DrugCategory.GASTROINTESTINAL, form: DosageForm.CAPSULE },
    { name: 'Aspirin Cardio', generic: 'Aspirin', cat: DrugCategory.CARDIOVASCULAR, form: DosageForm.TABLET },
  ];

  const createdDrugs: { id: string }[] = [];
  for (let i = 0; i < 50; i++) {
    const base = baseDrugs[i % baseDrugs.length]!;
    const drug = await prisma.drug.create({
      data: {
        name: i < 5 ? base.name : `${base.generic} Variant ${i + 1}`,
        genericName: base.generic,
        category: base.cat,
        dosageForm: base.form,
        description: `Standard treatment using ${base.generic}.`,
        uses: ['General treatment', 'Symptom relief'],
        manufacturer: 'MediFlow Pharma Labs',
        isActive: true,
      },
    });
    createdDrugs.push(drug);
  }
  console.log(`✅ 50 Master Drugs created`);

  // 5. Create 30 Inventory Items for the Demo Pharmacy
  const inventoryItems = [];
  for (let i = 0; i < 30; i++) {
    const item = await prisma.inventoryItem.create({
      data: {
        pharmacyId: pharmacy.id,
        drugId: createdDrugs[i]!.id,
        quantity: Math.floor(Math.random() * 200) + 5, // Random qty between 5 and 205
        unitPrice: Math.floor(Math.random() * 50) + 10,
        expiryDate: new Date(new Date().setMonth(new Date().getMonth() + (Math.floor(Math.random() * 24) + 1))), // 1-24 months in future
        batchNumber: `BATCH-${1000 + i}`,
        reorderLevel: 20,
        supplierName: 'Global Med Suppliers',
      },
    });
    inventoryItems.push(item);
  }
  console.log(`✅ 30 Inventory Items created`);

  // 6. Create 15 Dispensing Logs (Sales)
  for (let i = 0; i < 15; i++) {
    await prisma.dispensingLog.create({
      data: {
        pharmacyId: pharmacy.id,
        inventoryItemId: inventoryItems[i]!.id,
        drugId: inventoryItems[i]!.drugId,
        pharmacistId: pharmacist.id,
        patientName: `Patient ${i + 1}`,
        quantityDispensed: Math.floor(Math.random() * 5) + 1,
        dispensedAt: new Date(new Date().setDate(new Date().getDate() - i)), // Spread over last 15 days
      },
    });
  }
  console.log(`✅ 15 Dispensing Logs created`);

  // 7. Create 5 Supplier Orders
  for (let i = 0; i < 5; i++) {
    const order = await prisma.supplierOrder.create({
      data: {
        pharmacyId: pharmacy.id,
        supplierName: 'Global Med Suppliers',
        status: i % 2 === 0 ? OrderStatus.RECEIVED : OrderStatus.PENDING,
        totalAmount: Math.floor(Math.random() * 5000) + 1000,
        expectedDelivery: new Date(new Date().setDate(new Date().getDate() + 5)),
      },
    });

    await prisma.orderLineItem.create({
      data: {
        orderId: order.id,
        drugId: createdDrugs[i]!.id,
        quantity: 100,
        unitPrice: 15.50,
      },
    });
  }
  console.log(`✅ 5 Supplier Orders created`);

  // 8. Create 5 AI Interaction Checks
  for (let i = 0; i < 5; i++) {
    await prisma.drugInteractionCheck.create({
      data: {
        pharmacyId: pharmacy.id,
        drugsChecked: ['Aspirin', 'Warfarin'],
        overallRisk: InteractionSeverity.DANGEROUS,
        resultJson: { risk: "DANGEROUS", message: "High risk of bleeding." }, // Dummy JSON matching PRD
      },
    });
  }
  console.log(`✅ 5 AI Interaction Checks created`);

  // 9. Create 10 Blog Posts (by Admin)
  for (let i = 0; i < 10; i++) {
    await prisma.blogPost.create({
      data: {
        authorId: admin.id,
        title: `The Future of AI in Pharmacy Part ${i + 1}`,
        slug: `future-ai-pharmacy-${i + 1}`,
        excerpt: 'Discover how AI is changing medicine dispensing.',
        content: '<p>Full blog post content goes here.</p>',
        category: 'Technology',
        isPublished: true,
        tags: ['AI', 'Pharmacy'],
      },
    });
  }
  console.log(`✅ 10 Blog Posts created`);

  // 10. Create 5 AI Chat Sessions
  for (let i = 0; i < 5; i++) {
    const session = await prisma.aiChatSession.create({
      data: {
        pharmacyId: pharmacy.id,
        userId: pharmacist.id,
        title: `Dosage Query ${i + 1}`,
      },
    });

    await prisma.aiChatMessage.createMany({
      data: [
        { sessionId: session.id, role: 'user', content: 'What is the dosage for Amoxicillin?' },
        { sessionId: session.id, role: 'assistant', content: 'The standard adult dosage is 500mg every 8 hours.' },
      ],
    });
  }
  console.log(`✅ 5 AI Chat Sessions created`);

  console.log('🎉 Seeding complete! You can now log in with demo credentials.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });