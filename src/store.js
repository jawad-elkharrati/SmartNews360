import { create } from 'zustand';

export const useFilterStore = create((set) => ({
  section: new Set(),
  sentiment: new Set(),
  toggleSection: (s) => set((state) => {
    const ns = new Set(state.section);
    ns.has(s) ? ns.delete(s) : ns.add(s);
    return { section: ns };
  }),
  togglePolarité: (s) => set((state) => {
    const ns = new Set(state.sentiment);
    ns.has(s) ? ns.delete(s) : ns.add(s);
    return { sentiment: ns };
  })
}));
