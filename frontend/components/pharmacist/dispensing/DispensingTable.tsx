"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Trash2,
  Calendar,
  FileText,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  DispensingService,
  DispensingLog,
} from "@/services/dispensing.service";
import NewDispenseModal from "./NewDispenseModal";
// Assuming you have the modal we built earlier. If not, just comment this import out.

export default function DispensingTable() {
  const [logs, setLogs] = useState<DispensingLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const response = await DispensingService.getDispensingLogs({
        page,
        limit: 10,
        search,
        startDate,
        endDate,
      });
      setLogs(response.data);
      setTotalPages(response.meta.totalPages);
    } catch (error) {
      toast.error("Failed to load dispensing logs");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset page when search or dates change
  useEffect(() => {
    setPage(1);
  }, [search, startDate, endDate]);

  // Debounced fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLogs();
    }, 500);
    return () => clearTimeout(timer);
  }, [search, page, startDate, endDate]);

  const handleDelete = (id: string) => {
    toast.error("Delete Dispensing Record", {
      description: "Are you sure? This will permanently remove this clinical log.",
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await DispensingService.deleteDispensingLog(id);
            toast.success("Record deleted successfully");
            fetchLogs();
          } catch (error) {
            toast.error("Failed to delete record");
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
      {/* Table Toolbar */}
      <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by drug name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-shadow"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1">
            <Calendar size={14} className="text-gray-400" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent border-none text-xs focus:ring-0 p-1"
            />
            <span className="text-gray-400 text-xs">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent border-none text-xs focus:ring-0 p-1"
            />
            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                }}
                className="text-xs text-red-500 hover:text-red-700 ml-1"
              >
                Clear
              </button>
            )}
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#0EA5E9] hover:bg-[#0284c7] text-white rounded-xl transition-colors text-sm font-medium shadow-sm"
          >
            <Plus size={16} />
            Record Dispensing
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="px-6 py-4">Drug Info</th>
              <th className="px-6 py-4">Quantity</th>
              <th className="px-6 py-4 hidden md:table-cell">Patient Name</th>
              <th className="px-6 py-4 hidden lg:table-cell">Pharmacist</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              [...Array(5)].map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-1.5"></div>
                    <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-5 bg-gray-200 rounded-full w-16"></div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-20 mb-1.5"></div>
                    <div className="h-3 bg-gray-100 rounded w-12"></div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="h-8 w-8 bg-gray-200 rounded-lg ml-auto"></div>
                  </td>
                </tr>
              ))
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="bg-sky-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="text-sky-500 h-6 w-6" />
                  </div>
                  <h3 className="text-gray-900 font-medium">
                    No dispensing records found
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    Record a new dispensing event to see it here.
                  </p>
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{log.drug.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {log.drug.category}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {log.quantityDispensed} units
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    {log.patientName ? (
                      <span className="text-gray-700">{log.patientName}</span>
                    ) : (
                      <span className="text-gray-400 italic">Not provided</span>
                    )}
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    {log.pharmacist.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-gray-700">
                      {new Date(log.dispensedAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(log.dispensedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(log.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Record"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!isLoading && logs.length > 0 && (
        <div className="p-4 border-t border-gray-100 bg-white flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing page{" "}
            <span className="font-medium text-gray-900">{page}</span> of{" "}
            <span className="font-medium text-gray-900">{totalPages}</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 border border-gray-200 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 border border-gray-200 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Include your existing Modal */}
      <NewDispenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchLogs}
      />
    </div>
  );
}
