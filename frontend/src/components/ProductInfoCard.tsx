import { Calendar, User, Package, FileText, Factory, Clock, AlertCircle } from 'lucide-react';
import { useInspectionStore } from '../store/useInspectionStore';
import { useAuthStore } from '../store/useAuthStore';

export default function ProductInfoCard() {
  const activeProduct = useInspectionStore((state) => state.activeProduct);
  const { username } = useAuthStore();

  if (!activeProduct) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col items-center justify-center text-center py-12">
        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">No Product Scanned</h2>
        <p className="text-slate-500 max-w-sm">Please go back to the dashboard and scan a QR code to begin the inspection process.</p>
      </div>
    );
  }

  const InfoItem = ({ icon: Icon, label, value, badge = false, badgeColor = 'blue' }: any) => (
    <div className="flex flex-col group p-3 rounded-xl hover:bg-slate-50 transition-colors">
      <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-1.5">
        <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors" />
        {label}
      </span>
      {badge ? (
        <div>
          <span className={`inline-flex px-2.5 py-1 bg-${badgeColor}-100 text-${badgeColor}-700 text-xs font-bold rounded-md border border-${badgeColor}-200`}>
            {value}
          </span>
        </div>
      ) : (
        <span className="font-semibold text-slate-900 text-sm">{value}</span>
      )}
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgb(0,0,0,0.02)] mb-6 transition-all">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <Package className="w-4 h-4" />
          </div>
          Product Information
        </h2>
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">IQC Document</span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
        <InfoItem icon={FileText} label="Record Code" value={activeProduct.recordCode || `IQC-${activeProduct.id}`} />
        <InfoItem icon={Package} label="Part Code" value={activeProduct.partNumber || 'N/A'} />
        <InfoItem icon={FileText} label="Drawing Code" value={activeProduct.drawingCode || 'N/A'} />
        <InfoItem icon={Factory} label="Manufacturer" value={activeProduct.manufacturer || 'N/A'} />
        
        <InfoItem icon={FileText} label="Lot Number" value={activeProduct.lotNumber || 'N/A'} />
        <InfoItem icon={Package} label="Quantity/Rev" value={activeProduct.quantity || 'N/A'} badge={true} badgeColor="indigo" />
        <InfoItem icon={Calendar} label="Target Date" value={activeProduct.targetDate || 'N/A'} />
        <InfoItem icon={AlertCircle} label="Status Note" value={activeProduct.statusNote || 'Pending'} badge={true} badgeColor="orange" />
      </div>

      <div className="flex flex-wrap gap-4 p-5 bg-slate-50/80 backdrop-blur-sm rounded-xl border border-slate-100">
        <div className="flex-1 min-w-[150px]">
          <span className="block text-xs font-medium text-slate-500 mb-2">Inspector</span>
          <div className="flex items-center gap-3 bg-white px-4 py-2.5 border border-slate-200 rounded-lg shadow-sm">
            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-bold text-slate-700">{username || 'Unknown'}</span>
          </div>
        </div>
        <div className="flex-1 min-w-[150px]">
          <span className="block text-xs font-medium text-slate-500 mb-2">Inspection Date</span>
          <div className="flex items-center gap-3 bg-white px-4 py-2.5 border border-slate-200 rounded-lg shadow-sm">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-700">{new Date().toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex-1 min-w-[150px]">
          <span className="block text-xs font-medium text-slate-500 mb-2">Feedback Deadline</span>
          <div className="flex items-center gap-3 bg-white px-4 py-2.5 border border-slate-200 rounded-lg shadow-sm opacity-60">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-700">N/A</span>
          </div>
        </div>
      </div>
    </div>
  );
}
