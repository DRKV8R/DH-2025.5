import { create } from "zustand"

type Status = "idle" | "processing" | "success" | "error"

export interface Statuses {
  chat: Status
  voice: Status
  video: Status
  vercel: Status
}

interface StatusState {
  statuses: Statuses
  setStatuses: (updater: (prev: Statuses) => Partial<Statuses>) => void
  resetStatus: (service: keyof Omit<Statuses, "vercel">) => void
}

export const useStatusStore = create<StatusState>((set) => ({
  statuses: { chat: "idle", voice: "idle", video: "idle", vercel: "success" },
  setStatuses: (updater) => set((state) => ({ statuses: { ...state.statuses, ...updater(state.statuses) } })),
  resetStatus: (service) =>
    setTimeout(() => {
      set((state) => ({
        statuses: { ...state.statuses, [service]: "idle" },
      }))
    }, 3000),
}))
