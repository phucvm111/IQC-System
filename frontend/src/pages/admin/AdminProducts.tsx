import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProducts, uploadProductStep } from '../../services/api';
import type { Product } from '../../store/useInspectionStore';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    }
  };

  const handleFileUpload = async (id: number, file: File) => {
    setUploadingId(id);
    try {
      await uploadProductStep(id, file);
      alert('File uploaded successfully');
      fetchProducts();
    } catch (error) {
      alert('Upload failed');
    } finally {
      setUploadingId(null);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredProducts = products.filter(p => {
    const textMatch = p.partNumber.toLowerCase().includes(search.toLowerCase()) || 
      (p.drawingCode && p.drawingCode.toLowerCase().includes(search.toLowerCase())) ||
      (p.targetDate && p.targetDate.toLowerCase().includes(search.toLowerCase())) ||
      (p.recordCode && p.recordCode.toLowerCase().includes(search.toLowerCase()));
      
    if (!searchDate) return textMatch;
    
    // Check if dates match. Date from input is YYYY-MM-DD.
    const searchD = new Date(searchDate);
    
    // Check targetDate (Ngày nhập kho)
    let targetMatch = false;
    try {
      if (p.targetDate) {
        const target = new Date(p.targetDate);
        targetMatch = target.getFullYear() === searchD.getFullYear() && 
                      target.getMonth() === searchD.getMonth() && 
                      target.getDate() === searchD.getDate();
      }
    } catch {}

    // Check recordCode (Ngày kiểm tra)
    let recordMatch = false;
    try {
      if (p.recordCode) {
        let recD: Date | null = null;
        if (p.recordCode.startsWith('IQC235') && p.recordCode.length >= 14) {
          recD = new Date(`${p.recordCode.substring(10, 14)}-${p.recordCode.substring(8, 10)}-${p.recordCode.substring(6, 8)}`);
        } else if (p.recordCode.startsWith('IQC') && p.recordCode.length >= 13) {
          recD = new Date(`20${p.recordCode.substring(3, 5)}-${p.recordCode.substring(5, 7)}-${p.recordCode.substring(7, 9)}`);
        }
        if (recD && !isNaN(recD.getTime())) {
          recordMatch = recD.getFullYear() === searchD.getFullYear() && 
                        recD.getMonth() === searchD.getMonth() && 
                        recD.getDate() === searchD.getDate();
        }
      }
    } catch {}

    return textMatch && (targetMatch || recordMatch);
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Product Management</h2>
      <div className="mb-6 flex gap-4 flex-wrap">
        <input 
          type="text" 
          placeholder="Search by Part Number, Drawing Code or Date (e.g. 16/Jun)..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2 border rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Exact Date:</label>
          <input 
            type="date"
            min="2000-01-01"
            max="2099-12-31"
            value={searchDate}
            onChange={e => setSearchDate(e.target.value)}
            className="px-4 py-2 border rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {searchDate && (
            <button 
              onClick={() => setSearchDate('')}
              className="px-2 py-1 text-sm text-red-600 hover:text-red-800"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Drawing Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload .step</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map(product => (
              <React.Fragment key={product.id}>
                <tr className={expandedId === product.id ? 'bg-blue-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.partNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.drawingCode || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.statusNote === 'Pass' ? 'bg-green-100 text-green-800' :
                      product.statusNote === 'Reject' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {product.statusNote || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <label className="cursor-pointer bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100">
                      {uploadingId === product.id ? 'Uploading...' : 'Upload'}
                      <input 
                        type="file" 
                        accept=".glb,.gltf" 
                        className="hidden" 
                        onChange={e => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileUpload(product.id, e.target.files[0]);
                          }
                        }}
                        disabled={uploadingId === product.id}
                      />
                    </label>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-4">
                    <button 
                      onClick={() => toggleExpand(product.id)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      {expandedId === product.id ? 'Hide Details' : 'Details'}
                    </button>
                    <button 
                      onClick={() => navigate(`/admin/products/${product.id}/print`)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Print PDF
                    </button>
                  </td>
                </tr>
                {expandedId === product.id && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <span className="block text-xs text-gray-500">Manufacturer</span>
                          <span className="text-sm font-medium">{product.manufacturer || '-'}</span>
                        </div>
                        <div>
                          <span className="block text-xs text-gray-500">Lot Number</span>
                          <span className="text-sm font-medium">{product.lotNumber || '-'}</span>
                        </div>
                        <div>
                          <span className="block text-xs text-gray-500">Quantity</span>
                          <span className="text-sm font-medium">{product.quantity || '-'}</span>
                        </div>
                        <div>
                          <span className="block text-xs text-gray-500">Record Code</span>
                          <span className="text-sm font-medium">{product.recordCode || '-'}</span>
                        </div>
                        <div>
                          <span className="block text-xs text-gray-500">Target Date</span>
                          <span className="text-sm font-medium">{product.targetDate || '-'}</span>
                        </div>
                        <div>
                          <span className="block text-xs text-gray-500">Inspector</span>
                          <span className="text-sm font-medium">{product.inspectorName || '-'}</span>
                        </div>
                        <div className="col-span-1">
                          <span className="block text-xs text-gray-500">Description</span>
                          <span className="text-sm font-medium">{product.description || '-'}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="block text-xs text-gray-500">Tolerance Config</span>
                          <span className="text-sm font-medium">{product.toleranceConfig || '-'}</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
