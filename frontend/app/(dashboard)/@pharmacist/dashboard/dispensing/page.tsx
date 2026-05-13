import DispensingTable from "@/components/pharmacist/dispensing/DispensingTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dispensing Log | MediFlow",
  description:
    "Record every medicine dispensed and maintain a clinical history.",
};

export default function DispensingPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header aligned with your PRD Screenshot */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Dispensing Log
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Record every medicine dispensed and maintain a clinical history.
        </p>
      </div>

      {/* Interactive Client Component */}
      <DispensingTable />
    </div>
  );
}
