import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QRScanner from '../components/QRScanner';
import { scanProductQR, getInspectionHistory } from '../services/api';
import { useInspectionStore } from '../store/useInspectionStore';
import type { Product } from '../store/useInspectionStore';
import { useAuthStore } from '../store/useAuthStore';
import { Sparkles, CheckCircle2, QrCode, ArrowRight, Clock, FileText, User } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [scannedProductStr, setScannedProductStr] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const setActiveProduct = useInspectionStore((state) => state.setActiveProduct);
  const { username } = useAuthStore();
  const [todayProducts, setTodayProducts] = useState<Product[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (username) {
      fetchHistory();
    }
  }, [username, selectedDate]);

  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const products = await getInspectionHistory(username || '', selectedDate);
      setTodayProducts(products);
    } catch (error) {
      console.error('Failed to load history', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleScanSuccess = async (decodedText: string) => {
    try {
      setIsScanning(true);
      // Call backend API
      const product = await scanProductQR(decodedText);
      
      // Update store
      setActiveProduct(product);
      
      // Show success briefly
      setScannedProductStr(product.partNumber);
      fetchHistory();
    } catch (error) {
      alert("Failed to process QR Code via API. Check console.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 flex items-center justify-center p-6">
      {/* Dynamic Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/20 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="w-full max-w-4xl mx-auto z-10">
        <header className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span>Inspector Mode Active</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 mb-3">
            IQC <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Scan a product QR code to begin the incoming quality control inspection process.
          </p>
        </header>

        <main className="max-w-xl mx-auto">
          {!scannedProductStr ? (
            <div className="glass rounded-3xl p-8 flex flex-col items-center animate-in fade-in zoom-in duration-500">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <QrCode className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-8">Scan Product QR</h2>
              
              <div className="w-full rounded-2xl overflow-hidden border-2 border-dashed border-blue-200 bg-slate-50/50 p-2 relative transition-all hover:border-blue-400">
                {isScanning ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                    <div className="text-slate-600 font-medium">Processing QR Data...</div>
                  </div>
                ) : (
                  <div className="rounded-xl overflow-hidden shadow-sm">
                     <QRScanner onScanSuccess={handleScanSuccess} />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="glass rounded-3xl p-8 animate-in slide-in-from-bottom-8 duration-700">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 shadow-inner ring-8 ring-green-50">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Product Identified</h2>
                <p className="text-slate-500 mt-1">Ready for quality inspection</p>
              </div>

              <div className="bg-white/80 rounded-2xl p-6 border border-slate-100 shadow-sm mb-8 space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="text-sm font-medium text-slate-500">Scanned QR Data</span>
                  <span className="text-base font-bold text-slate-900">{scannedProductStr}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm font-medium text-slate-500">Current Status</span>
                  <span className="inline-flex px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">
                    Ready
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setScannedProductStr(null)}
                  className="flex-1 py-3.5 px-6 rounded-xl font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all focus:ring-4 focus:ring-slate-100"
                >
                  Scan Another
                </button>
                <button 
                  onClick={() => navigate('/inspection')}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1 focus:ring-4 focus:ring-blue-500/20"
                >
                  Start Inspection
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Today's Inspections History */}
        <div className="max-w-4xl mx-auto mt-16 animate-in fade-in duration-700 delay-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                <Clock className="w-4 h-4" />
              </div>
              Inspection History
            </h3>
            
            <div className="flex items-center gap-3">
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="bg-white px-3 py-1.5 rounded-lg text-sm font-bold text-slate-600 shadow-sm border border-slate-200">
                {todayProducts.length} items
              </span>
            </div>
          </div>

          {isLoadingHistory ? (
            <div className="flex justify-center p-8">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : todayProducts.length === 0 ? (
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-200 border-dashed p-8 text-center text-slate-500">
              No inspections found for this date.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {todayProducts.map(p => (
                <div 
                  key={p.id} 
                  onClick={() => {
                    setActiveProduct(p);
                    navigate('/inspection');
                  }}
                  className="bg-white rounded-xl p-5 border border-slate-200 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-lg transition-all cursor-pointer group hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{p.partNumber}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                      p.statusNote === 'Pass' ? 'bg-green-100 text-green-700' : 
                      p.statusNote === 'Reject' ? 'bg-red-100 text-red-700' : 
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {p.statusNote || 'Pending'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mb-1.5 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-slate-400"/> {p.recordCode}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-slate-400"/> {p.inspectorName || 'Draft'}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
