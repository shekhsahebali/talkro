import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Chat = {
  userId: string;
  minimized: boolean;
};

interface ChatStore {
  activeChats: Chat[];
  openChat: (userId: string) => void;
  closeChat: (userId: string) => void;
  toggleMinimize: (userId: string) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      activeChats: [],

      openChat: (userId) =>
        set((state) =>
          state.activeChats.some((c) => c.userId === userId)
            ? state
            : {
                activeChats: [
                  ...state.activeChats,
                  { userId, minimized: false },
                ],
              }
        ),

      closeChat: (userId) =>
        set((state) => ({
          activeChats: state.activeChats.filter(
            (c) => c.userId !== userId
          ),
        })),

      toggleMinimize: (userId) =>
        set((state) => ({
          activeChats: state.activeChats.map((c) =>
            c.userId === userId
              ? { ...c, minimized: !c.minimized }
              : c
          ),
        })),
    }),
    {
      name: 'floating-chat-state', // persists across refresh
    }
  )
);
