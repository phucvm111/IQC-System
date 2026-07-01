import { useState, useEffect } from 'react';
import { Plus, Check, X, FileEdit } from 'lucide-react';

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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col h-full min-h-[400px] overflow-hidden transition-all">
      <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-white z-20">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <FileEdit className="w-4 h-4" />
          </div>
          Measurement Results
        </h2>
        <button 
          onClick={addRow}
          className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors focus:ring-4 focus:ring-blue-50"
        >
          <Plus className="w-4 h-4" /> Add Row
        </button>
      </div>

      <div className="flex-1 overflow-auto bg-slate-50/50 p-5">
        <div className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-slate-500 font-bold bg-slate-50 uppercase tracking-wider sticky top-0 z-10 shadow-sm backdrop-blur-md">
              <tr>
                <th className="px-4 py-4 text-center border-b border-r border-slate-200 w-16">No.</th>
                {Array.from({ length: numDims }).map((_, i) => (
                  <th key={i} className="px-4 py-4 text-center border-b border-r border-slate-200">Dim {i + 1}</th>
                ))}
                <th className="px-4 py-4 text-center border-b border-slate-200 w-28">Ngoại quan</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 hover:bg-blue-50/50 transition-colors group">
                  <td className="px-4 py-3 font-semibold text-center border-r border-slate-100 text-slate-600 bg-slate-50/50 group-hover:bg-transparent">
                    {row.no}
                  </td>
                  {row.dims.map((dim, dimIndex) => (
                    <td key={dimIndex} className="p-1 border-r border-slate-100 relative">
                      <input
                        type="number"
                        step="0.01"
                        className="w-full h-full p-2.5 text-center font-medium text-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500/50 bg-transparent hover:bg-slate-100/50 transition-colors"
                        value={dim ?? ''}
                        onChange={(e) => updateDim(row.id, dimIndex, e.target.value)}
                        placeholder="-"
                      />
                    </td>
                  ))}
                  <td className="px-4 py-3 text-center cursor-pointer select-none" onClick={() => toggleVisual(row.id)}>
                    <div className="flex justify-center items-center w-full h-full">
                      {row.visualOk === true && <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center animate-in zoom-in duration-200"><Check className="w-5 h-5 text-green-600 font-bold" /></div>}
                      {row.visualOk === false && <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center animate-in zoom-in duration-200"><X className="w-5 h-5 text-red-600 font-bold" /></div>}
                      {row.visualOk === null && <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold hover:bg-slate-200 transition-colors">-</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
