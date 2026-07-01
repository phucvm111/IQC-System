import { useState } from 'react';

export interface Criterion {
  id: string;
  name: string;
  standardValue: number;
  tolerance: number; // e.g., 0.5 means +/- 0.5
  actualValue?: number;
}

interface InspectionChecklistProps {
  criteria: Criterion[];
  onComplete: (results: Criterion[]) => void;
}

export default function InspectionChecklist({ criteria: initialCriteria, onComplete }: InspectionChecklistProps) {
  const [criteria, setCriteria] = useState<Criterion[]>(initialCriteria);

  const handleValueChange = (id: string, value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    setCriteria(prev => prev.map(c => c.id === id ? { ...c, actualValue: numValue } : c));
  };

  const evaluateStatus = (criterion: Criterion) => {
    if (criterion.actualValue === undefined) return 'pending';
    const min = criterion.standardValue - criterion.tolerance;
    const max = criterion.standardValue + criterion.tolerance;
    return (criterion.actualValue >= min && criterion.actualValue <= max) ? 'pass' : 'fail';
  };

  const allFilled = criteria.every(c => c.actualValue !== undefined);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
      <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Measurement Checklist</h2>
      
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {criteria.map(criterion => {
          const status = evaluateStatus(criterion);
          return (
            <div key={criterion.id} className={`p-4 rounded-xl border transition-colors ${
              status === 'pass' ? 'border-success/30 bg-success/5' : 
              status === 'fail' ? 'border-danger/30 bg-danger/5' : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-800">{criterion.name}</h3>
                {status === 'pass' && <span className="px-2 py-1 bg-success text-white text-xs font-bold rounded">PASS</span>}
                {status === 'fail' && <span className="px-2 py-1 bg-danger text-white text-xs font-bold rounded">FAIL</span>}
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                <div className="text-gray-500">
                  <span className="block text-xs">Standard</span>
                  <span className="font-medium text-gray-800">{criterion.standardValue}</span>
                </div>
                <div className="text-gray-500">
                  <span className="block text-xs">Tolerance</span>
                  <span className="font-medium text-gray-800">±{criterion.tolerance}</span>
                </div>
                <div className="text-gray-500">
                  <span className="block text-xs">Valid Range</span>
                  <span className="font-medium text-gray-800">
                    {(criterion.standardValue - criterion.tolerance).toFixed(2)} - {(criterion.standardValue + criterion.tolerance).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-2 relative">
                <input
                  type="number"
                  step="0.01"
                  placeholder="Enter actual value..."
                  value={criterion.actualValue ?? ''}
                  onChange={(e) => handleValueChange(criterion.id, e.target.value)}
                  className={`w-full p-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-shadow ${
                    status === 'pass' ? 'border-success focus:border-success focus:ring-success' : 
                    status === 'fail' ? 'border-danger focus:border-danger focus:ring-danger text-danger font-semibold' : 'border-gray-300 focus:border-primary focus:ring-primary'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <button
          disabled={!allFilled}
          onClick={() => onComplete(criteria)}
          className={`w-full py-3 rounded-xl font-bold text-lg transition-all ${
            allFilled 
              ? 'bg-primary text-white hover:bg-blue-700 shadow-md hover:-translate-y-0.5' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Submit Inspection
        </button>
      </div>
    </div>
  );
}
