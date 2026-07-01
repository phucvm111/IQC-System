import { useState, useEffect } from 'react';
import { Plus, Check, X } from 'lucide-react';

export interface MeasurementRow {
  id: string;
  no: number;
  dims: (number | undefined)[];
  visualOk: boolean | null;
}

interface MeasurementTableProps {
  numDims?: number;
  quantity?: string | null;
}

export default function MeasurementTable({ numDims = 5, quantity }: MeasurementTableProps) {
  const [rows, setRows] = useState<MeasurementRow[]>([]);

  useEffect(() => {
    let q = parseInt(quantity || '3', 10);
    if (isNaN(q) || q <= 0) q = 3; // Fallback

    const initialRows: MeasurementRow[] = Array.from({ length: q }, (_, i) => ({
      id: i.toString(),
      no: i + 1,
      dims: Array(numDims).fill(undefined),
      visualOk: null
    }));
    
    setRows(initialRows);
  }, [quantity, numDims]);

  const addRow = () => {
    const nextNo = rows.length > 0 ? Math.max(...rows.map(r => r.no)) + 1 : 1;
    setRows([...rows, {
      id: Date.now().toString(),
      no: nextNo,
      dims: Array(numDims).fill(undefined),
      visualOk: null
    }]);
  };

  const updateDim = (rowId: string, dimIndex: number, value: string) => {
    const numVal = value === '' ? undefined : parseFloat(value);
    setRows(prev => prev.map(row => {
      if (row.id === rowId) {
        const newDims = [...row.dims];
        newDims[dimIndex] = numVal;
        return { ...row, dims: newDims };
      }
      return row;
    }));
  };

  const toggleVisual = (rowId: string) => {
    setRows(prev => prev.map(row => {
      if (row.id === rowId) {
        return { ...row, visualOk: row.visualOk === true ? false : row.visualOk === false ? null : true };
      }
      return row;
    }));
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col h-full min-h-[400px]">
      <div className="flex justify-between items-center mb-4 border-b pb-3">
        <h2 className="text-lg font-bold text-gray-800">Measurement Results (Kết quả đo)</h2>
        <button 
          onClick={addRow}
          className="flex items-center gap-1 text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded hover:bg-blue-100 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Row
        </button>
      </div>

      <div className="flex-1 overflow-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-xs text-gray-700 bg-gray-100 uppercase sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-center border-b border-r w-16">No.</th>
              {Array.from({ length: numDims }).map((_, i) => (
                <th key={i} className="px-4 py-3 text-center border-b border-r">Dim {i + 1}</th>
              ))}
              <th className="px-4 py-3 text-center border-b w-24">Ngoại quan</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={row.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-semibold text-center border-r text-gray-700 bg-gray-50">
                  {row.no}
                </td>
                {row.dims.map((dim, dimIndex) => (
                  <td key={dimIndex} className="p-0 border-r relative group">
                    <input
                      type="number"
                      step="0.01"
                      className="w-full h-full p-3 text-center focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 bg-transparent"
                      value={dim ?? ''}
                      onChange={(e) => updateDim(row.id, dimIndex, e.target.value)}
                      placeholder="-"
                    />
                  </td>
                ))}
                <td className="px-4 py-3 text-center cursor-pointer" onClick={() => toggleVisual(row.id)}>
                  <div className="flex justify-center items-center w-full h-full">
                    {row.visualOk === true && <Check className="w-5 h-5 text-green-500 font-bold" />}
                    {row.visualOk === false && <X className="w-5 h-5 text-red-500 font-bold" />}
                    {row.visualOk === null && <span className="text-gray-300">-</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
