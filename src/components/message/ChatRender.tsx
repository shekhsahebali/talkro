


'use client';

import { useChatStore } from '@/store/useChatStore';
import FloatingChat from './FloatingChat';
import { MOCK_USERS } from '@/lib/constants';

export default function FloatingChatRenderer() {
  const { activeChats, closeChat } = useChatStore();

  return (
            <div className="hidden sm:flex fixed bottom-0 right-20 z-[200] items-end space-x-4">

      {activeChats.map((chat, index) => {
        const user = MOCK_USERS.find((u) => u.id === chat.userId);
        if (!user) return null;

        return (
            
          <FloatingChat
            key={chat.userId}
            user={user}
            minimized={chat.minimized}
            onToggleMinimize={() =>
              useChatStore.getState().toggleMinimize(chat.userId)
            }
            onClose={() => closeChat(chat.userId)}
            index={index} // optional for positioning
          />
        );
      })}
    </div>
  );
}




