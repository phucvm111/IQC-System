import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../services/api';
import type { Product } from '../store/useInspectionStore';

export default function PrintProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (id) {
      getProduct(parseInt(id, 10))
        .then(data => {
          setProduct(data);
          // Wait a bit for render then print
          setTimeout(() => {
            window.print();
          }, 500);
        })
        .catch(() => alert('Failed to load product'));
    }
  }, [id]);

  if (!product) {
    return <div className="p-8 text-center text-gray-500">Loading product report...</div>;
  }

  // Generate rows for measurement results based on quantity
  const qty = parseInt(product.quantity || '0', 10);
  const measurementRows = isNaN(qty) || qty <= 0 ? 12 : qty; // Default to 12 if invalid
  const rows = Array.from({ length: measurementRows }, (_, i) => measurementRows - i);

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto text-black font-sans text-sm" style={{ minHeight: '100vh' }}>
      {/* Hide this button when printing */}
      <button 
        onClick={() => navigate(-1)}
        className="print:hidden mb-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded shadow-sm"
      >
        &larr; Back
      </button>

      <div className="print:p-0">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="font-bold">QC-08-17-F-02-01</div>
            <div className="text-xs mt-1 leading-tight">
              1. Đo kiểm 100% nếu có dung sai riêng (Hi level)<br/>
              2. Kiểm tra hết kích thước có dung sai riêng (Nếu có thể)<br/>
              3. Không lưu giữ bản cứng khi đã có file scan
            </div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-700">{new Date().toLocaleDateString('en-GB', { weekday: 'short' }).toUpperCase()} | {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</div>
          </div>
          <div>
            {/* Placeholder for QR Code */}
            <div className="w-16 h-16 border border-gray-300 flex items-center justify-center text-[8px] text-gray-400">QR CODE</div>
          </div>
        </div>

        {/* General Info Section */}
        <div className="mb-6">
          <h2 className="font-bold text-base mb-1">Thông tin chung</h2>
          <table className="w-full border-collapse border border-black text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black px-2 py-1 w-12 text-left font-bold">No.</th>
                <th className="border border-black px-2 py-1 w-1/3 text-left font-bold">Thông tin</th>
                <th className="border border-black px-2 py-1 text-left font-bold">Nội dung</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-black px-2 py-1 text-center">01</td><td className="border border-black px-2 py-1">Mã bản ghi</td><td className="border border-black px-2 py-1 font-medium">{product.recordCode || `IQC235${new Date().toLocaleDateString('en-GB').replace(/\//g, '')}${new Date().toLocaleTimeString('en-GB', {hour12: false}).replace(/:/g, '')}`}</td></tr>
              <tr><td className="border border-black px-2 py-1 text-center">02</td><td className="border border-black px-2 py-1">Mã đơn hàng</td><td className="border border-black px-2 py-1">N/A</td></tr>
              <tr><td className="border border-black px-2 py-1 text-center">03</td><td className="border border-black px-2 py-1">Mã hàng</td><td className="border border-black px-2 py-1">{product.partNumber}</td></tr>
              <tr><td className="border border-black px-2 py-1 text-center">04</td><td className="border border-black px-2 py-1">Mã dự án</td><td className="border border-black px-2 py-1">N/A</td></tr>
              <tr><td className="border border-black px-2 py-1 text-center">05</td><td className="border border-black px-2 py-1">Số Lot hàng</td><td className="border border-black px-2 py-1">{product.lotNumber || 'N/A'}</td></tr>
              <tr><td className="border border-black px-2 py-1 text-center">06</td><td className="border border-black px-2 py-1">Số lượng</td><td className="border border-black px-2 py-1">{product.quantity || 'N/A'}</td></tr>
              <tr><td className="border border-black px-2 py-1 text-center">07</td><td className="border border-black px-2 py-1">Đơn vị tính</td><td className="border border-black px-2 py-1">PCS</td></tr>
              <tr><td className="border border-black px-2 py-1 text-center">08</td><td className="border border-black px-2 py-1">Nhà cung cấp</td><td className="border border-black px-2 py-1">{product.manufacturer || 'N/A'}</td></tr>
              <tr><td className="border border-black px-2 py-1 text-center">09</td><td className="border border-black px-2 py-1">Số phiếu nhập kho</td><td className="border border-black px-2 py-1">N/A</td></tr>
              <tr><td className="border border-black px-2 py-1 text-center">10</td><td className="border border-black px-2 py-1">Ngày nhập kho</td><td className="border border-black px-2 py-1">{product.targetDate || 'N/A'}</td></tr>
              <tr><td className="border border-black px-2 py-1 text-center">11</td><td className="border border-black px-2 py-1">Cấp độ kiểm tra</td><td className="border border-black px-2 py-1">H: 100% check</td></tr>
              <tr><td className="border border-black px-2 py-1 text-center">12</td><td className="border border-black px-2 py-1">Số lượng hàng lỗi</td><td className="border border-black px-2 py-1">{product.statusNote === 'Reject' ? product.quantity : '0'}</td></tr>
              <tr><td className="border border-black px-2 py-1 text-center">13</td><td className="border border-black px-2 py-1">Nội dung lỗi</td><td className="border border-black px-2 py-1">{product.statusNote === 'Reject' ? product.description : ''}</td></tr>
              <tr><td className="border border-black px-2 py-1 text-center">14</td><td className="border border-black px-2 py-1">Ngày kiểm tra</td><td className="border border-black px-2 py-1">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td></tr>
              <tr><td className="border border-black px-2 py-1 text-center">15</td><td className="border border-black px-2 py-1">Người kiểm tra</td><td className="border border-black px-2 py-1">{product.inspectorName || ''}</td></tr>
              <tr><td className="border border-black px-2 py-1 text-center">16</td><td className="border border-black px-2 py-1">Thời hạn phản hồi</td><td className="border border-black px-2 py-1">{product.targetDate || 'N/A'}</td></tr>
              <tr><td className="border border-black px-2 py-1 text-center">22</td><td className="border border-black px-2 py-1">Lý do chấp nhận lỗi</td><td className="border border-black px-2 py-1"></td></tr>
              <tr><td className="border border-black px-2 py-1 text-center">23</td><td className="border border-black px-2 py-1">Ngày chấp nhận</td><td className="border border-black px-2 py-1"></td></tr>
              <tr><td className="border border-black px-2 py-1 text-center">24</td><td className="border border-black px-2 py-1">Người đề xuất</td><td className="border border-black px-2 py-1"></td></tr>
              <tr><td className="border border-black px-2 py-1 text-center">25</td><td className="border border-black px-2 py-1">Người phê duyệt</td><td className="border border-black px-2 py-1"></td></tr>
            </tbody>
          </table>
        </div>

        <div className="text-xs mb-2 italic">
          1. Ghi dữ liệu đo trực tiếp vào vị trí tương ứng trên bản vẽ nếu quá số kích thước<br/>
          2. Khoanh tròn kích thước bị lỗi tương ứng
        </div>

        {/* Measurement Results Section */}
        <div>
          <h2 className="font-bold text-base mb-1 italic">Kết quả đo</h2>
          <table className="w-full border-collapse border border-black text-sm text-center">
            <thead>
              <tr className="bg-gray-100 font-bold">
                <th className="border border-black px-2 py-1 w-12">No.</th>
                <th className="border border-black px-2 py-1 w-16">①</th>
                <th className="border border-black px-2 py-1 w-16">②</th>
                <th className="border border-black px-2 py-1 w-16">③</th>
                <th className="border border-black px-2 py-1 w-16">④</th>
                <th className="border border-black px-2 py-1 w-16">⑤</th>
                <th className="border border-black px-2 py-1 w-16">⑥</th>
                <th className="border border-black px-2 py-1 w-16">⑦</th>
                <th className="border border-black px-2 py-1">Ngoại quan</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((rowNum) => (
                <tr key={rowNum} className="h-6">
                  <td className="border border-black px-2 py-1 font-medium">{rowNum.toString().padStart(2, '0')}</td>
                  <td className="border border-black px-2 py-1"></td>
                  <td className="border border-black px-2 py-1"></td>
                  <td className="border border-black px-2 py-1"></td>
                  <td className="border border-black px-2 py-1"></td>
                  <td className="border border-black px-2 py-1"></td>
                  <td className="border border-black px-2 py-1"></td>
                  <td className="border border-black px-2 py-1"></td>
                  <td className="border border-black px-2 py-1"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
      </div>
    </div>
  );
}
