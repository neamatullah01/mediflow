import { AIShowcaseSection } from "@/components/landing/AIShowcaseSection";
import { BlogPreviewSection } from "@/components/landing/BlogPreviewSection";
import { CategoriesSection } from "@/components/landing/CategoriesSection";
import { FAQNewsletterSection } from "@/components/landing/FAQNewsletterSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <FeaturesSection></FeaturesSection>
      <CategoriesSection></CategoriesSection>
      <AIShowcaseSection></AIShowcaseSection>
      <TestimonialsSection />
      <BlogPreviewSection />
      <FAQNewsletterSection />
    </div>
  );
}
