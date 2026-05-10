"use client";

import { useState } from "react";
import { toast } from "sonner";
import { NewsletterService } from "@/services/newsletter.service";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// FAQ Content mapping to your PRD and mockup
const faqs = [
  {
    question: "Is MediFlow HIPAA compliant?",
    answer:
      "Yes. All data is encrypted at rest and in transit. Our infrastructure is fully compliant with HIPAA, GDPR, and global healthcare data protection regulations.",
  },
  {
    question: "How often is the drug database updated?",
    answer:
      "Our master drug catalogue is synced weekly with global pharmaceutical registries to ensure interaction checks and safety data are always accurate.",
  },
  {
    question: "Can it integrate with existing hospital EMRs?",
    answer:
      "MediFlow offers RESTful APIs and HL7 integration capabilities for enterprise clients to sync dispensing logs with existing Electronic Medical Records.",
  },
  {
    question: "Does the AI train on our patient data?",
    answer:
      "No. Patient names and PII are stripped before any data interacts with the LLM. The AI operates strictly on generalized pharmaceutical data.",
  },
];

export function FAQNewsletterSection() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      // Calling the abstracted service layer
      await NewsletterService.subscribe(email);

      toast.success("Successfully subscribed to clinical updates!");
      setEmail("");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 bg-muted/30 border-t border-border/40">
      <div className="container mx-auto px-6 md:px-16 lg:px-24">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left Column: FAQ Accordion */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-8">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="border-b-border/50"
                >
                  <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Right Column: Interactive Newsletter Box */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 md:p-10 shadow-lg relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/20 rounded-full blur-[60px] pointer-events-none" />

            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-foreground mb-3">
                Stay Updated
              </h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-8">
                Get the latest clinical insights, FDA alerts, and product
                updates delivered to your inbox every month.
              </p>

              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Input
                  type="email"
                  placeholder="professional@clinic.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background border-border/50 h-12 focus-visible:ring-primary flex-1"
                  required
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-12 px-8 font-semibold shadow-md transition-all hover:shadow-lg rounded-xl"
                >
                  {isLoading ? "Subscribing..." : "Subscribe"}
                </Button>
              </form>

              <p className="text-xs text-muted-foreground mt-4">
                By subscribing, you agree to our Privacy Policy and clinical
                data handling terms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
