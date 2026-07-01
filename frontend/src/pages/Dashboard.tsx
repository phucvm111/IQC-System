import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRScanner from '../components/QRScanner';
import { scanProductQR } from '../services/api';
import { useInspectionStore } from '../store/useInspectionStore';

export default function Dashboard() {
  const navigate = useNavigate();
  const [scannedProductStr, setScannedProductStr] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const setActiveProduct = useInspectionStore((state) => state.setActiveProduct);

  const handleScanSuccess = async (decodedText: string) => {
    try {
      setIsScanning(true);
      // Call backend API
      const product = await scanProductQR(decodedText);
      
      // Update store
      setActiveProduct(product);
      
      // Show success briefly
      setScannedProductStr(product.partNumber);
    } catch (error) {
      alert("Failed to process QR Code via API. Check console.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">IQC Dashboard</h1>
            <p className="text-gray-500 mt-1">Incoming Quality Control System</p>
          </div>
          <div className="px-4 py-2 bg-primary/10 text-primary font-medium rounded-lg">
            Inspector Mode
          </div>
        </header>

        <main>
          {!scannedProductStr ? (
            <div className="flex flex-col items-center mt-12 animate-in fade-in zoom-in duration-300">
              {isScanning ? (
                 <div className="text-gray-500 font-medium py-10">Processing QR Data...</div>
              ) : (
                 <QRScanner onScanSuccess={handleScanSuccess} />
              )}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-success/20 text-success flex items-center justify-center">✓</span>
                Product Identified
              </h2>
              <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Scanned QR Data</p>
                  <p className="text-lg font-semibold text-gray-900">{scannedProductStr}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Status</p>
                  <p className="text-lg font-semibold text-success">Ready for Inspection</p>
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-4">
                <button 
                  onClick={() => setScannedProductStr(null)}
                  className="px-6 py-2.5 rounded-lg font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Scan Another
                </button>
                <button 
                  onClick={() => navigate('/inspection')}
                  className="px-6 py-2.5 rounded-lg font-medium text-white bg-primary hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5"
                >
                  Start Inspection
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
