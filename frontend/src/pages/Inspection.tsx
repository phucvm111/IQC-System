import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModelViewer from '../components/ModelViewer';
import ProductInfoCard from '../components/ProductInfoCard';
import MeasurementTable from '../components/MeasurementTable';
import { useInspectionStore } from '../store/useInspectionStore';
import { useAuthStore } from '../store/useAuthStore';
import { updateProductStatus } from '../services/api';

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b px-6 py-4 flex items-center justify-between z-10 shrink-0">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-3">
            Inspection Detail 
            <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-xs font-medium border">
              {activeProduct ? activeProduct.partNumber : 'No Product'}
            </span>
            <span className="text-sm font-normal text-gray-500 ml-4 border-l pl-4">
              Inspector: <strong className="text-gray-900">{username}</strong>
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <span className="px-4 py-1.5 text-sm font-medium rounded-md bg-white shadow-sm text-blue-600">
              Active Model
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 flex flex-col lg:flex-row gap-6 overflow-hidden">
        
        {/* Left Column: Data Entry (60%) */}
        <div className="w-full lg:w-[55%] flex flex-col h-full overflow-y-auto pr-2 pb-20">
          <ProductInfoCard />
          <MeasurementTable numDims={5} quantity={activeProduct?.quantity} />
        </div>

        {/* Right Column: 3D Viewer (40%) */}
        <div className="w-full lg:w-[45%] flex flex-col h-full pb-20">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex-1 flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-sm text-gray-700 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                Reference Drawing
              </h3>
              <div className="text-xs text-gray-500">Rev: A.02</div>
            </div>
            <div className="flex-1 relative">
              {activeProduct?.drawingCode ? (
                <ModelViewer modelUrl={`/drawings/${activeProduct.drawingCode}`} />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-100">
                  No 3D Model Uploaded
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-between items-center z-20 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)]">
        <div className="text-sm text-gray-500">
          Last saved: <span className="font-medium text-gray-700">Just now</span>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Save Draft
          </button>
          <button 
            onClick={() => handleStatusUpdate('Reject')}
            disabled={isSubmitting || !activeProduct}
            className="px-5 py-2.5 text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
            Reject Batch
          </button>
          <button 
            onClick={() => handleStatusUpdate('Pass')}
            disabled={isSubmitting || !activeProduct}
            className="px-6 py-2.5 text-sm font-bold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            Approve & Submit
          </button>
        </div>
      </div>
    </div>
  );
}
