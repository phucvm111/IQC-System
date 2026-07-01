import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUpload from '../components/ImageUpload';

export default function DefectReport() {
  const navigate = useNavigate();
  const [vendor, setVendor] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor || !description) return;
    
    setIsSubmitting(true);
    
    // Simulate API call to POST /api/defects
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    alert('Defect Ticket created successfully! Workflow Status: New');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Report Defect</h1>
          <p className="text-gray-500 mt-2">Log a new defect ticket and notify the vendor.</p>
        </header>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Vendor</label>
            <select 
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white"
              required
            >
              <option value="" disabled>Select a vendor to tag...</option>
              <option value="vendor-a">Vendor A (Global Parts Inc.)</option>
              <option value="vendor-b">Vendor B (MetalWorks Ltd.)</option>
              <option value="vendor-c">Vendor C (TechSupply Co.)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Defect Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              rows={4}
              placeholder="Describe the defect in detail..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Evidentiary Images/Videos</label>
            <ImageUpload onImagesChange={setImages} />
            <p className="text-xs text-gray-500 mt-2">Attached {images.length} files.</p>
          </div>

          <div className="pt-6 border-t border-gray-100 flex gap-4 justify-end">
            <button 
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting || !vendor || !description}
              className="px-8 py-3 rounded-xl font-bold text-white bg-danger hover:bg-red-600 shadow-md shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : 'Submit Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
