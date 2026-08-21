import { create } from 'zustand';

import * as api from '../api/practices';
import { toErrorMessage } from '../api/client';

/**
 * The single source of truth for practice data.
 *
 * Any component can read `practices` from this store. When an action changes
 * it, every subscribed component re-renders automatically — which is how the
 * list stays current after create/edit/complete/delete with no manual refresh
 * and no re-fetch.
 *
 * Note that each mutation reuses the object the API returns instead of calling
 * GET /practices again. One round trip, and the data is exactly what the server
 * stored (including its updated_at).
 */
export const usePracticeStore = create((set, get) => ({
  practices: [],

  loading: false, // first load — show a full-screen spinner
  refreshing: false, // pull-to-refresh — show the inline spinner
  error: null, // list-level error message
  busyId: null, // id of the row currently completing/deleting

  /** Load the list. `isRefresh` picks which spinner to show. */
  fetchPractices: async ({ isRefresh = false } = {}) => {
    set(isRefresh ? { refreshing: true } : { loading: true });
    try {
      const practices = await api.fetchPractices();
      set({ practices, error: null });
    } catch (err) {
      set({ error: toErrorMessage(err) });
    } finally {
      set({ loading: false, refreshing: false });
    }
  },

  /**
   * Create a practice and put it at the top of the list.
   *
   * Mutations rethrow on failure so the calling screen can decide what to do —
   * the form stays open on error rather than navigating back over a failure.
   */
  addPractice: async (payload) => {
    const created = await api.createPractice(payload);
    set({ practices: [created, ...get().practices] });
    return created;
  },

  /** Replace an existing practice with the server's updated version. */
  editPractice: async (id, payload) => {
    const updated = await api.updatePractice(id, payload);
    set({
      practices: get().practices.map((p) => (p.id === id ? updated : p)),
    });
    return updated;
  },

  /** Mark one practice completed. */
  completePractice: async (id) => {
    set({ busyId: id });
    try {
      const updated = await api.completePractice(id);
      set({
        practices: get().practices.map((p) => (p.id === id ? updated : p)),
        error: null,
      });
    } catch (err) {
      set({ error: toErrorMessage(err) });
    } finally {
      set({ busyId: null });
    }
  },

  /** Delete one practice. */
  removePractice: async (id) => {
    set({ busyId: id });
    try {
      await api.deletePractice(id);
      set({
        practices: get().practices.filter((p) => p.id !== id),
        error: null,
      });
    } catch (err) {
      set({ error: toErrorMessage(err) });
    } finally {
      set({ busyId: null });
    }
  },

  clearError: () => set({ error: null }),
}));
