import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: number;
  partNumber: string;
  drawingCode?: string;
  quantity?: string;
  manufacturer?: string;
  lotNumber?: string;
  targetDate?: string;
  statusNote?: string;
  inspectorName?: string;
  recordCode?: string;
  description?: string;
  toleranceConfig?: string;
}

interface InspectionStore {
  activeProduct: Product | null;
  setActiveProduct: (product: Product | null) => void;
}

export const useInspectionStore = create<InspectionStore>()(
  persist(
    (set) => ({
      activeProduct: null,
      setActiveProduct: (product) => set({ activeProduct: product }),
    }),
    {
      name: 'inspection-store',
    }
  )
);
