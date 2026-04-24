import React from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

interface Surplus {
  id: number;
  title: string;
  quantity: string;
  expiry: string;
  status: "available" | "reserved" | "completed";
  requests: number;
}

interface SurplusListProps {
  surpluses: Surplus[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onView?: (id: number) => void;
}

const SurplusList: React.FC<SurplusListProps> = ({ surpluses, onEdit, onDelete, onView }) => {
  const getStatusClass = (status: string) => {
    switch (status) {
      case "available": return "bg-emerald-100 text-emerald-700";
      case "reserved": return "bg-amber-100 text-amber-700";
      case "completed": return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "available": return "Available";
      case "reserved": return "Reserved";
      case "completed": return "Completed";
      default: return status;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[2fr,1fr,1fr,1fr,0.8fr,1fr] bg-gray-50 px-5 py-3 text-gray-600 font-semibold text-sm border-b border-gray-200">
        <div>Title</div>
        <div>Quantity</div>
        <div>Expiry Date</div>
        <div>Status</div>
        <div className="text-center">Requests</div>
        <div className="text-center">Actions</div>
      </div>

      {/* Rows */}
      {surpluses.map((surplus) => (
        <div key={surplus.id} className="grid grid-cols-[2fr,1fr,1fr,1fr,0.8fr,1fr] px-5 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors items-center">
          <div className="text-gray-800 font-medium text-sm">{surplus.title}</div>
          <div className="text-gray-600 text-sm">{surplus.quantity}</div>
          <div className="text-gray-600 text-sm">{surplus.expiry}</div>
          <div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(surplus.status)}`}>
              {getStatusText(surplus.status)}
            </span>
          </div>
          <div className="text-center">
            {surplus.requests > 0 ? (
              <span className="inline-flex items-center justify-center w-6 h-6 bg-primary-500 text-white rounded-full text-xs font-bold">
                {surplus.requests}
              </span>
            ) : "-"}
          </div>
          <div className="flex items-center justify-center gap-2">
            <button onClick={() => onView?.(surplus.id)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center">
              <FaEye size={14} />
            </button>
            <button onClick={() => onEdit?.(surplus.id)} className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center">
              <FaEdit size={14} />
            </button>
            <button onClick={() => onDelete?.(surplus.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center">
              <FaTrash size={14} />
            </button>
          </div>
        </div>
      ))}

      {/* Empty State */}
      {surpluses.length === 0 && (
        <div className="py-12 text-center">
          <i className="fas fa-box-open text-4xl text-gray-300 mb-3 block"></i>
          <p className="text-gray-500">No surplus items found</p>
        </div>
      )}
    </div>
  );
};

export default SurplusList;