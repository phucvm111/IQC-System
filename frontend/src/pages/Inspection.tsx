import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModelViewer from '../components/ModelViewer';
import ProductInfoCard from '../components/ProductInfoCard';
import MeasurementTable from '../components/MeasurementTable';
import { useInspectionStore } from '../store/useInspectionStore';
import { useAuthStore } from '../store/useAuthStore';
import { updateProductStatus } from '../services/api';
import { Box, User, Clock, Check, X, Bookmark, FileStack } from 'lucide-react';

export default function Inspection() {
  const navigate = useNavigate();
  const [activeModel, setActiveModel] = useState<string>('/model1.glb');
  const { activeProduct, setActiveProduct } = useInspectionStore();
  const { username } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStatusUpdate = async (status: string) => {
    if (!activeProduct) return;
    setIsSubmitting(true);
    try {
      await updateProductStatus(activeProduct.id, status, username || 'Unknown');
      setActiveProduct(null);
      
      if (status === 'Pass') {
        alert('Inspection Passed! Data submitted to Server.');
        navigate('/dashboard');
      } else {
        navigate('/defect-report');
      }
    } catch (error) {
      alert('Failed to update status. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Premium Header */}
      <header className="glass-dark px-8 py-4 flex items-center justify-between z-30 shrink-0 sticky top-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <FileStack className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-wide">
                IQC <span className="font-light text-slate-300">Inspection</span>
              </h1>
            </div>
          </div>
          
          <div className="h-8 w-px bg-slate-700 mx-2"></div>
          
          <div className="flex items-center gap-3 bg-slate-800/50 px-4 py-1.5 rounded-full border border-slate-700/50">
            <span className="text-sm text-slate-400">Part:</span>
            <span className="text-sm font-bold text-white tracking-wider bg-slate-700 px-2.5 py-0.5 rounded">
              {activeProduct ? activeProduct.partNumber : 'NONE'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700/50">
            <User className="w-4 h-4 text-blue-400" />
            Inspector: <strong className="text-white ml-1">{username}</strong>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 flex flex-col lg:flex-row gap-6 overflow-hidden relative z-10">
        
        {/* Left Column: Data Entry (55%) */}
        <div className="w-full lg:w-[55%] flex flex-col h-full overflow-y-auto pr-2 pb-24 scrollbar-hide">
          <ProductInfoCard />
          <MeasurementTable numDims={5} quantity={activeProduct?.quantity} />
        </div>

        {/* Right Column: 3D Viewer (45%) */}
        <div className="w-full lg:w-[45%] flex flex-col h-full pb-24">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl flex-1 flex flex-col overflow-hidden relative group">
            
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-slate-800/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700/50">
              <Box className="w-4 h-4 text-blue-400" />
              <h3 className="font-bold text-sm text-slate-200">
                Reference 3D Model
              </h3>
              <div className="ml-2 pl-2 border-l border-slate-600 text-xs text-slate-400 font-mono">Rev: A.02</div>
            </div>

            <div className="flex-1 relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
              {activeProduct?.drawingCode ? (
                <ModelViewer modelUrl={`/drawings/${activeProduct.drawingCode}`} />
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full text-slate-500">
                  <Box className="w-16 h-16 mb-4 opacity-20" />
                  <p className="font-medium text-slate-400">No 3D Model Uploaded</p>
                </div>
              )}
            </div>
            
            {/* Subtle overlay gradient at the bottom of the viewer */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-900/80 to-transparent pointer-events-none"></div>
          </div>
        </div>
      </main>

      {/* Bottom Action Bar (Floating) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-slate-200/60 px-8 py-4 rounded-2xl flex items-center gap-8 z-40 shadow-[0_20px_40px_-10px_rgb(0,0,0,0.1)] transition-all">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Clock className="w-4 h-4" />
          Last saved: <span className="font-bold text-slate-700">Just now</span>
        </div>
        
        <div className="w-px h-8 bg-slate-200"></div>

        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all focus:ring-4 focus:ring-slate-100 flex items-center gap-2"
          >
            <Bookmark className="w-4 h-4" />
            Save Draft
          </button>
          
          <button 
            onClick={() => handleStatusUpdate('Reject')}
            disabled={isSubmitting || !activeProduct}
            className="px-6 py-3 text-sm font-bold text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 hover:border-red-300 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-4 focus:ring-red-100"
          >
            <X className="w-5 h-5" />
            Reject Batch
          </button>
          
          <button 
            onClick={() => handleStatusUpdate('Pass')}
            disabled={isSubmitting || !activeProduct}
            className="px-8 py-3 text-sm font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:ring-4 focus:ring-green-500/20"
          >
            <Check className="w-5 h-5" />
            Approve & Submit
          </button>
        </div>
      </div>
    </div>
  );
}
