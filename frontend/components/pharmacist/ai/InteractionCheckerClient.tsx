"use client";

import { useState, KeyboardEvent, useEffect } from "react";
import {
  ShieldCheck,
  X,
  Loader2,
  AlertTriangle,
  Info,
  Asterisk,
  Bot,
  ArrowRight,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";
import { AiService, InteractionResult } from "@/services/ai.service";
import { DrugService } from "@/services/drug.service";

export default function InteractionCheckerClient() {
  const [inputValue, setInputValue] = useState("");
  const [drugs, setDrugs] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<InteractionResult | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    AiService.getInteractionHistory().then(setHistory);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!inputValue.trim()) {
        setSuggestions([]);
        return;
      }
      setIsSearching(true);
      try {
        const res = await DrugService.getDrugs({ search: inputValue.trim(), limit: 5 });
        setSuggestions(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsSearching(false);
      }
    };

    const delay = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delay);
  }, [inputValue]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = inputValue.trim();
      if (val && !drugs.includes(val)) {
        if (drugs.length >= 5) {
          toast.error("Maximum 5 drugs allowed per check.");
          return;
        }
        setDrugs([...drugs, val]);
        setInputValue("");
        setShowSuggestions(false);
        setResult(null); // Reset results when drugs change
      }
    } else if (e.key === "Backspace" && !inputValue && drugs.length > 0) {
      setDrugs(drugs.slice(0, -1));
      setResult(null);
    }
  };

  const removeDrug = (indexToRemove: number) => {
    setDrugs(drugs.filter((_, index) => index !== indexToRemove));
    setResult(null);
  };

  const addDrugFromSuggestion = (drugName: string) => {
    if (drugs.includes(drugName)) {
      toast.error("Medication already added.");
      return;
    }
    if (drugs.length >= 5) {
      toast.error("Maximum 5 drugs allowed per check.");
      return;
    }
    setDrugs([...drugs, drugName]);
    setInputValue("");
    setShowSuggestions(false);
    setResult(null);
  };

  const handleCheck = async () => {
    if (drugs.length < 2) {
      toast.error("Please enter at least 2 medications to compare.");
      return;
    }
    setIsChecking(true);
    try {
      const data = await AiService.checkInteractions(drugs);
      setResult(data);
      toast.success("Analysis complete");
    } catch (error) {
      toast.error("Failed to analyze interactions.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Interaction Checker
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Analyze potential drug-to-drug interactions with clinical precision.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#0EA5E9] hover:bg-[#0284c7] text-white rounded-xl transition-colors text-sm font-medium shadow-sm">
          <Plus size={16} />
          New Patient Profile
        </button>
      </div>

      {/* Input Section */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <label className="block text-sm font-bold text-gray-900 mb-3">
          Enter Medications to Compare
        </label>

        {/* Custom Tag Input */}
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2 w-full p-2.5 bg-white border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-sky-500 transition-shadow min-h-[52px]">
            {drugs.map((drug, index) => (
            <span
              key={index}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-100 text-sky-800 text-sm font-medium rounded-lg"
            >
              {drug}
              <button
                onClick={() => removeDrug(index)}
                className="text-sky-600 hover:text-sky-900 focus:outline-none"
              >
                <X size={14} />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder={
              drugs.length === 0
                ? "Type drug name and press Enter..."
                : "Add medication..."
            }
            className="flex-1 min-w-[150px] bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 py-1"
          />
          </div>

          {/* Autocomplete Suggestions */}
          {showSuggestions && (inputValue.trim().length > 0) && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
              {isSearching ? (
                <div className="p-3 text-sm text-gray-500 flex items-center justify-center">
                  <Loader2 size={16} className="animate-spin mr-2" /> Searching...
                </div>
              ) : suggestions.length > 0 ? (
                <ul className="py-1">
                  {suggestions.map((sugg) => (
                    <li
                      key={sugg.id}
                      onClick={() => addDrugFromSuggestion(sugg.name)}
                      className="px-4 py-2 hover:bg-sky-50 cursor-pointer text-sm text-gray-700 transition-colors"
                    >
                      <div className="font-medium text-gray-900">{sugg.name}</div>
                      <div className="text-xs text-gray-500">{sugg.genericName} • {sugg.category}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-3 text-sm text-gray-500 text-center">
                  No medications found. Press Enter to add "{inputValue}" anyway.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleCheck}
            disabled={isChecking || drugs.length < 2}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-xl transition-colors text-sm font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isChecking ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Analyzing AI...
              </>
            ) : (
              <>
                <ShieldCheck size={18} />
                Check Interactions
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              Analysis Results
            </h2>
            {result.overall_risk === "DANGEROUS" && (
              <span className="flex items-center gap-1.5 px-4 py-1.5 bg-red-100 text-red-700 font-bold text-sm rounded-lg border border-red-200">
                <AlertTriangle size={16} />
                HIGH RISK IDENTIFIED
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Interaction Pairs */}
            <div className="lg:col-span-2 space-y-4">
              {result.pairs.map((pair, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className={`p-2 rounded-lg mt-0.5 ${pair.severity === "DANGEROUS" ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-500"}`}
                    >
                      {pair.severity === "DANGEROUS" ? (
                        <Asterisk size={20} />
                      ) : (
                        <Info size={20} />
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900">
                        {pair.drug_a} + {pair.drug_b}
                      </h3>
                      <p
                        className={`text-xs font-bold uppercase tracking-wider ${pair.severity === "DANGEROUS" ? "text-red-600" : "text-amber-600"}`}
                      >
                        {pair.severity === "DANGEROUS"
                          ? "Major Interaction"
                          : "Moderate Interaction"}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    <span className="font-semibold text-gray-900">
                      Explanation:{" "}
                    </span>
                    {pair.reason}
                  </p>

                  <div className="bg-gray-50 border-l-4 border-gray-300 p-4 rounded-r-xl">
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      Clinical Recommendation:
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {pair.recommendation}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: AI Insight & Drug Properties */}
            <div className="space-y-6">
              {/* AI Clinical Insight */}
              <div className="bg-white border border-[#0EA5E9]/30 rounded-xl p-5 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#0EA5E9]"></div>
                <div className="flex items-center gap-2 mb-4">
                  <Bot size={20} className="text-[#0EA5E9]" />
                  <h3 className="text-base font-bold text-[#0EA5E9]">
                    MediFlow Intelligence
                  </h3>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  {result.ai_insight || result.summary || "AI analysis based on provided medical profile."}
                </p>
                <button className="mt-4 text-sm font-medium text-sky-600 hover:text-sky-700 flex items-center gap-1 transition-colors">
                  View full AI analysis <ArrowRight size={14} />
                </button>
              </div>

              {/* Drug Properties */}
              {result.drug_properties && result.drug_properties.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <h3 className="text-base font-bold text-gray-900 mb-4">
                    Drug Properties
                  </h3>
                  <div className="space-y-3">
                    {result.drug_properties.map((prop, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0 last:pb-0"
                      >
                        <span className="text-sm text-gray-600">{prop.name}</span>
                        <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-md">
                          {prop.class}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* History Table Section */}
      <div className="pt-4">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            Recent Check History
          </h2>
          <button className="text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors">
            View Archives
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-100 text-gray-700 font-bold uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4 border-b border-gray-200">
                  Date & Time
                </th>
                <th className="px-6 py-4 border-b border-gray-200">
                  Drugs Analyzed
                </th>
                <th className="px-6 py-4 border-b border-gray-200">
                  Max Risk Level
                </th>
                <th className="px-6 py-4 border-b border-gray-200">Status</th>
                <th className="px-6 py-4 border-b border-gray-200 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {history.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {item.date}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    {item.drugs}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                        item.maxRisk === "DANGEROUS"
                          ? "bg-red-100 text-red-700"
                          : item.maxRisk === "MODERATE"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {item.maxRisk === "DANGEROUS"
                        ? "MAJOR"
                        : item.maxRisk === "MODERATE"
                          ? "MODERATE"
                          : "MINOR"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${item.status === "Reviewed" ? "bg-emerald-500" : "bg-amber-500"}`}
                      ></span>
                      <span className="text-gray-600 text-sm">
                        {item.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sky-600 hover:text-sky-800 text-sm font-medium transition-colors">
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
