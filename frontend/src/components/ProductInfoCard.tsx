import { Calendar, User } from 'lucide-react';
import { useInspectionStore } from '../store/useInspectionStore';
import { useAuthStore } from '../store/useAuthStore';

export default function ProductInfoCard() {
  const activeProduct = useInspectionStore((state) => state.activeProduct);
  const { username } = useAuthStore();

  if (!activeProduct) {
    return (
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-3">Product Information</h2>
        <div className="text-gray-500 text-sm">No product scanned. Please go back to dashboard and scan a QR code.</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mb-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-3">Product Information (Thông tin chung)</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div>
          <span className="block text-xs text-gray-500 mb-1">Record Code (Mã bản ghi)</span>
          <span className="font-semibold text-gray-900 text-sm">{activeProduct.recordCode || `IQC-${activeProduct.id}`}</span>
        </div>
        <div>
          <span className="block text-xs text-gray-500 mb-1">Part Code (Project)</span>
          <span className="font-semibold text-gray-900 text-sm">{activeProduct.partNumber || 'N/A'}</span>
        </div>
        <div>
          <span className="block text-xs text-gray-500 mb-1">Drawing Code</span>
          <span className="font-semibold text-gray-900 text-sm">{activeProduct.drawingCode || 'N/A'}</span>
        </div>
        <div>
          <span className="block text-xs text-gray-500 mb-1">Manufacturer</span>
          <span className="font-semibold text-gray-900 text-sm">{activeProduct.manufacturer || 'N/A'}</span>
        </div>
        
        <div>
          <span className="block text-xs text-gray-500 mb-1">Lot Number</span>
          <span className="font-semibold text-gray-900 text-sm">{activeProduct.lotNumber || 'N/A'}</span>
        </div>
        <div>
          <span className="block text-xs text-gray-500 mb-1">Quantity/Rev</span>
          <span className="font-semibold text-gray-900 text-sm">{activeProduct.quantity || 'N/A'}</span>
        </div>
        <div>
          <span className="block text-xs text-gray-500 mb-1">Target Date</span>
          <span className="font-semibold text-gray-900 text-sm">{activeProduct.targetDate || 'N/A'}</span>
        </div>
        <div>
          <span className="block text-xs text-gray-500 mb-1">Status Note</span>
          <span className="inline-block px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded">{activeProduct.statusNote || 'Pending'}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
        <div className="flex-1 min-w-[150px]">
          <span className="block text-xs text-gray-500 mb-1">Inspector (Người kiểm tra)</span>
          <div className="flex items-center gap-2 bg-white px-3 py-2 border rounded-md">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium">{username || 'Unknown'}</span>
          </div>
        </div>
        <div className="flex-1 min-w-[150px]">
          <span className="block text-xs text-gray-500 mb-1">Inspection Date</span>
          <div className="flex items-center gap-2 bg-white px-3 py-2 border rounded-md">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium">{new Date().toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex-1 min-w-[150px]">
          <span className="block text-xs text-gray-500 mb-1">Feedback Deadline</span>
          <div className="flex items-center gap-2 bg-white px-3 py-2 border rounded-md">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium">N/A</span>
          </div>
        </div>
      </div>
    </div>
  );
}
