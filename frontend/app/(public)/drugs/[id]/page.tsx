import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { DrugService } from "@/services/drug.service";
import { DrugDetailView } from "@/components/drugs/DrugDetailView";
import { RelatedDrugs } from "@/components/drugs/RelatedDrugs";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const drug = await DrugService.getDrugById(id);
  
  if (!drug) return { title: "Drug Not Found | MediFlow" };
  
  return {
    title: `${drug.name} (${drug.genericName}) | MediFlow`,
    description: drug.description || `Clinical information for ${drug.name}. View side effects, dosage, and interactions.`,
  };
}

export default async function DrugDetailPage({ params }: Props) {
  const { id } = await params;
  
  // Fetch drug and reviews in parallel
  const [drug, reviews] = await Promise.all([
    DrugService.getDrugById(id),
    DrugService.getDrugReviews(id)
  ]);

  if (!drug) notFound();

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header / Breadcrumb */}
      <div className="pt-28 md:pt-32 pb-6 border-b border-border/40">
        <div className="container mx-auto px-6 md:px-16 lg:px-24">
          <Link 
            href="/drugs" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors mb-4 group"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Drug Search
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 md:px-16 lg:px-24 py-10">
        <DrugDetailView drug={drug} reviews={reviews} />
        
        {/* Related Section */}
        <RelatedDrugs category={drug.category} currentDrugId={drug.id} />
      </main>
    </div>
  );
}
