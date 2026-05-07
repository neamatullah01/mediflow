# MediFlow — Product Requirements Document (PRD)

**Version:** 1.0  
**Project Type:** AI-Driven Full Stack Pharmacy Management Platform  
**Contest:** STN AI-Driven Full Stack Project Contest  
**Tech Stack:** Next.js (App Router) + Node.js + Express + TypeScript + Prisma + PostgreSQL

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [User Roles](#3-user-roles)
4. [Core Features & Functional Requirements](#4-core-features--functional-requirements)
5. [Page-by-Page Specification](#5-page-by-page-specification)
6. [AI Features (4 Required)](#6-ai-features-4-required)
7. [Database Schema — Prisma](#7-database-schema--prisma)
8. [API Endpoints](#8-api-endpoints)
9. [Project Folder Structure](#9-project-folder-structure)
10. [Advanced Engineering Requirements](#10-advanced-engineering-requirements)
11. [UI & Design Rules](#11-ui--design-rules)
12. [Environment Variables](#12-environment-variables)
13. [Response Format](#13-response-format)
14. [Business Logic Rules](#14-business-logic-rules)
15. [Deployment Checklist](#15-deployment-checklist)
16. [Demo Credentials](#16-demo-credentials)

---

## 1. Project Overview

**Name:** MediFlow  
**Tagline:** The AI-Powered Smart Pharmacy Management Platform  
**Problem it solves:**

Pharmacies in developing countries (Bangladesh and globally) struggle with:
- Drug stockouts — popular medicines run out with no warning
- Expiry waste — medicines expire on shelves, costing thousands
- Drug interaction errors — pharmacists miss dangerous drug combinations
- Manual, paper-based workflows — no digital tracking of inventory or prescriptions

**MediFlow** replaces spreadsheets and paper notebooks with a full-stack, AI-powered platform that gives pharmacies real-time inventory control, AI-driven safety checks, automated supplier order management, and clinical decision support — all in one web application.

**Who uses it:**
- **Pharmacist (user role):** Day-to-day medicine dispensing, inventory, prescriptions
- **Admin:** Platform-level management — all pharmacies, all users, drug master database, analytics

---

## 2. Tech Stack

### Frontend
| Concern | Technology |
|---------|-----------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + ShadCN UI |
| State management | Zustand |
| Forms | React Hook Form + Zod |
| Data fetching | TanStack Query (React Query) |
| Charts | Recharts |
| File upload | React Dropzone |
| Notifications | Sonner / react-hot-toast |
| Real-time | Socket.io client |

### Backend
| Concern | Technology |
|---------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Language | TypeScript |
| ORM | Prisma |
| Database | PostgreSQL (Neon / Supabase) |
| Auth | Better Auth (sessions + OAuth) |
| File storage | Cloudinary |
| Caching | In-memory (node-cache) / Redis |
| Queue | BullMQ |
| Logging | Winston |
| Real-time | Socket.io |
| AI | Google Gemini API (free tier) |

---

## 3. User Roles

| Role | Description | Access Level |
|------|-------------|--------------|
| `PHARMACIST` | Registered pharmacy staff. Manages own pharmacy inventory, prescriptions, orders | Dashboard + public pages |
| `ADMIN` | Platform super-admin. Manages all pharmacies, users, drug database, analytics | Full platform access |

> **Note:** A pharmacy (branch) is created during pharmacist registration. Each pharmacist belongs to one pharmacy. Admin is seeded in the database directly.

---

## 4. Core Features & Functional Requirements

### 4.1 Authentication System
- Email + password registration and login
- **Better Auth** handles session management via HTTP-only cookies (no manual JWT issuance)
- Role-based access control middleware on all protected routes (Better Auth plugins: `admin`, `customRole`)
- Google OAuth social login via Better Auth's built-in OAuth provider
- Demo login button (auto-fills credentials)
- Password hashing handled internally by Better Auth (argon2 / bcrypt)
- `isBanned` check on every authenticated request via Better Auth's `banned` user plugin

### 4.2 Inventory Management
- CRUD for medicine stock per pharmacy
- Each inventory item tracks: drug name, quantity, unit price, expiry date, batch number, reorder level, supplier
- Low stock alert: flag items where `quantity <= reorder_level`
- Expiry alert: flag items expiring within next 30 days
- Bulk import via CSV
- Export inventory as PDF/CSV

### 4.3 Drug Master Database (Admin-managed)
- A global catalogue of drugs maintained by Admin
- Pharmacists search this catalogue when adding inventory items
- Fields: name, generic name, category, dosage form, description, manufacturer, image, contraindications

### 4.4 Supplier Order Management
- Pharmacist creates purchase orders for specific drugs from named suppliers
- Order line items: drug, quantity ordered, unit price
- Order status flow: `PENDING → SHIPPED → RECEIVED → CANCELLED`
- On `RECEIVED`: automatically increment inventory quantity
- AI suggests order quantities based on demand forecast

### 4.5 Dispensing / Sales Log
- Record each time a medicine is dispensed to a patient
- Fields: drug, quantity dispensed, date, pharmacist who dispensed
- Feeds into AI demand forecasting
- Powers sales charts in dashboard

### 4.6 Patient & Interaction Records
- Store patient name + list of current medications
- Run AI drug interaction check and save results to patient record
- View history of all interaction checks per patient

### 4.7 Review System (Drug Reviews)
- Pharmacists can leave a clinical note / review on any drug in the master catalogue
- Star rating (1–5), text comment
- Helps other pharmacists know real-world usage experience

### 4.8 Admin Controls
- Approve or suspend pharmacist accounts
- Manage drug master database (add, edit, delete drugs)
- View all pharmacies, their inventory levels, activity
- Platform-wide analytics dashboard
- Manage blog posts for the public landing page

---

## 5. Page-by-Page Specification

### 5.1 Public Pages (No Login Required)

#### Landing Page `/`
The marketing homepage selling MediFlow to pharmacy owners.

**Navbar (logged out — min 4 routes):**
- Logo
- Home
- Features
- Drug Search (public)
- Blog
- Pricing
- Login button
- Register button

**Navbar (logged in — min 6 routes):**
- Logo
- Home
- Dashboard
- Drug Search
- Blog
- Pricing
- Profile dropdown (Profile, Settings, Logout)
- Notification bell

**Hero Section:**
- Height: 60–70% of viewport
- Animated pill/medicine icons floating in background
- Headline: "The Smart Pharmacy, Powered by AI"
- Subheadline: short problem statement
- Two CTAs: "Get Started Free" (→ register) and "Watch Demo" (opens modal)
- Animated counter numbers (pharmacies using it, drugs tracked, interactions caught)

**8 Required Sections:**
1. **Features** — 6 feature cards with icons: Inventory Tracking, AI Drug Interaction Checker, Demand Forecasting, Supplier Orders, AI Chatbot, Analytics Dashboard
2. **How It Works** — 3-step visual: Register → Set Up Inventory → Let AI Do the Rest
3. **Statistics** — animated counters: 500+ Pharmacies, 10,000+ Drugs Tracked, 98% Accuracy, 2,000+ Interactions Caught
4. **Drug Categories** — horizontal scrolling cards: Antibiotics, Analgesics, Antidiabetics, Cardiovascular, Vitamins, Respiratory
5. **AI Showcase** — visual demo of the AI chatbot and interaction checker in action (mockup cards)
6. **Testimonials** — 3 testimonial cards from fictional pharmacists with name, pharmacy, and star rating
7. **Blog Preview** — latest 3 blog posts (from DB) with image, title, date, excerpt, "Read More"
8. **FAQ** — accordion with 6 common questions
9. **Newsletter** — email signup form → saved to DB
10. **CTA Banner** — "Start managing your pharmacy smarter today" + "Sign Up Free" button

**Footer:**
- Logo + short tagline
- Links: About, Features, Pricing, Blog, Contact, Privacy Policy, Terms of Service
- Social icons: Facebook, LinkedIn, Twitter/X, GitHub
- Contact: email address, phone number
- Copyright

---

#### Drug Search / Explore Page `/drugs`
The public medicine listing page. **This is the "items listing" page for the contest.**

**Requirements:**
- Debounced search bar (500ms delay) — search by drug name or generic name
- Filter sidebar:
  - Category (dropdown: Antibiotic, Analgesic, Antidiabetic, Cardiovascular, Vitamin, etc.)
  - Dosage form (tablet, syrup, capsule, injection, cream)
  - Manufacturer (text filter)
  - Sort by: Name A–Z, Name Z–A, Newest First
- 4 cards per row on desktop, 2 on tablet, 1 on mobile
- Each card includes: drug image, name, generic name, category badge, dosage form, manufacturer, "View Details" button
- All cards same height/width, same border radius
- Skeleton loader while fetching
- Pagination (10 per page)

---

#### Drug Detail Page `/drugs/[id]`
Publicly accessible detail page. **This is the "items detail" page for the contest.**

**Sections:**
1. **Overview** — large image, name, generic name, category, dosage form, manufacturer
2. **Description** — full description, uses, how it works
3. **Key Information** — dosage guidelines, contraindications, storage requirements, side effects
4. **Reviews / Clinical Notes** — star rating average, list of pharmacist reviews with rating + comment + date
5. **Related Drugs** — 4 cards of drugs in the same category

---

#### Blog Page `/blog`
- List of all blog posts: image, title, excerpt, author, date, read time, category tag
- Debounced search + category filter
- Pagination

#### Blog Post Page `/blog/[slug]`
- Full article with rich text content
- Author info, date, tags
- Related posts section

#### About Page `/about`
- Mission statement
- Team section (fictional team cards)
- Company stats
- Timeline of milestones

#### Contact Page `/contact`
- Contact form (name, email, subject, message) → saved to DB + email notification
- Contact info: email, phone, address

#### Privacy Policy `/privacy` and Terms `/terms`
- Static rich text pages

---

### 5.2 Auth Pages

#### Login Page `/login`
- Email + password form
- React Hook Form + Zod validation
- Error messages on invalid credentials
- "Demo Pharmacist Login" button (auto-fills: `pharmacist@mediflow.com` / `Demo@1234`)
- "Demo Admin Login" button (auto-fills: `admin@mediflow.com` / `Admin@1234`)
- Google OAuth button (powered by Better Auth)
- Link to register page
- Success → redirect to `/dashboard`

#### Register Page `/register`
- Fields: Full name, Pharmacy name, License number, Address, Phone, Email, Password, Confirm password
- React Hook Form + Zod
- All validations with error messages
- Success state with confirmation message
- Link to login

---

### 5.3 Pharmacist Dashboard `/dashboard`

**Sidebar navigation (min 3 menu items — we have 7):**
- Overview (home icon)
- Inventory (package icon)
- Dispensing Log (clipboard icon)
- Supplier Orders (truck icon)
- Patients & Interactions (shield icon)
- AI Assistant (bot icon)
- Profile (user icon)

**Dashboard Navbar:**
- Pharmacy name + logo
- Notification bell with dropdown (low stock alerts, expiry alerts)
- Profile icon with dropdown: Profile, Settings, Logout

---

#### Dashboard Overview `/dashboard`
- **4 Stat cards:**
  1. Total inventory items (count)
  2. Low stock items (count, danger color if > 0)
  3. Expiring in 30 days (count, warning color if > 0)
  4. Total dispensed this month (count)
- **Line chart:** Dispensing activity — last 7 days (units dispensed per day)
- **Pie chart:** Inventory by category (Antibiotics 30%, Analgesics 25%, etc.)
- **Bar chart:** Top 5 most dispensed drugs this month
- **Alerts table:** Low stock items — Drug name, current qty, reorder level, action button "Order Now"
- **Expiry alerts table:** Drugs expiring soon — Drug name, batch, expiry date, quantity

---

#### Inventory Management `/dashboard/inventory`
- Table columns: Drug name, Category, Quantity, Unit price, Expiry date, Reorder level, Batch number, Supplier, Status (in stock / low / expired), Actions
- Search by drug name
- Filter by: category, status (in stock / low stock / expired)
- Sort by: name, quantity, expiry date
- Pagination (20 per page)
- "Add Item" button → modal form with drug search (searches master catalogue) + quantity, price, expiry, batch
- "Edit" inline or modal
- "Delete" with confirmation dialog
- Bulk delete checkbox
- Export as CSV button
- **AI forecast banner** at top — "3 drugs predicted to stock out in 14 days — View Forecast" (links to AI feature)

---

#### Dispensing Log `/dashboard/dispensing`
- Table: Drug, Quantity dispensed, Patient name (optional), Pharmacist, Date, Actions
- "Record Dispensing" button → form: select drug from inventory, quantity, optional patient name
- On submit: deduct quantity from inventory item
- Filter by: drug name, date range
- Pagination

---

#### Supplier Orders `/dashboard/orders`
- Table: Order ID, Supplier name, Status badge, Total amount, Items count, Created date, Actions
- Status color: PENDING=amber, SHIPPED=blue, RECEIVED=green, CANCELLED=red
- "Create Order" → multi-step form:
  - Step 1: Supplier name, expected delivery date
  - Step 2: Add order line items (drug, quantity, unit price) with "Add another drug" button
  - Step 3: Review and confirm
- View order detail → see all line items
- "Mark as Received" button → updates status + increments inventory
- Filter by status, date range
- Pagination

---

#### Patients & Interactions `/dashboard/patients`
- Table: Patient name, Phone (optional), Medications count, Last checked, Actions
- "Add Patient" → name, phone, list of current medications
- "Check Interactions" → triggers AI feature #1
- View patient detail → full medication list + interaction history
- Pagination + search by name

---

#### AI Assistant `/dashboard/ai-assistant`
- Full-page chat UI
- Left panel: chat history list (previous conversations), "New Chat" button
- Right panel: chat messages + input
- Messages: user bubble (right), AI bubble (left) with typing indicator
- Streaming responses (word by word)
- Copy message button on each AI response
- Session persisted in DB

---

#### Profile `/dashboard/profile`
- Editable form: full name, phone, email, pharmacy name, license number, address
- Avatar upload (Cloudinary)
- Change password section (current password, new password, confirm)
- Save button with loading state and success toast

---

### 5.4 Admin Dashboard `/admin`

**Sidebar navigation (min 5 menu items — we have 7):**
- Overview
- Pharmacies
- Users
- Drug Database
- Analytics
- Blog Manager
- Settings

---

#### Admin Overview `/admin`
- **6 Stat cards:** Total pharmacies, Total pharmacists, Total drugs in catalogue, Total dispensing records this month, Active orders, New registrations this week
- **Bar chart:** Pharmacies registered per month (last 6 months)
- **Line chart:** Platform-wide dispensing activity last 30 days
- **Pie chart:** Drug category distribution in master catalogue
- **Recent activity table:** Latest pharmacist registrations with status

---

#### Pharmacies `/admin/pharmacies`
- Table: Pharmacy name, License number, Address, Owner name, Status (ACTIVE/SUSPENDED), Registered date, Actions
- Actions: View details, Suspend, Activate
- Filter by status, search by name
- Pagination

#### Users `/admin/users`
- Table: Name, Email, Role, Pharmacy, Status (active/banned), Joined date, Actions
- Actions: View, Suspend/Activate, Delete
- Filter by role, status
- Pagination

#### Drug Database `/admin/drugs`
- Full CRUD for the master drug catalogue
- Table: Image, Name, Generic name, Category, Dosage form, Manufacturer, Actions
- "Add Drug" → full form with all fields + image upload (Cloudinary)
- Search, filter by category, sort
- Pagination

#### Analytics `/admin/analytics`
- AI Data Analyzer feature embedded here
- Charts: Top 20 most tracked drugs platform-wide, expiry rate trends, stockout frequency
- "Generate AI Insight" button → calls AI API → displays AI-written summary of platform health

#### Blog Manager `/admin/blog`
- Table of all blog posts: title, status (published/draft), author, date, views, Actions
- "Create Post" → rich text editor (React Quill / TipTap), title, excerpt, category, cover image
- Edit, Delete, Publish/Unpublish toggle

#### Settings `/admin/settings`
- Platform name and tagline
- Low stock threshold default (days)
- Expiry alert threshold default (days)
- Notification email settings

---

## 6. AI Features (4 Required)

> All AI features use **Google Gemini API (gemini-1.5-flash)** — free tier.  
> All must handle loading state, error handling, and structured JSON output.

---

### AI Feature 1: Drug Interaction Checker

**Where:** `/dashboard/patients` → patient detail page → "Check Interactions" button  
**Also available:** standalone checker widget in `/dashboard/patients`

**How it works:**
1. User enters 2–5 drug names in input fields (tag input)
2. Frontend sends `POST /api/v1/ai/check-interactions` with `{ drugs: ["Warfarin", "Aspirin", "Metformin"] }`
3. Backend builds a structured prompt and calls Gemini API
4. Response parsed as JSON and returned to frontend
5. Frontend displays color-coded result cards

**Prompt template:**
```
You are an expert clinical pharmacist. Analyze the following drug combination for interactions:
Drugs: {drug_list}

Return ONLY valid JSON in this exact format with no extra text:
{
  "overall_risk": "safe|moderate|dangerous",
  "summary": "One sentence overall assessment",
  "pairs": [
    {
      "drug_a": "Drug name",
      "drug_b": "Drug name",
      "severity": "safe|moderate|dangerous",
      "reason": "Clinical explanation (max 2 sentences)",
      "recommendation": "What the pharmacist should do"
    }
  ],
  "disclaimer": "Standard medical disclaimer"
}
```

**UI Result:**
- Overall risk badge (green/amber/red)
- One card per drug pair showing severity + reason + recommendation
- "Save to Patient Record" button

---

### AI Feature 2: AI Demand Forecasting

**Where:** `/dashboard/inventory` → top banner "AI Forecast" + dedicated `/dashboard/inventory/forecast` page

**How it works:**
1. Backend aggregates last 30 days of dispensing logs per drug for this pharmacy
2. Pharmacist clicks "Generate Forecast"
3. Frontend sends `POST /api/v1/ai/demand-forecast` with `{ pharmacyId }`
4. Backend fetches dispensing data, formats it, calls Gemini API
5. Returns forecast JSON with urgency levels
6. Result cached for 6 hours (Redis / node-cache) to avoid repeated API calls

**Prompt template:**
```
You are a pharmacy inventory analyst. Analyze this 30-day sales data and forecast stock needs.

Sales data (last 30 days):
{sales_data_formatted_as_list}

Current stock levels:
{current_stock_formatted_as_list}

For each drug, predict if it will stock out in the next 14 days.
Return ONLY valid JSON:
{
  "generated_at": "ISO date string",
  "forecasts": [
    {
      "drug_name": "...",
      "current_stock": 45,
      "avg_daily_usage": 4.0,
      "days_until_empty": 11,
      "will_stockout_in_14_days": true,
      "suggested_order_qty": 150,
      "urgency": "critical|high|medium|low",
      "reasoning": "Short explanation"
    }
  ],
  "overall_insight": "2-3 sentence summary of inventory health"
}
```

**UI Result:**
- Summary card with overall_insight from AI
- Sorted table by urgency (critical first)
- Each row: drug name, days until empty, urgency badge, suggested order qty, "Create Order" shortcut button
- "Export Forecast as PDF" button

---

### AI Feature 3: AI Pharmacist Assistant (Chatbot)

**Where:** `/dashboard/ai-assistant` — dedicated full-page chat interface

**How it works:**
1. Pharmacist types a clinical question (dosage, substitution, side effects, etc.)
2. Frontend sends `POST /api/v1/ai/chat` with `{ messages: [...conversationHistory], newMessage: "..." }`
3. Backend maintains conversation context by passing full history to Gemini
4. Gemini streaming response piped back to frontend via SSE (Server-Sent Events)
5. Chat history saved to DB (`AiChatSession`, `AiChatMessage` tables)

**System prompt (sent once as first message):**
```
You are MediBot, an expert clinical pharmacist assistant built into the MediFlow platform. 
You help pharmacists with:
- Drug dosage questions (adult and pediatric)
- Drug substitution recommendations
- Side effect information
- Contraindications and warnings
- Storage and handling requirements
- General pharmaceutical knowledge

Always be clear, concise, and professional. Always end responses with: 
"⚠️ For patient-specific decisions, always consult the prescribing physician."
Never diagnose patients or replace medical advice.
```

**UI:**
- Left sidebar: list of past chat sessions with first message preview, "New Chat" button
- Main area: chat bubbles (user right, MediBot left)
- Typing indicator (animated dots) while streaming
- Each AI message has "Copy" button
- Input with send button + Enter key support
- Streaming: words appear one by one (not all at once)

---

### AI Feature 4: AI Auto Drug Tagger & Categorizer

**Where:** `/admin/drugs` → "Add Drug" form → "Auto-fill with AI" button  
**Also:** Admin can run batch re-categorization on existing drugs

**Why this replaces Prescription Reader:** Prescription reader needs image understanding from a paid/advanced API tier. The Auto Tagger works perfectly with Gemini's free tier and is genuinely useful — it lets admin add a drug name and Gemini fills in all other fields automatically.

**How it works:**
1. Admin types only the drug name (e.g., "Amoxicillin 500mg")
2. Clicks "Auto-fill with AI"
3. Frontend sends `POST /api/v1/ai/tag-drug` with `{ drugName: "Amoxicillin 500mg" }`
4. Backend calls Gemini API with structured prompt
5. Returns full drug profile as JSON
6. Form fields are pre-filled with AI output — admin can review and edit before saving

**Prompt template:**
```
You are a pharmaceutical database expert. Given a drug name, provide complete structured information.

Drug name: {drug_name}

Return ONLY valid JSON with no extra text:
{
  "name": "Full brand/generic name",
  "generic_name": "INN generic name",
  "category": "One of: Antibiotic|Analgesic|Antidiabetic|Cardiovascular|Vitamin|Respiratory|Antifungal|Antiviral|Antihistamine|Gastrointestinal|Psychiatric|Other",
  "dosage_form": "One of: tablet|capsule|syrup|injection|cream|inhaler|drops",
  "description": "2-3 sentence plain-language description of what this drug is and its primary use",
  "uses": ["Use 1", "Use 2", "Use 3"],
  "common_dosage": "Standard adult dosage guidance",
  "side_effects": ["Side effect 1", "Side effect 2", "Side effect 3"],
  "contraindications": ["Contraindication 1", "Contraindication 2"],
  "storage": "Storage requirements (e.g. Store below 25°C, away from light)",
  "manufacturer": "Common manufacturer name (or 'Various' if generic)"
}
```

**UI:**
- Drug form initially has only "Drug Name" filled in
- "Auto-fill with AI" button with loading spinner
- On success: all other fields populate instantly with smooth fade-in animation
- Admin reviews, edits anything incorrect, then saves
- Error state if AI fails: "Could not auto-fill. Please enter details manually."

---

## 7. Database Schema — Prisma

```prisma
// schema.prisma
// Database: PostgreSQL

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────

enum Role {
  PHARMACIST
  ADMIN
}

enum PharmacyStatus {
  ACTIVE
  SUSPENDED
}

enum OrderStatus {
  PENDING
  SHIPPED
  RECEIVED
  CANCELLED
}

enum DrugCategory {
  ANTIBIOTIC
  ANALGESIC
  ANTIDIABETIC
  CARDIOVASCULAR
  VITAMIN
  RESPIRATORY
  ANTIFUNGAL
  ANTIVIRAL
  ANTIHISTAMINE
  GASTROINTESTINAL
  PSYCHIATRIC
  OTHER
}

enum DosageForm {
  TABLET
  CAPSULE
  SYRUP
  INJECTION
  CREAM
  INHALER
  DROPS
}

enum InventoryStatus {
  IN_STOCK
  LOW_STOCK
  OUT_OF_STOCK
  EXPIRED
}

enum InteractionSeverity {
  SAFE
  MODERATE
  DANGEROUS
}

// ─────────────────────────────────────────────
// PHARMACY
// ─────────────────────────────────────────────

model Pharmacy {
  id            String         @id @default(uuid())
  name          String
  licenseNumber String         @unique
  address       String
  phone         String
  status        PharmacyStatus @default(ACTIVE)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  // Relations
  users          User[]
  inventoryItems InventoryItem[]
  supplierOrders SupplierOrder[]
  dispensingLogs DispensingLog[]
  patients       Patient[]
  aiChatSessions AiChatSession[]

  @@map("pharmacies")
}

// ─────────────────────────────────────────────
// USER
// ─────────────────────────────────────────────

model User {
  id         String   @id @default(uuid())
  name       String
  email      String   @unique
  password   String
  role       Role     @default(PHARMACIST)
  avatarUrl  String?
  phone      String?
  isBanned   Boolean  @default(false)
  pharmacyId String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  // Relations
  pharmacy       Pharmacy?       @relation(fields: [pharmacyId], references: [id])
  dispensingLogs DispensingLog[]
  reviews        DrugReview[]
  aiChatSessions AiChatSession[]
  blogPosts      BlogPost[]
  contactMessages ContactMessage[]

  @@map("users")
}

// ─────────────────────────────────────────────
// DRUG (Master Catalogue — managed by Admin)
// ─────────────────────────────────────────────

model Drug {
  id               String       @id @default(uuid())
  name             String
  genericName      String
  category         DrugCategory
  dosageForm       DosageForm
  description      String       @db.Text
  uses             String[]
  commonDosage     String?
  sideEffects      String[]
  contraindications String[]
  storage          String?
  manufacturer     String?
  imageUrl         String?
  isActive         Boolean      @default(true)
  createdAt        DateTime     @default(now())
  updatedAt        DateTime     @updatedAt

  // Relations
  inventoryItems InventoryItem[]
  orderLineItems OrderLineItem[]
  dispensingLogs DispensingLog[]
  reviews        DrugReview[]
  interactions   DrugInteractionCheck[]

  @@map("drugs")
}

// ─────────────────────────────────────────────
// INVENTORY ITEM (Per Pharmacy Stock)
// ─────────────────────────────────────────────

model InventoryItem {
  id           String          @id @default(uuid())
  pharmacyId   String
  drugId       String
  quantity     Int             @default(0)
  unitPrice    Decimal         @db.Decimal(10, 2)
  expiryDate   DateTime
  batchNumber  String?
  reorderLevel Int             @default(10)
  supplierName String?
  status       InventoryStatus @default(IN_STOCK)
  createdAt    DateTime        @default(now())
  updatedAt    DateTime        @updatedAt

  // Relations
  pharmacy       Pharmacy        @relation(fields: [pharmacyId], references: [id], onDelete: Cascade)
  drug           Drug            @relation(fields: [drugId], references: [id])
  dispensingLogs DispensingLog[]

  @@unique([pharmacyId, drugId, batchNumber])
  @@map("inventory_items")
}

// ─────────────────────────────────────────────
// SUPPLIER ORDER
// ─────────────────────────────────────────────

model SupplierOrder {
  id               String      @id @default(uuid())
  pharmacyId       String
  supplierName     String
  status           OrderStatus @default(PENDING)
  totalAmount      Decimal     @db.Decimal(10, 2) @default(0)
  expectedDelivery DateTime?
  receivedAt       DateTime?
  notes            String?
  createdAt        DateTime    @default(now())
  updatedAt        DateTime    @updatedAt

  // Relations
  pharmacy  Pharmacy        @relation(fields: [pharmacyId], references: [id], onDelete: Cascade)
  lineItems OrderLineItem[]

  @@map("supplier_orders")
}

model OrderLineItem {
  id        String   @id @default(uuid())
  orderId   String
  drugId    String
  quantity  Int
  unitPrice Decimal  @db.Decimal(10, 2)
  createdAt DateTime @default(now())

  // Relations
  order SupplierOrder @relation(fields: [orderId], references: [id], onDelete: Cascade)
  drug  Drug          @relation(fields: [drugId], references: [id])

  @@map("order_line_items")
}

// ─────────────────────────────────────────────
// DISPENSING LOG (Sales / Dispensing Record)
// ─────────────────────────────────────────────

model DispensingLog {
  id              String   @id @default(uuid())
  pharmacyId      String
  inventoryItemId String
  drugId          String
  pharmacistId    String
  patientName     String?
  quantityDispensed Int
  dispensedAt     DateTime @default(now())
  createdAt       DateTime @default(now())

  // Relations
  pharmacy      Pharmacy      @relation(fields: [pharmacyId], references: [id], onDelete: Cascade)
  inventoryItem InventoryItem @relation(fields: [inventoryItemId], references: [id])
  drug          Drug          @relation(fields: [drugId], references: [id])
  pharmacist    User          @relation(fields: [pharmacistId], references: [id])

  @@map("dispensing_logs")
}

// ─────────────────────────────────────────────
// PATIENT & DRUG INTERACTION RECORDS
// ─────────────────────────────────────────────

model Patient {
  id          String   @id @default(uuid())
  pharmacyId  String
  name        String
  phone       String?
  medications String[]
  notes       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  pharmacy             Pharmacy               @relation(fields: [pharmacyId], references: [id], onDelete: Cascade)
  interactionChecks    DrugInteractionCheck[]

  @@map("patients")
}

model DrugInteractionCheck {
  id           String              @id @default(uuid())
  patientId    String?
  pharmacyId   String?
  drugsChecked String[]
  overallRisk  InteractionSeverity
  resultJson   Json
  createdAt    DateTime            @default(now())

  // Relations
  patient Patient? @relation(fields: [patientId], references: [id])
  drugs   Drug[]

  @@map("drug_interaction_checks")
}

// ─────────────────────────────────────────────
// DRUG REVIEWS (Pharmacist clinical notes)
// ─────────────────────────────────────────────

model DrugReview {
  id          String   @id @default(uuid())
  drugId      String
  pharmacistId String
  rating      Int      // 1–5
  comment     String   @db.Text
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  drug       Drug @relation(fields: [drugId], references: [id], onDelete: Cascade)
  pharmacist User @relation(fields: [pharmacistId], references: [id])

  @@unique([drugId, pharmacistId])
  @@map("drug_reviews")
}

// ─────────────────────────────────────────────
// AI CHAT SESSIONS
// ─────────────────────────────────────────────

model AiChatSession {
  id         String   @id @default(uuid())
  pharmacyId String
  userId     String
  title      String   @default("New Chat")
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  // Relations
  pharmacy Pharmacy       @relation(fields: [pharmacyId], references: [id], onDelete: Cascade)
  user     User           @relation(fields: [userId], references: [id])
  messages AiChatMessage[]

  @@map("ai_chat_sessions")
}

model AiChatMessage {
  id        String   @id @default(uuid())
  sessionId String
  role      String   // "user" | "assistant"
  content   String   @db.Text
  createdAt DateTime @default(now())

  // Relations
  session AiChatSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)

  @@map("ai_chat_messages")
}

// ─────────────────────────────────────────────
// BLOG
// ─────────────────────────────────────────────

model BlogPost {
  id          String   @id @default(uuid())
  authorId    String
  title       String
  slug        String   @unique
  excerpt     String
  content     String   @db.Text
  coverImage  String?
  category    String?
  tags        String[]
  isPublished Boolean  @default(false)
  views       Int      @default(0)
  readTime    Int      @default(5)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  author User @relation(fields: [authorId], references: [id])

  @@map("blog_posts")
}

// ─────────────────────────────────────────────
// CONTACT MESSAGES
// ─────────────────────────────────────────────

model ContactMessage {
  id        String   @id @default(uuid())
  userId    String?
  name      String
  email     String
  subject   String
  message   String   @db.Text
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())

  // Relations
  user User? @relation(fields: [userId], references: [id])

  @@map("contact_messages")
}

// ─────────────────────────────────────────────
// NEWSLETTER
// ─────────────────────────────────────────────

model NewsletterSubscriber {
  id          String   @id @default(uuid())
  email       String   @unique
  subscribedAt DateTime @default(now())

  @@map("newsletter_subscribers")
}
```

---

## 8. API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/register` | Register new pharmacist + pharmacy | Public |
| POST | `/api/v1/auth/login` | Login, create Better Auth session | Public |
| POST | `/api/v1/auth/logout` | Clear token cookies | Authenticated |
| POST | `/api/v1/auth/refresh-token` | Refresh session (handled by Better Auth) | Public |
| GET | `/api/v1/auth/me` | Get current user profile | Authenticated |

### Users
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/users` | Get all users | Admin |
| GET | `/api/v1/users/:id` | Get user by ID | Admin |
| PATCH | `/api/v1/users/:id` | Update user profile | Owner / Admin |
| PATCH | `/api/v1/users/:id/ban` | Ban or unban user | Admin |
| DELETE | `/api/v1/users/:id` | Delete user | Admin |
| POST | `/api/v1/users/upload-avatar` | Upload profile photo | Authenticated |

### Pharmacies
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/pharmacies` | Get all pharmacies | Admin |
| GET | `/api/v1/pharmacies/:id` | Get pharmacy by ID | Admin / Owner |
| PATCH | `/api/v1/pharmacies/:id` | Update pharmacy info | Owner / Admin |
| PATCH | `/api/v1/pharmacies/:id/status` | Activate or suspend | Admin |

### Drugs (Master Catalogue)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/drugs` | Get all drugs (search, filter, paginate) | Public |
| GET | `/api/v1/drugs/:id` | Get drug detail | Public |
| POST | `/api/v1/drugs` | Create drug in catalogue | Admin |
| PATCH | `/api/v1/drugs/:id` | Update drug | Admin |
| DELETE | `/api/v1/drugs/:id` | Soft delete drug (isActive=false) | Admin |

### Inventory
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/inventory` | Get pharmacy inventory (filter, sort, paginate) | Pharmacist |
| GET | `/api/v1/inventory/:id` | Get inventory item detail | Pharmacist |
| POST | `/api/v1/inventory` | Add item to inventory | Pharmacist |
| PATCH | `/api/v1/inventory/:id` | Update inventory item | Pharmacist |
| DELETE | `/api/v1/inventory/:id` | Remove inventory item | Pharmacist |
| GET | `/api/v1/inventory/alerts/low-stock` | Get low stock items | Pharmacist |
| GET | `/api/v1/inventory/alerts/expiring` | Get expiring items | Pharmacist |

### Dispensing Logs
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/dispensing` | Get dispensing logs (filter by date, drug) | Pharmacist |
| POST | `/api/v1/dispensing` | Record a dispensing event | Pharmacist |
| DELETE | `/api/v1/dispensing/:id` | Delete a record | Pharmacist / Admin |

### Supplier Orders
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/orders` | Get all orders for this pharmacy | Pharmacist |
| GET | `/api/v1/orders/:id` | Get order with line items | Pharmacist |
| POST | `/api/v1/orders` | Create a new order | Pharmacist |
| PATCH | `/api/v1/orders/:id/status` | Update order status | Pharmacist |
| DELETE | `/api/v1/orders/:id` | Cancel order (if PENDING) | Pharmacist |

### Patients & Interactions
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/patients` | Get patients for pharmacy | Pharmacist |
| GET | `/api/v1/patients/:id` | Get patient + interaction history | Pharmacist |
| POST | `/api/v1/patients` | Add patient | Pharmacist |
| PATCH | `/api/v1/patients/:id` | Update patient medications | Pharmacist |
| DELETE | `/api/v1/patients/:id` | Delete patient record | Pharmacist |

### Drug Reviews
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/drugs/:id/reviews` | Get reviews for a drug | Public |
| POST | `/api/v1/drugs/:id/reviews` | Submit review | Pharmacist |
| DELETE | `/api/v1/reviews/:id` | Delete review | Owner / Admin |

### AI Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/ai/check-interactions` | Drug interaction check | Pharmacist |
| POST | `/api/v1/ai/demand-forecast` | Generate stock forecast | Pharmacist |
| POST | `/api/v1/ai/chat` | Send chat message (streaming SSE) | Pharmacist |
| GET | `/api/v1/ai/chat/sessions` | Get chat session list | Pharmacist |
| GET | `/api/v1/ai/chat/sessions/:id` | Get chat session messages | Pharmacist |
| DELETE | `/api/v1/ai/chat/sessions/:id` | Delete chat session | Pharmacist |
| POST | `/api/v1/ai/tag-drug` | Auto-fill drug fields with AI | Admin |
| POST | `/api/v1/ai/analyze-platform` | Generate platform health insight | Admin |

### Blog
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/blog` | Get published posts (filter, paginate) | Public |
| GET | `/api/v1/blog/:slug` | Get post by slug | Public |
| POST | `/api/v1/blog` | Create blog post | Admin |
| PATCH | `/api/v1/blog/:id` | Update blog post | Admin |
| DELETE | `/api/v1/blog/:id` | Delete blog post | Admin |
| PATCH | `/api/v1/blog/:id/publish` | Toggle publish status | Admin |

### Admin Dashboard
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/admin/stats` | Platform overview metrics | Admin |
| GET | `/api/v1/admin/activity` | Recent activity feed | Admin |

### Misc
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/contact` | Submit contact message | Public |
| POST | `/api/v1/newsletter/subscribe` | Subscribe to newsletter | Public |

---

## 9. Project Folder Structure

### Backend (`/backend`)

```
backend/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts                         # Seed admin, sample drugs, sample pharmacy
├── src/
│   ├── config/
│   │   └── index.ts                    # All env variables exported
│   ├── lib/
│   │   ├── prisma.ts                   # Prisma client singleton
│   │   ├── gemini.ts                   # Gemini API client setup
│   │   ├── cloudinary.ts               # Cloudinary config
│   │   └── cache.ts                    # node-cache setup
│   ├── errors/
│   │   ├── AppError.ts                 # Custom error class
│   │   ├── handlePrismaError.ts
│   │   ├── handlePrismaValidationError.ts
│   │   └── handleZodError.ts
│   ├── interfaces/
│   │   └── common.interface.ts         # Shared TypeScript interfaces
│   ├── middlewares/
│   │   ├── auth.middleware.ts          # Better Auth session verify + role check
│   │   ├── globalErrorHandler.ts
│   │   ├── notFound.ts
│   │   ├── validateRequest.ts          # Zod schema validation middleware
│   │   └── rateLimiter.ts              # express-rate-limit config
│   ├── modules/
│   │   ├── Auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.route.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.utils.ts           # Better Auth helper utilities (session, role checks)
│   │   │   └── auth.validation.ts
│   │   ├── User/
│   │   │   ├── user.controller.ts
│   │   │   ├── user.route.ts
│   │   │   ├── user.service.ts
│   │   │   └── user.validation.ts
│   │   ├── Pharmacy/
│   │   │   ├── pharmacy.controller.ts
│   │   │   ├── pharmacy.route.ts
│   │   │   └── pharmacy.service.ts
│   │   ├── Drug/
│   │   │   ├── drug.controller.ts
│   │   │   ├── drug.route.ts
│   │   │   ├── drug.service.ts
│   │   │   └── drug.validation.ts
│   │   ├── Inventory/
│   │   │   ├── inventory.controller.ts
│   │   │   ├── inventory.route.ts
│   │   │   ├── inventory.service.ts
│   │   │   └── inventory.validation.ts
│   │   ├── Dispensing/
│   │   │   ├── dispensing.controller.ts
│   │   │   ├── dispensing.route.ts
│   │   │   └── dispensing.service.ts
│   │   ├── Order/
│   │   │   ├── order.controller.ts
│   │   │   ├── order.route.ts
│   │   │   ├── order.service.ts
│   │   │   └── order.validation.ts
│   │   ├── Patient/
│   │   │   ├── patient.controller.ts
│   │   │   ├── patient.route.ts
│   │   │   ├── patient.service.ts
│   │   │   └── patient.validation.ts
│   │   ├── Review/
│   │   │   ├── review.controller.ts
│   │   │   ├── review.route.ts
│   │   │   └── review.service.ts
│   │   ├── AI/
│   │   │   ├── ai.controller.ts
│   │   │   ├── ai.route.ts
│   │   │   ├── ai.service.ts           # All AI calls to Gemini
│   │   │   └── ai.prompts.ts           # All prompt templates
│   │   ├── Blog/
│   │   │   ├── blog.controller.ts
│   │   │   ├── blog.route.ts
│   │   │   ├── blog.service.ts
│   │   │   └── blog.validation.ts
│   │   ├── Admin/
│   │   │   ├── admin.controller.ts
│   │   │   ├── admin.route.ts
│   │   │   └── admin.service.ts
│   │   └── Misc/
│   │       ├── misc.controller.ts      # Contact form, newsletter
│   │       └── misc.route.ts
│   ├── routes/
│   │   └── index.ts                    # All route aggregator
│   ├── utils/
│   │   ├── catchAsync.ts               # Async error wrapper
│   │   ├── sendResponse.ts             # Standardized response helper
│   │   ├── uploadToCloud.ts            # Cloudinary upload helper
│   │   ├── pagination.ts               # Pagination helper
│   │   └── logger.ts                   # Winston logger setup
│   ├── jobs/
│   │   └── inventoryAlerts.job.ts      # BullMQ job: check low stock + expiry daily
│   ├── app.ts                          # Express app setup, middlewares, routes
│   └── server.ts                       # HTTP server + Socket.io
├── .env
├── .env.example
├── package.json
└── tsconfig.json
```

### Frontend (`/frontend`)

```
frontend/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                    # Landing page
│   │   ├── drugs/
│   │   │   ├── page.tsx                # Drug search listing
│   │   │   └── [id]/page.tsx           # Drug detail
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── pricing/page.tsx
│   │   ├── privacy/page.tsx
│   │   └── terms/page.tsx
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx                  # Dashboard shell: sidebar + topnav
│   │   ├── dashboard/
│   │   │   ├── page.tsx                # Overview
│   │   │   ├── inventory/
│   │   │   │   ├── page.tsx
│   │   │   │   └── forecast/page.tsx   # AI forecast page
│   │   │   ├── dispensing/page.tsx
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── patients/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── ai-assistant/page.tsx
│   │   │   └── profile/page.tsx
│   ├── (admin)/
│   │   ├── layout.tsx                  # Admin shell: sidebar + topnav
│   │   ├── admin/
│   │   │   ├── page.tsx                # Admin overview
│   │   │   ├── pharmacies/page.tsx
│   │   │   ├── users/page.tsx
│   │   │   ├── drugs/
│   │   │   │   ├── page.tsx
│   │   │   │   └── new/page.tsx
│   │   │   ├── analytics/page.tsx
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   └── settings/page.tsx
│   ├── api/
│   │   └── auth/[...all]/route.ts      # Better Auth handler (catch-all route)
│   ├── layout.tsx                      # Root layout (fonts, providers)
│   └── globals.css
├── components/
│   ├── ui/                             # ShadCN auto-generated components
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── DashboardSidebar.tsx
│   │   ├── DashboardTopNav.tsx
│   │   ├── AdminSidebar.tsx
│   │   └── NotificationDropdown.tsx
│   ├── landing/
│   │   ├── HeroSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── HowItWorksSection.tsx
│   │   ├── StatsSection.tsx
│   │   ├── CategoriesSection.tsx
│   │   ├── AIShowcaseSection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   ├── BlogPreviewSection.tsx
│   │   ├── FAQSection.tsx
│   │   ├── NewsletterSection.tsx
│   │   └── CTASection.tsx
│   ├── drugs/
│   │   ├── DrugCard.tsx
│   │   ├── DrugCardSkeleton.tsx
│   │   ├── DrugFilters.tsx
│   │   └── DrugReviewCard.tsx
│   ├── inventory/
│   │   ├── InventoryTable.tsx
│   │   ├── AddInventoryModal.tsx
│   │   ├── ForecastCard.tsx
│   │   └── AlertBanner.tsx
│   ├── orders/
│   │   ├── OrderTable.tsx
│   │   ├── CreateOrderForm.tsx
│   │   └── OrderStatusBadge.tsx
│   ├── ai/
│   │   ├── InteractionChecker.tsx
│   │   ├── InteractionResultCard.tsx
│   │   ├── ChatWindow.tsx
│   │   ├── ChatMessage.tsx
│   │   ├── ChatSessionList.tsx
│   │   └── AutoFillButton.tsx
│   ├── charts/
│   │   ├── DispensingLineChart.tsx
│   │   ├── CategoryPieChart.tsx
│   │   └── TopDrugsBarChart.tsx
│   └── common/
│       ├── PageHeader.tsx
│       ├── StatCard.tsx
│       ├── DataTable.tsx               # Reusable table with sort + paginate
│       ├── SearchInput.tsx
│       ├── Pagination.tsx
│       └── ConfirmDialog.tsx
├── lib/
│   ├── api.ts                          # Axios instance with interceptors
│   ├── auth.ts                         # Better Auth client config
│   └── utils.ts                        # cn(), formatDate(), formatCurrency()
├── hooks/
│   ├── useAuth.ts
│   ├── useInventory.ts
│   ├── useAIChat.ts
│   └── useNotifications.ts
├── store/
│   └── useStore.ts                     # Zustand global store (auth state, notifications)
├── types/
│   └── index.ts                        # All shared TypeScript types
├── public/
│   └── images/
├── .env.local
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 10. Advanced Engineering Requirements

### Frontend (3 required — we implement all 5)

| Requirement | Implementation |
|------------|---------------|
| Server Components | Drug list, drug detail, blog pages — fetched server-side with Next.js RSC |
| Suspense / Streaming | Wrap dashboard charts and drug detail sections in `<Suspense>` with skeleton fallbacks |
| Optimistic UI | Adding inventory item — show it in the table immediately, rollback if API fails |
| Live notifications | Socket.io broadcasts low-stock alert to logged-in pharmacist in real time when another dispensing event triggers it |
| Real-time updates | AI chat streaming via SSE — responses stream word by word |

### Backend (3 required — we implement all 5)

| Requirement | Implementation |
|------------|---------------|
| Rate limiting | `express-rate-limit`: global 100 req/15min, AI endpoints 10 req/15min |
| Logging | Winston: info level to console, error level to `logs/error.log`, requests logged via morgan |
| Caching | `node-cache`: AI forecast response cached per pharmacyId for 6 hours |
| Queue system | BullMQ: daily job runs at midnight to check all inventory items for low stock + expiry, emits Socket.io events |
| Error tracking | All caught errors logged to file; production: integrate Sentry DSN |

---

## 11. UI & Design Rules

### Color Palette (max 3 primary + neutral)
| Token | Color | Usage |
|-------|-------|-------|
| Primary | `#0EA5E9` (sky blue) | Buttons, links, active states |
| Secondary | `#10B981` (emerald) | Success states, "safe" interactions, in-stock badges |
| Accent | `#F59E0B` (amber) | Warnings, low stock, moderate severity |
| Danger | `#EF4444` (red) | Errors, dangerous interactions, out of stock |
| Neutral | Gray scale | Text, backgrounds, borders |

### Global Rules
- Light mode default, dark mode via `class="dark"` toggle stored in localStorage
- All cards: same border radius (`rounded-xl` / `12px`), same padding (`p-5`)
- All cards: `border border-gray-200 dark:border-gray-700` with white/gray-900 background
- Spacing system: multiples of 4px using Tailwind (gap-4, p-5, mt-6, etc.)
- Font: Inter (Google Fonts) — weights 400, 500, 600
- All forms: React Hook Form + Zod — show error messages below each field, success toast on submit
- Skeleton loaders on all data-fetched sections
- No lorem ipsum anywhere — all content is real pharma domain content

### Responsive Breakpoints
| Breakpoint | Cards per row |
|-----------|--------------|
| Mobile (<768px) | 1 |
| Tablet (768–1024px) | 2 |
| Desktop (>1024px) | 4 |

---

## 12. Environment Variables

### Backend `.env`
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@host:5432/mediflow

# Better Auth
BETTER_AUTH_SECRET=your_better_auth_secret_here
BETTER_AUTH_URL=http://localhost:5000

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# File Storage — Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Redis (optional — fallback to node-cache if not set)
REDIS_URL=redis://localhost:6379

# BullMQ
BULL_REDIS_URL=redis://localhost:6379

# Sentry (production)
SENTRY_DSN=your_sentry_dsn

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### Frontend `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

# Better Auth
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:5000

# Google OAuth (used by Better Auth)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

---

## 13. Response Format

### Success Response
```json
{
  "success": true,
  "message": "Inventory items retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 87,
    "totalPages": 5
  },
  "data": []
}
```

### Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "errorSources": [
    { "path": "quantity", "message": "Quantity must be a positive number" },
    { "path": "expiryDate", "message": "Expiry date cannot be in the past" }
  ],
  "stack": "..."
}
```

> `stack` is only included when `NODE_ENV=development`

---

## 14. Business Logic Rules

1. **Registration:** Better Auth hashes password internally before storing. Auto-create `Pharmacy` record linked to new `User`.
2. **Login:** Better Auth verifies credentials → creates a session stored in DB → sets HTTP-only session cookie automatically.
3. **Auth Middleware:** Better Auth validates session cookie → check user exists in DB → confirm `isBanned = false` → validate role via Better Auth plugin.
4. **Inventory Status Auto-update:** On every inventory update, recalculate `status`:
   - `quantity === 0` → `OUT_OF_STOCK`
   - `quantity <= reorderLevel` → `LOW_STOCK`
   - `expiryDate < today` → `EXPIRED`
   - else → `IN_STOCK`
5. **Dispensing Event:** Deduct `quantityDispensed` from `InventoryItem.quantity`. If resulting quantity ≤ reorder level, emit Socket.io event `low-stock-alert` to connected pharmacist.
6. **Order Received:** On status change to `RECEIVED`, loop through all `OrderLineItem`s and increment corresponding `InventoryItem.quantity`. If no matching `InventoryItem` exists, create one.
7. **AI Rate Limit:** AI endpoints limited to 10 requests per 15 minutes per IP to protect free API quota.
8. **AI Forecast Cache:** Cache forecast result per `pharmacyId` for 6 hours in node-cache. Return cached result if available and not expired.
9. **Drug Interaction Save:** Each call to `/ai/check-interactions` saves a `DrugInteractionCheck` record to DB regardless of result — for audit trail.
10. **Chat History:** Full conversation history passed to Gemini on every message to maintain context. Session title auto-set to first user message (max 50 chars).
11. **Drug Review Uniqueness:** One review per pharmacist per drug. Enforce with `@@unique([drugId, pharmacistId])`.
12. **Pagination:** All list endpoints support `?page=1&limit=20&sortBy=createdAt&sortOrder=desc`.
13. **Search:** All search uses Prisma `contains` with `mode: 'insensitive'` for case-insensitive matching.
14. **Admin Seeding:** Admin user created via `prisma/seed.ts` — never through registration endpoint.
15. **Blog Slug:** Auto-generated from title on creation using slugify. Must be unique.

---

## 15. Deployment Checklist

1. Set `NODE_ENV=production` in all environments
2. Provision PostgreSQL on **Neon** (free tier — 512MB)
3. Run `npx prisma generate && npx prisma migrate deploy`
4. Run `npx ts-node prisma/seed.ts` to seed admin + sample drugs
5. Configure **Cloudinary** account and set env vars
6. Get **Gemini API key** from [aistudio.google.com](https://aistudio.google.com) — free
7. Configure **Google OAuth** credentials in Google Cloud Console and register them in Better Auth config
8. Set CORS to allow frontend domain only in production
9. Deploy backend to **Railway** (free tier)
10. Deploy frontend to **Vercel** (free tier)
11. Set all env vars in Railway and Vercel dashboards — never hardcode
12. Test all 4 AI features with real API calls in production
13. Verify dark mode contrast on all pages
14. Verify all 4 cards per row on desktop view
15. Confirm demo login buttons work with seeded credentials

---

## 16. Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Pharmacist | `pharmacist@mediflow.com` | `Demo@1234` |
| Admin | `admin@mediflow.com` | `Admin@1234` |

Both accounts seeded via `prisma/seed.ts` with realistic sample data:
- 50 drugs in master catalogue
- 30 inventory items for demo pharmacy
- 15 dispensing logs (last 30 days) for chart data
- 5 supplier orders in various statuses
- 3 patients with interaction history
- 10 blog posts (published)
- 5 AI chat sessions with message history

---

## Dependencies Reference

### Backend `package.json`
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "cookie-parser": "^1.4.6",
    "dotenv": "^16.3.1",
    "@prisma/client": "^5.7.0",
    "better-auth": "^1.0.0",
    "zod": "^3.22.4",
    "http-status": "^1.7.3",
    "@google/generative-ai": "^0.2.0",
    "cloudinary": "^1.41.3",
    "multer": "^1.4.5-lts.1",
    "socket.io": "^4.6.1",
    "bullmq": "^4.14.0",
    "node-cache": "^5.1.2",
    "winston": "^3.11.0",
    "morgan": "^1.10.0",
    "express-rate-limit": "^7.1.5",
    "slugify": "^1.6.6"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "ts-node-dev": "^2.0.0",
    "prisma": "^5.7.0",
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",

    "@types/multer": "^1.4.11",
    "@types/morgan": "^1.9.9",
    "eslint": "^8.56.0",
    "prettier": "^3.1.1"
  }
}
```

### Frontend `package.json`
```json
{
  "dependencies": {
    "next": "^14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.3.3",
    "tailwindcss": "^3.4.0",
    "@radix-ui/react-*": "latest",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "zustand": "^4.4.7",
    "@tanstack/react-query": "^5.17.0",
    "react-hook-form": "^7.49.2",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.4",
    "axios": "^1.6.5",
    "recharts": "^2.10.3",
    "socket.io-client": "^4.6.1",
    "better-auth": "^1.0.0",
    "react-dropzone": "^14.2.3",
    "sonner": "^1.4.0",
    "lucide-react": "^0.309.0",
    "react-hot-toast": "^2.4.1",
    "date-fns": "^3.2.0",
    "slugify": "^1.6.6"
  }
}
```
