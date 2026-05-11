import { auth } from "../lib/auth"; // THE FIX: Imported better-auth
import { prisma } from "../lib/prisma";
import {
  DosageForm,
  DrugCategory,
  InteractionSeverity,
  OrderStatus,
  PharmacyStatus,
} from "../generated/prisma/enums";
import { Role } from "../middlewares/auth.middleware";

async function main() {
  console.log("🌱 Starting database seed...");

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
      name: "MediFlow Central Pharmacy",
      licenseNumber: "PHARM-DEMO-001",
      address: "123 Health Ave, Dhaka",
      phone: "+8801700000000",
      status: PharmacyStatus.ACTIVE,
    },
  });
  console.log("✅ Pharmacy created");

  // 3. Create Admin and Pharmacist via Better Auth natively
  console.log("⏳ Creating users via Better Auth...");

  // Create Admin
  const adminAuth = await (auth.api.signUpEmail as any)({
    body: {
      name: "System Admin",
      email: "admin@mediflow.com",
      password: "Admin@1234",
    },
  });

  if (!adminAuth || !adminAuth.user) throw new Error("Admin creation failed");

  // Update Admin with custom Prisma fields
  const admin = await prisma.user.update({
    where: { id: adminAuth.user.id },
    data: {
      role: Role.ADMIN,
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&h=256&q=80",
      emailVerified: true,
    },
  });

  // Create Pharmacist
  const pharmacistAuth = await (auth.api.signUpEmail as any)({
    body: {
      name: "Demo Pharmacist",
      email: "pharmacist@mediflow.com",
      password: "Demo@1234",
    },
  });

  if (!pharmacistAuth || !pharmacistAuth.user)
    throw new Error("Pharmacist creation failed");

  // Update Pharmacist with custom Prisma fields
  const pharmacist = await prisma.user.update({
    where: { id: pharmacistAuth.user.id },
    data: {
      role: Role.PHARMACIST,
      pharmacyId: pharmacy.id,
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=256&h=256&q=80",
      emailVerified: true,
    },
  });

  console.log("✅ Users created securely via Better Auth");

  // Unsplash images for Drugs
  const drugImages = [
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1550572017-edb3df14a9ce?auto=format&fit=crop&w=800&q=80",
  ];

  // 4. Create 50 Master Drugs
  const baseDrugs = [
    {
      name: "Amoxicillin 500mg",
      generic: "Amoxicillin",
      cat: DrugCategory.ANTIBIOTIC,
      form: DosageForm.CAPSULE,
    },
    {
      name: "Napa Extend",
      generic: "Paracetamol",
      cat: DrugCategory.ANALGESIC,
      form: DosageForm.TABLET,
    },
    {
      name: "Metfo 500",
      generic: "Metformin",
      cat: DrugCategory.ANTIDIABETIC,
      form: DosageForm.TABLET,
    },
    {
      name: "Seclo 20mg",
      generic: "Omeprazole",
      cat: DrugCategory.GASTROINTESTINAL,
      form: DosageForm.CAPSULE,
    },
    {
      name: "Aspirin Cardio",
      generic: "Aspirin",
      cat: DrugCategory.CARDIOVASCULAR,
      form: DosageForm.TABLET,
    },
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
        description: `Standard treatment using ${base.generic}. Highly effective for indicated symptoms.`,
        uses: ["General treatment", "Symptom relief", "Clinical care"],
        manufacturer: "MediFlow Pharma Labs",
        imageUrl: drugImages[i % drugImages.length],
        isActive: true,
      },
    });
    createdDrugs.push(drug);
  }
  console.log(`✅ 50 Master Drugs created`);

  // 5. Create 30 Inventory Items
  const inventoryItems = [];
  for (let i = 0; i < 30; i++) {
    const item = await prisma.inventoryItem.create({
      data: {
        pharmacyId: pharmacy.id,
        drugId: createdDrugs[i]!.id,
        quantity: Math.floor(Math.random() * 200) + 5,
        unitPrice: Math.floor(Math.random() * 50) + 10,
        expiryDate: new Date(
          new Date().setMonth(
            new Date().getMonth() + (Math.floor(Math.random() * 24) + 1),
          ),
        ),
        batchNumber: `BATCH-${1000 + i}`,
        reorderLevel: 20,
        supplierName: "Global Med Suppliers",
      },
    });
    inventoryItems.push(item);
  }
  console.log(`✅ 30 Inventory Items created`);

  // 6. Create 15 Dispensing Logs
  for (let i = 0; i < 15; i++) {
    await prisma.dispensingLog.create({
      data: {
        pharmacyId: pharmacy.id,
        inventoryItemId: inventoryItems[i]!.id,
        drugId: inventoryItems[i]!.drugId,
        pharmacistId: pharmacist.id,
        patientName: `Patient ${i + 1}`,
        quantityDispensed: Math.floor(Math.random() * 5) + 1,
        dispensedAt: new Date(new Date().setDate(new Date().getDate() - i)),
      },
    });
  }
  console.log(`✅ 15 Dispensing Logs created`);

  // 7. Create 5 Supplier Orders
  for (let i = 0; i < 5; i++) {
    const order = await prisma.supplierOrder.create({
      data: {
        pharmacyId: pharmacy.id,
        supplierName: "Global Med Suppliers",
        status: i % 2 === 0 ? OrderStatus.RECEIVED : OrderStatus.PENDING,
        totalAmount: Math.floor(Math.random() * 5000) + 1000,
        expectedDelivery: new Date(
          new Date().setDate(new Date().getDate() + 5),
        ),
      },
    });

    await prisma.orderLineItem.create({
      data: {
        orderId: order.id,
        drugId: createdDrugs[i]!.id,
        quantity: 100,
        unitPrice: 15.5,
      },
    });
  }
  console.log(`✅ 5 Supplier Orders created`);

  // 8. Create 5 AI Interaction Checks
  for (let i = 0; i < 5; i++) {
    await prisma.drugInteractionCheck.create({
      data: {
        pharmacyId: pharmacy.id,
        drugsChecked: ["Aspirin", "Warfarin"],
        overallRisk: InteractionSeverity.DANGEROUS,
        resultJson: { risk: "DANGEROUS", message: "High risk of bleeding." },
      },
    });
  }
  console.log(`✅ 5 AI Interaction Checks created`);

  // 9. Create Rich Blog Posts
  const blogImages = [
    "https://images.unsplash.com/photo-1532187863486-abf9db5c2b1b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1576091160550-2173ff9e9e9c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80",
  ];

  const richBlogs = [
    {
      title: "The Future of AI in Drug Interaction Prevention",
      excerpt:
        "How large language models are closing the gap in complex pharmaceutical safety protocols and ensuring better patient outcomes globally.",
      category: "PHARMACOLOGY",
      tags: ["AI", "Clinical", "Safety"],
      readTime: 6,
      content: `
        <h2>The Current Landscape</h2>
        <p>In modern clinical environments, pharmacists are overwhelmed with data. Traditional software flags too many false positives, leading to alert fatigue. Research shows that up to 70% of standard alerts are overridden by practitioners.</p>
        <h2>How AI Changes Everything</h2>
        <p>By leveraging advanced neural networks, tools like MediFlow can dynamically assess patient context—such as age, BMI, and genetic markers—before triggering a warning.</p>
        <ul>
          <li><strong>Speed:</strong> Analysis happens in milliseconds.</li>
          <li><strong>Accuracy:</strong> Context-aware flagging reduces false alarms by 40%.</li>
          <li><strong>Multimodal Processing:</strong> Reading handwritten prescriptions alongside digital records.</li>
        </ul>
        <blockquote>"This isn't about replacing pharmacists; it's about giving them superpowers to focus on true clinical interventions."</blockquote>
      `,
    },
    {
      title: "Optimizing Inventory for Rural Pharmacies",
      excerpt:
        "Leveraging predictive analytics to solve the logistical challenges of remote healthcare delivery and prevent critical stockouts.",
      category: "LOGISTICS",
      tags: ["Supply Chain", "Analytics", "Rural Health"],
      readTime: 8,
      content: `
        <h2>The Logistical Nightmare</h2>
        <p>Rural clinics face a unique challenge: volatile demand coupled with slow supply chains. A sudden flu outbreak can deplete three months of antiviral stock in a single weekend.</p>
        <h2>Predictive Restocking</h2>
        <p>Using historical data, weather patterns, and local epidemiology reports, modern inventory systems can predict demand spikes weeks before they happen.</p>
        <ul>
          <li>Automated reorder triggers based on dynamic thresholds.</li>
          <li>Vendor lead-time calculations integrated directly into the dashboard.</li>
        </ul>
        <p>With MediFlow's demand forecasting, clinics are seeing a 90% reduction in emergency out-of-stock scenarios.</p>
      `,
    },
    {
      title: "Regulatory Compliance in the Digital Age",
      excerpt:
        "Understanding the evolving landscape of digital prescription audits, data privacy laws, and HIPAA compliant architecture.",
      category: "INDUSTRY",
      tags: ["Compliance", "HIPAA", "Security"],
      readTime: 5,
      content: `
        <h2>Audits Are Changing</h2>
        <p>The era of paper trails is over. State boards and federal regulators are now utilizing digital scraping tools to audit dispensing logs for anomalies, controlled substance tracking, and billing fraud.</p>
        <h2>Building a Compliant Stack</h2>
        <p>Pharmacies must ensure their software providers guarantee:</p>
        <ul>
          <li>End-to-end encryption for all Patient Health Information (PHI).</li>
          <li>Immutable audit logs for every dispensing action.</li>
          <li>Strict Role-Based Access Control (RBAC).</li>
        </ul>
        <blockquote>"Compliance is no longer a checklist; it is an active, continuous engineering process."</blockquote>
      `,
    },
    {
      title: "Integrating LLMs into Daily Pharmacy Workflows",
      excerpt:
        "Practical applications of conversational AI for patient counseling, dosage calculations, and continuing education.",
      category: "TECHNOLOGY",
      tags: ["LLM", "Workflow", "Education"],
      readTime: 4,
      content: `
        <h2>Beyond Simple Chatbots</h2>
        <p>Large Language Models are evolving from novelty tools into clinical partners. Pharmacists are using secured, medically-trained LLMs to instantly reference standard dosage regimens and alternative therapies.</p>
        <h2>Real-World Applications</h2>
        <p>Imagine typing <em>"What is the pediatric dose adjustment for Amoxicillin in a 12kg patient with mild renal impairment?"</em> and getting a verified, cited answer instantly.</p>
        <p>While human verification is always required, the time saved in manual referencing allows practitioners to spend more time directly counseling patients.</p>
      `,
    },
    {
      title: "The Economics of Smart Pharmacy Management",
      excerpt:
        "How reducing expired stock and optimizing order quantities directly impacts the bottom line of independent pharmacies.",
      category: "INDUSTRY",
      tags: ["Finance", "Management", "Growth"],
      readTime: 7,
      content: `
        <h2>The Silent Profit Killer</h2>
        <p>Expired medications represent the single largest preventable loss for independent pharmacies, often accounting for thousands of dollars in wasted capital annually.</p>
        <h2>First-In, First-Out (FIFO) Automation</h2>
        <p>Smart systems track batch numbers and expiry dates automatically, pushing soon-to-expire drugs to the front of the dispensing queue.</p>
        <ul>
          <li>Alerts for stock expiring within 90 days.</li>
          <li>Automated return-to-vendor processing.</li>
        </ul>
        <p>By migrating to a digital, AI-assisted inventory tracker, independent owners can reclaim up to 15% of their operational budget.</p>
      `,
    },
  ];

  for (let i = 0; i < richBlogs.length; i++) {
    const blog = richBlogs[i]!;
    await prisma.blogPost.create({
      data: {
        authorId: admin.id,
        title: blog.title,
        slug: blog.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        excerpt: blog.excerpt,
        content: blog.content,
        coverImage: blogImages[i % blogImages.length],
        category: blog.category,
        readTime: blog.readTime,
        isPublished: true,
        tags: blog.tags,
      },
    });
  }
  console.log(`✅ ${richBlogs.length} Rich Blog Posts created`);

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
        {
          sessionId: session.id,
          role: "user",
          content: "What is the dosage for Amoxicillin?",
        },
        {
          sessionId: session.id,
          role: "assistant",
          content: "The standard adult dosage is 500mg every 8 hours.",
        },
      ],
    });
  }
  console.log(`✅ 5 AI Chat Sessions created`);

  console.log("🎉 Seeding complete! You can now log in with demo credentials.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
