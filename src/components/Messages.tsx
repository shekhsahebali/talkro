
import React, { useState, useRef, useEffect } from 'react';
import { CONVERSATIONS_MOCK, CURRENT_USER, MOCK_USERS } from '../constants';
import { 
  Settings, Search, Mail, Send, Camera, Mic, Info, Smile, 
  ChevronLeft, Phone, Video, Users, Plus, Check, X, 
  Bell, BellOff, Trash2, Ban, UserMinus, Image as ImageIcon, 
  Edit3, Shield, UserPlus, MoreVertical, LogOut, ChevronRight,
  Paperclip, FileText, Download, Palette, Heart, SearchSlash
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/Avatar';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';
import { Conversation, User, Message, Attachment } from '../types';

interface MessagesProps {
  onStartCall: (user: User, type: 'audio' | 'video') => void;
}

const THEME_COLORS = [
  { name: 'Default', value: 'rgb(14, 165, 233)' }, 
  { name: 'Grape', value: 'rgb(139, 92, 246)' }, 
  { name: 'Rose', value: 'rgb(244, 63, 94)' }, 
  { name: 'Emerald', value: 'rgb(16, 185, 129)' }, 
  { name: 'Amber', value: 'rgb(245, 158, 11)' }, 
  { name: 'Crimson', value: 'rgb(220, 38, 38)' }, 
];

const CUSTOM_EMOJIS = ['👍', '❤️', '🔥', '😂', '😮', '👏', '🙌', '✨'];

const Messages: React.FC<MessagesProps> = ({ onStartCall }) => {
  const [conversations, setConversations] = useState<Conversation[]>(
    CONVERSATIONS_MOCK.map(c => ({
      ...c,
      themeColor: THEME_COLORS[0].value,
      customEmoji: '👍',
      nicknames: {}
    })) as any
  );
  
  // Set initial selectedId to null on small screens to show the list first
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupSearchQuery, setGroupSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [messageText, setMessageText] = useState('');
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isEditingNicknames, setIsEditingNicknames] = useState(false);

  const [messagesByConv, setMessagesByConv] = useState<Record<string, Message[]>>({
    'c1': [
      { id: 'm1', senderId: 'u2', text: 'Did you see the new multimodal updates?', timestamp: '10:00 AM' },
      { id: 'm2', senderId: 'u1', text: 'Not yet! Send me a link.', timestamp: '10:02 AM' }
    ],
    'c2': [
      { id: 'm3', senderId: 'u10', text: 'That render was incredible!', timestamp: 'Yesterday' }
    ]
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const selectedConversation = conversations.find(c => c.id === selectedId);
  const activeMessages = selectedId ? (messagesByConv[selectedId] || []) : [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeMessages, selectedId]);

  // Reset chat info view when switching chats
  useEffect(() => {
    setShowChatInfo(false);
  }, [selectedId]);

  const handleSend = (textOverride?: string) => {
    const finalMsg = textOverride || messageText;
    if ((!finalMsg.trim() && !pendingFile) || !selectedId) return;

    let attachment: Attachment | undefined;
    if (pendingFile) {
      attachment = {
        name: pendingFile.name,
        type: pendingFile.type.startsWith('image/') ? 'image' : 'file',
        url: URL.createObjectURL(pendingFile)
      };
    }

    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: CURRENT_USER.id,
      text: finalMsg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachment
    };

    setMessagesByConv(prev => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] || []), newMessage]
    }));

    setConversations(prev => prev.map(c => 
      c.id === selectedId ? { ...c, lastMessage: finalMsg || (attachment?.type === 'image' ? 'Sent a photo' : 'Sent a file'), timestamp: 'Now' } : c
    ));

    setMessageText('');
    setPendingFile(null);

    if (selectedConversation && !selectedConversation.isGroup && !textOverride) {
      setTimeout(() => {
        const reply: Message = {
          id: Math.random().toString(36).substr(2, 9),
          senderId: selectedConversation.participant!.id,
          text: 'Sounds good! Let me check that out.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessagesByConv(prev => ({
          ...prev,
          [selectedId]: [...(prev[selectedId] || []), reply]
        }));
      }, 2000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPendingFile(file);
  };

  const handleCreateGroup = () => {
    if (!groupName || selectedUsers.length === 0) return;
    const participants = MOCK_USERS.filter(u => selectedUsers.includes(u.id));
    const newGroup: Conversation = {
      id: `g-${Math.random().toString(36).substr(2, 9)}`,
      name: groupName,
      isGroup: true,
      participants: participants as any,
      lastMessage: "Group created",
      timestamp: "Now",
      unread: false,
      themeColor: THEME_COLORS[0].value,
      customEmoji: '👍',
      nicknames: {}
    };
    setConversations([newGroup, ...conversations]);
    setIsCreatingGroup(false);
    setSelectedId(newGroup.id);
    setGroupName('');
    setGroupSearchQuery('');
    setSelectedUsers([]);
  };

  const handleStartNewChat = (user: User) => {
    const existing = conversations.find(c => !c.isGroup && c.participant?.id === user.id);
    if (existing) {
      setSelectedId(existing.id);
    } else {
      const newChat: Conversation = {
        id: `c-${Math.random().toString(36).substr(2, 9)}`,
        participant: user,
        lastMessage: "Start a conversation",
        timestamp: "Now",
        unread: false,
        themeColor: THEME_COLORS[0].value,
        customEmoji: '👍',
        nicknames: {}
      };
      setConversations([newChat, ...conversations]);
      setSelectedId(newChat.id);
    }
    setIsNewChatModalOpen(false);
  };

  const updateConversationSettings = (updates: Partial<Conversation>) => {
    if (!selectedId) return;
    setConversations(prev => prev.map(c => 
      c.id === selectedId ? { ...c, ...updates } : c
    ));
  };

  const handleRemoveMember = (userId: string) => {
    if (!selectedConversation) return;
    const newParticipants = selectedConversation.participants?.filter(p => p.id !== userId);
    if (newParticipants && newParticipants.length === 0) {
      handleDeleteConversation();
    } else {
      updateConversationSettings({ participants: newParticipants });
    }
  };

  const handleDeleteConversation = () => {
    if (confirm("Delete this conversation?")) {
      setConversations(prev => prev.filter(c => c.id !== selectedId));
      setSelectedId(null);
      setShowChatInfo(false);
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const getDisplayName = (user: User) => {
    if (selectedConversation?.nicknames?.[user.id]) {
      return selectedConversation.nicknames[user.id];
    }
    return user.name;
  };

  const filteredConversations = conversations.filter(c => {
    const name = c.isGroup ? c.name : c.participant?.name;
    return name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredGroupFriends = MOCK_USERS.filter(u => 
    u.name.toLowerCase().includes(groupSearchQuery.toLowerCase()) ||
    u.handle.toLowerCase().includes(groupSearchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-64px)] sm:h-screen bg-black overflow-hidden relative">
      {/* Sidebar List - Visible when no chat is selected on mobile */}
      <div className={cn(
        "w-full sm:w-[320px] lg:w-[380px] border-r border-[#2f3336] flex flex-col shrink-0 transition-all duration-300",
        selectedId ? "hidden sm:flex" : "flex",
        showChatInfo && "lg:w-[300px]" 
      )}>
        <header className="px-4 py-4 flex justify-between items-center border-b border-white/5">
          <h1 className="text-xl font-black tracking-tight">Messages</h1>
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setIsCreatingGroup(true)}>
              <Users className="w-5 h-5 text-white" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setIsNewChatModalOpen(true)}>
              <Edit3 className="w-5 h-5 text-white" />
            </Button>
          </div>
        </header>
        
        <div className="px-4 py-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-sky-500 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations"
              className="w-full bg-[#202327] rounded-full py-2.5 pl-10 pr-4 text-sm outline-none placeholder-neutral-500 focus:bg-transparent focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {filteredConversations.length > 0 ? filteredConversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setSelectedId(conv.id)}
              className={cn(
                "px-4 py-3 flex items-center space-x-3 cursor-pointer hover:bg-white/[0.03] transition-all",
                selectedId === conv.id && "bg-white/[0.05] border-r-4 border-sky-500"
              )}
            >
              <div className="relative">
                {conv.isGroup ? (
                  <div className="w-12 h-12 bg-neutral-800 rounded-2xl flex items-center justify-center relative shadow-lg">
                    <Users className="w-6 h-6 text-sky-500" />
                  </div>
                ) : (
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={conv.participant?.avatar} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
                {!conv.isGroup && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-black rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold truncate text-[15px]">{conv.isGroup ? conv.name : conv.participant?.name}</span>
                  <span className="text-[11px] text-neutral-500">{conv.timestamp}</span>
                </div>
                <p className="text-[13px] text-neutral-500 truncate">{conv.lastMessage}</p>
              </div>
            </div>
          )) : (
            <div className="p-10 text-center space-y-2">
              <SearchSlash className="w-10 h-10 text-neutral-800 mx-auto" />
              <p className="text-neutral-500 text-sm font-bold">No chats found</p>
            </div>
          )}
        </div>
      </div>

      {/* Main View */}
      <div className={cn("flex-1 flex flex-col bg-black relative", !selectedId && "hidden sm:flex items-center justify-center")}>
        {!selectedId ? (
          <div className="text-center space-y-6 animate-in fade-in duration-500">
             <div className="p-10 bg-neutral-900 rounded-[40px] w-32 h-32 flex items-center justify-center mx-auto shadow-2xl">
               <Mail className="w-12 h-12 text-neutral-600" />
             </div>
             <div className="space-y-2">
               <h2 className="text-3xl font-black tracking-tight">Select a message</h2>
               <p className="text-neutral-500 text-sm">Choose from your existing conversations or start a new one.</p>
             </div>
             <Button onClick={() => setIsNewChatModalOpen(true)} className="rounded-full font-black px-10 h-12 shadow-xl shadow-sky-500/10">New Conversation</Button>
          </div>
        ) : (
          <div className="flex h-full w-full overflow-hidden relative">
            <div className="flex-1 flex flex-col min-w-0">
              <header className="px-4 py-3 border-b border-white/5 flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur-md z-10">
                <div className="flex items-center space-x-3 min-w-0">
                  <Button variant="ghost" size="icon" className="sm:hidden -ml-2 rounded-full" onClick={() => setSelectedId(null)}>
                     <ChevronLeft className="w-6 h-6 text-white" />
                  </Button>
                  {selectedConversation?.isGroup ? (
                     <div className="w-10 h-10 bg-neutral-800 rounded-xl flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5 text-sky-500" />
                     </div>
                  ) : (
                    <Avatar className="w-10 h-10 shrink-0">
                      <AvatarImage src={selectedConversation?.participant?.avatar} />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  )}
                  <div className="min-w-0">
                    <p className="font-bold text-[16px] truncate leading-tight">
                      {selectedConversation?.isGroup ? selectedConversation.name : selectedConversation?.participant?.name}
                    </p>
                    <p className="text-[11px] text-emerald-500 font-bold uppercase tracking-widest">Active now</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  {!selectedConversation?.isGroup && (
                    <>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full text-sky-500"
                        onClick={() => selectedConversation?.participant && onStartCall(selectedConversation.participant, 'audio')}
                      >
                        <Phone className="w-5 h-5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full text-sky-500"
                        onClick={() => selectedConversation?.participant && onStartCall(selectedConversation.participant, 'video')}
                      >
                        <Video className="w-5 h-5" />
                      </Button>
                    </>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setShowChatInfo(!showChatInfo)}
                    className={cn("rounded-full transition-colors", showChatInfo ? "text-sky-500 bg-sky-500/10" : "text-neutral-500 hover:text-white")}
                  >
                    <Info className="w-5 h-5" />
                  </Button>
                </div>
              </header>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-black/40">
                <div className="flex flex-col items-center py-10 border-b border-white/5 mb-6 opacity-60">
                   {selectedConversation?.isGroup ? (
                      <div className="w-20 h-20 bg-neutral-900 rounded-[32px] flex items-center justify-center mb-4 shadow-2xl">
                         <Users className="w-10 h-10 text-sky-500" />
                      </div>
                   ) : (
                     <Avatar className="w-20 h-20 mb-4 ring-4 ring-sky-500/10 shadow-2xl">
                       <AvatarImage src={selectedConversation?.participant?.avatar} />
                       <AvatarFallback>U</AvatarFallback>
                     </Avatar>
                   )}
                   <h3 className="font-black text-2xl tracking-tight">{selectedConversation?.isGroup ? selectedConversation.name : selectedConversation?.participant?.name}</h3>
                   <p className="text-neutral-500 text-sm mt-1">{selectedConversation?.isGroup ? `${selectedConversation.participants?.length} members` : selectedConversation?.participant?.handle}</p>
                </div>

                {activeMessages.map((msg, i) => {
                  const isMine = msg.senderId === CURRENT_USER.id;
                  return (
                    <div key={msg.id} className={cn("flex flex-col", isMine ? "items-end" : "items-start")}>
                      <div className={cn(
                        "max-w-[75%] px-4 py-2.5 rounded-2xl shadow-sm",
                        isMine ? "bg-sky-500 text-white rounded-tr-none" : "bg-neutral-800 text-white rounded-tl-none"
                      )} style={isMine ? { backgroundColor: selectedConversation?.themeColor } : {}}>
                        {msg.text && <p className="text-[15px] whitespace-pre-wrap">{msg.text}</p>}
                        {msg.attachment && (
                          <div className="mt-2 space-y-2">
                            {msg.attachment.type === 'image' ? (
                              <img src={msg.attachment.url} className="rounded-xl max-h-60 w-auto object-contain border border-white/10" alt="Attachment" />
                            ) : (
                              <div className="flex items-center space-x-3 bg-black/20 p-3 rounded-xl border border-white/5 min-w-[200px]">
                                <FileText className="w-5 h-5 text-neutral-400" />
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-bold truncate">{msg.attachment.name}</p>
                                </div>
                                <Download className="w-4 h-4 text-neutral-400" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <span className="text-[9px] text-neutral-600 font-black mt-1 uppercase tracking-widest">{msg.timestamp}</span>
                    </div>
                  );
                })}
              </div>

              {pendingFile && (
                <div className="px-4 py-3 bg-neutral-900 border-t border-white/5 animate-in slide-in-from-bottom-4">
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/10">
                    <div className="flex items-center space-x-3">
                      {pendingFile.type.startsWith('image/') ? <ImageIcon className="w-5 h-5 text-emerald-500" /> : <FileText className="w-5 h-5 text-sky-500" />}
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate text-neutral-200">{pendingFile.name}</p>
                        <p className="text-[10px] text-neutral-500 uppercase font-black">{(pendingFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <button onClick={() => setPendingFile(null)} className="text-neutral-500 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
                  </div>
                </div>
              )}

              <footer className="p-4 border-t border-white/5">
                <div className="flex items-center space-x-2 bg-neutral-900 rounded-[28px] px-3 py-1.5 border border-white/5">
                  <button onClick={() => fileInputRef.current?.click()} className="h-10 w-10 flex items-center justify-center text-sky-500 hover:bg-white/5 rounded-full transition-all">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Message..."
                    className="flex-1 bg-transparent border-none outline-none py-2 text-[15px] placeholder-neutral-600"
                  />
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-sky-500 rounded-full hover:bg-white/5"><Smile className="w-5 h-5" /></Button>
                  
                  {messageText.trim() || pendingFile ? (
                    <button 
                      onClick={() => handleSend()}
                      className="h-10 w-10 flex items-center justify-center bg-sky-500 text-white rounded-full hover:bg-sky-400 transition-all shadow-lg active:scale-90"
                      style={{ backgroundColor: selectedConversation?.themeColor }}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleSend(selectedConversation?.customEmoji || '👍')}
                      className="h-10 w-10 flex items-center justify-center text-sky-500 hover:bg-white/5 rounded-full text-xl hover:scale-125 transition-transform active:scale-75"
                      style={{ color: selectedConversation?.themeColor }}
                    >
                      {selectedConversation?.customEmoji || '👍'}
                    </button>
                  )}
                </div>
              </footer>
            </div>

            {/* Chat Info Panel - Responsive Fix */}
            {showChatInfo && (
              <div className={cn(
                "flex flex-col bg-[#0a0a0a] transition-all duration-300 overflow-y-auto no-scrollbar",
                "fixed inset-0 z-[150] lg:relative lg:z-0 lg:w-[320px] xl:w-[360px] lg:border-l border-white/5 animate-in slide-in-from-right-4 lg:animate-none"
              )}>
                {/* Mobile Back Button in Settings */}
                <div className="lg:hidden p-4 border-b border-white/5 flex items-center sticky top-0 bg-black/90 backdrop-blur-md z-10">
                   <Button variant="ghost" size="icon" className="rounded-full mr-2" onClick={() => setShowChatInfo(false)}>
                      <ChevronLeft className="w-6 h-6 text-white" />
                   </Button>
                   <span className="font-bold text-lg">Details</span>
                </div>

                <div className="p-8 flex flex-col items-center text-center border-b border-white/5">
                  {selectedConversation?.isGroup ? (
                    <div className="relative group cursor-pointer">
                      <div className="w-24 h-24 bg-neutral-800 rounded-[40px] flex items-center justify-center mb-4 shadow-xl group-hover:opacity-80 transition-all">
                        <Users className="w-10 h-10 text-sky-500" />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                         <Camera className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  ) : (
                    <Avatar className="w-24 h-24 mb-4 ring-4 ring-white/5 shadow-2xl">
                      <AvatarImage src={selectedConversation?.participant?.avatar} />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  )}
                  <h4 className="font-black text-xl tracking-tight leading-tight">{selectedConversation?.isGroup ? selectedConversation.name : selectedConversation?.participant?.name}</h4>
                  <p className="text-neutral-500 text-sm mt-1 uppercase font-bold tracking-tighter">{selectedConversation?.isGroup ? `${selectedConversation.participants?.length} members` : selectedConversation?.participant?.handle}</p>
                  
                  <div className="flex space-x-6 mt-8">
                     <SettingsIconButton icon={<Bell className={cn("w-5 h-5", isMuted && "fill-sky-500 text-sky-500")} />} label={isMuted ? "Unmute" : "Mute"} onClick={() => setIsMuted(!isMuted)} />
                     <SettingsIconButton icon={<Search className="w-5 h-5" />} label="Search" />
                     <SettingsIconButton icon={<Trash2 className="w-5 h-5 text-rose-500" />} label="Delete" onClick={handleDeleteConversation} />
                  </div>
                </div>

                <div className="p-4 space-y-6">
                  {/* Nicknames Editor */}
                  {isEditingNicknames && (
                    <div className="bg-white/5 rounded-2xl p-4 animate-in slide-in-from-top-2 border border-white/10">
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="text-xs font-black uppercase tracking-widest text-neutral-400">Edit Nicknames</h5>
                        <button onClick={() => setIsEditingNicknames(false)} className="text-sky-500 text-xs font-bold">Done</button>
                      </div>
                      <div className="space-y-4">
                        {selectedConversation?.isGroup ? selectedConversation.participants?.map(p => (
                          <div key={p.id} className="space-y-1">
                             <p className="text-[10px] text-neutral-500 font-bold uppercase">{p.name}</p>
                             <input 
                               className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-500"
                               placeholder="Set nickname..."
                               value={selectedConversation.nicknames?.[p.id] || ''}
                               onChange={(e) => {
                                 const newNicks = { ...(selectedConversation.nicknames || {}), [p.id]: e.target.value };
                                 updateConversationSettings({ nicknames: newNicks });
                               }}
                             />
                          </div>
                        )) : (
                          <div className="space-y-1">
                             <p className="text-[10px] text-neutral-500 font-bold uppercase">{selectedConversation?.participant?.name}</p>
                             <input 
                               className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-500"
                               placeholder="Set nickname..."
                               value={selectedConversation?.nicknames?.[selectedConversation.participant!.id] || ''}
                               onChange={(e) => {
                                 const newNicks = { ...(selectedConversation?.nicknames || {}), [selectedConversation!.participant!.id]: e.target.value };
                                 updateConversationSettings({ nicknames: newNicks });
                               }}
                             />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Customization Options */}
                  <section>
                    <h5 className="px-2 mb-3 text-xs font-black text-neutral-500 uppercase tracking-widest">Customization</h5>
                    <div className="space-y-1">
                      <SettingsRow 
                        icon={<Palette className="w-4 h-4" />} 
                        label="Theme" 
                        rightAction={
                          <div className="flex items-center space-x-1">
                            <div className="w-4 h-4 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: selectedConversation?.themeColor }} />
                            <ChevronRight className="w-4 h-4 text-neutral-700" />
                          </div>
                        }
                        onClick={() => {
                          const curr = THEME_COLORS.findIndex(t => t.value === selectedConversation?.themeColor);
                          updateConversationSettings({ themeColor: THEME_COLORS[(curr + 1) % THEME_COLORS.length].value });
                        }}
                      />
                      <SettingsRow 
                        icon={<Smile className="w-4 h-4" />} 
                        label="Emoji" 
                        rightText={selectedConversation?.customEmoji}
                        onClick={() => {
                          const curr = CUSTOM_EMOJIS.indexOf(selectedConversation?.customEmoji || '👍');
                          updateConversationSettings({ customEmoji: CUSTOM_EMOJIS[(curr + 1) % CUSTOM_EMOJIS.length] });
                        }}
                      />
                      <SettingsRow icon={<Edit3 className="w-4 h-4" />} label="Nicknames" onClick={() => setIsEditingNicknames(!isEditingNicknames)} />
                    </div>
                  </section>

                  {/* Group Member Management */}
                  {selectedConversation?.isGroup && (
                    <section>
                      <div className="flex items-center justify-between px-2 mb-3">
                        <h5 className="text-xs font-black text-neutral-500 uppercase tracking-widest">Chat Members</h5>
                        <button className="text-sky-500 font-bold text-xs hover:underline flex items-center transition-all">
                          <UserPlus className="w-3 h-3 mr-1" /> Add
                        </button>
                      </div>
                      <div className="space-y-3 px-1">
                        {selectedConversation.participants?.map(p => (
                          <div key={p.id} className="flex items-center justify-between group">
                            <div className="flex items-center space-x-3">
                               <Avatar className="w-9 h-9 border border-white/5"><AvatarImage src={p.avatar} /></Avatar>
                               <div className="min-w-0">
                                 <p className="text-sm font-bold truncate">{getDisplayName(p)}</p>
                                 <p className="text-[10px] text-neutral-500 font-black uppercase tracking-tighter">Member</p>
                               </div>
                            </div>
                            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                               <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-rose-500" onClick={() => handleRemoveMember(p.id)}>
                                 <UserMinus className="w-4 h-4" />
                               </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Shared Media Gallery */}
                  <section>
                    <h5 className="px-2 mb-3 text-xs font-black text-neutral-500 uppercase tracking-widest">Shared Gallery</h5>
                    <div className="grid grid-cols-3 gap-1 px-1">
                      {activeMessages.filter(m => m.attachment?.type === 'image').length > 0 ? (
                        activeMessages.filter(m => m.attachment?.type === 'image').slice(0, 6).map((m, i) => (
                          <div key={i} className="aspect-square bg-neutral-900 rounded-lg overflow-hidden border border-white/5 hover:opacity-80 cursor-pointer shadow-sm">
                             <img src={m.attachment!.url} className="w-full h-full object-cover" alt="gallery" />
                          </div>
                        ))
                      ) : (
                        [1,2,3].map(i => (
                          <div key={i} className="aspect-square bg-neutral-900 rounded-lg overflow-hidden border border-white/5 hover:opacity-80 cursor-pointer shadow-sm grayscale opacity-30">
                             <img src={`https://picsum.photos/seed/msgmock${selectedId}${i}/200`} className="w-full h-full object-cover" alt="mock" />
                          </div>
                        ))
                      )}
                    </div>
                  </section>

                  {/* Privacy & Support */}
                  <section className="pt-2">
                    <h5 className="px-2 mb-3 text-xs font-black text-neutral-500 uppercase tracking-widest">Privacy & Support</h5>
                    <div className="space-y-1">
                      <SettingsRow icon={<BellOff className="w-4 h-4" />} label="Mute notifications" rightAction={<Toggle active={isMuted} onToggle={() => setIsMuted(!isMuted)} />} />
                      {!selectedConversation?.isGroup && <SettingsRow icon={<Ban className="w-4 h-4 text-rose-500" />} label="Block user" />}
                      <SettingsRow icon={<LogOut className="w-4 h-4 text-rose-500 font-black" />} label={selectedConversation?.isGroup ? "Leave group" : "Delete chat"} onClick={handleDeleteConversation} />
                      <SettingsRow icon={<Shield className="w-4 h-4" />} label="Report issue" />
                    </div>
                  </section>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODALS */}

      {/* Start New Chat Modal */}
      {isNewChatModalOpen && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md animate-in fade-in duration-300 flex items-center justify-center p-4">
          <div className="bg-[#1c1c1c] w-full max-w-[600px] rounded-[32px] border border-white/10 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
             <header className="p-6 border-b border-white/5 flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={() => setIsNewChatModalOpen(false)} className="rounded-full"><X className="w-5 h-5" /></Button>
                <h2 className="text-xl font-black tracking-tight">New Message</h2>
                <div className="w-10" />
             </header>
             <div className="p-4 bg-black/20">
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                 <input placeholder="Search people..." className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 pl-10 text-white outline-none focus:border-sky-500/50 transition-all" />
               </div>
             </div>
             <div className="flex-1 overflow-y-auto no-scrollbar p-2 max-h-[400px]">
               {MOCK_USERS.map(user => (
                 <div 
                   key={user.id} 
                   onClick={() => handleStartNewChat(user as any)}
                   className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-white/5 cursor-pointer transition-all border border-transparent hover:border-white/5"
                 >
                   <Avatar className="w-12 h-12 border border-white/5"><AvatarImage src={user.avatar} /></Avatar>
                   <div>
                     <p className="font-bold text-[15px]">{user.name}</p>
                     <p className="text-xs text-neutral-500 font-bold uppercase tracking-tighter">{user.handle}</p>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      )}

      {/* Create Group Modal - Added Search functionality */}
      {isCreatingGroup && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md animate-in fade-in duration-300 flex items-center justify-center p-4">
           <div className="bg-[#1c1c1c] w-full max-w-[600px] rounded-[32px] border border-white/10 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
              <header className="p-6 border-b border-white/5 flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={() => setIsCreatingGroup(false)} className="rounded-full"><X className="w-5 h-5" /></Button>
                <h2 className="text-xl font-black tracking-tight">New Group</h2>
                <Button onClick={handleCreateGroup} disabled={!groupName || selectedUsers.length === 0} className="rounded-full px-8 font-black shadow-lg shadow-sky-500/10">Create</Button>
              </header>
              <div className="p-6 sm:p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-neutral-500 uppercase tracking-widest px-1">Group Details</label>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/5 border border-dashed border-white/20 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors shrink-0">
                       <Camera className="w-6 h-6 text-neutral-500" />
                    </div>
                    <input 
                      autoFocus
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      placeholder="Give it a name..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-lg font-bold outline-none focus:border-sky-500/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
                  <label className="text-xs font-black text-neutral-500 uppercase tracking-widest px-1">Add Members ({selectedUsers.length})</label>
                  
                  {/* Search Bar for Members */}
                  <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-sky-500 transition-colors" />
                    <input
                      type="text"
                      value={groupSearchQuery}
                      onChange={(e) => setGroupSearchQuery(e.target.value)}
                      placeholder="Search friends..."
                      className="w-full bg-[#202327] rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none placeholder-neutral-500 focus:bg-transparent focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  <div className="space-y-1 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
                    {filteredGroupFriends.length > 0 ? filteredGroupFriends.map(u => (
                      <div 
                        key={u.id}
                        onClick={() => toggleUserSelection(u.id)}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-2xl cursor-pointer border transition-all",
                          selectedUsers.includes(u.id) ? "bg-sky-500/10 border-sky-500 shadow-md" : "hover:bg-white/5 border-transparent"
                        )}
                      >
                         <div className="flex items-center space-x-3 min-w-0">
                            <Avatar className="w-11 h-11 border border-white/5 shadow-sm shrink-0"><AvatarImage src={u.avatar} /></Avatar>
                            <div className="min-w-0">
                               <p className="font-bold text-[15px] truncate">{u.name}</p>
                               <p className="text-[11px] text-neutral-500 font-bold uppercase tracking-tighter truncate">{u.handle}</p>
                            </div>
                         </div>
                         <div className={cn(
                           "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                           selectedUsers.includes(u.id) ? "bg-sky-500 border-sky-500" : "border-white/20"
                         )}>
                           {selectedUsers.includes(u.id) && <Check className="w-3.5 h-3.5 text-white stroke-[4px]" />}
                         </div>
                      </div>
                    )) : (
                      <div className="p-8 text-center text-neutral-500 text-sm italic">No friends found.</div>
                    )}
                  </div>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const SettingsIconButton = ({ icon, label, onClick }: any) => (
  <button onClick={onClick} className="flex flex-col items-center space-y-2 group transition-transform active:scale-95">
    <div className="p-3.5 rounded-full bg-white/[0.03] border border-white/5 group-hover:bg-white/10 transition-colors shadow-sm">
      {icon}
    </div>
    <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{label}</span>
  </button>
);

const SettingsRow = ({ icon, label, rightText, rightAction, onClick }: any) => (
  <div 
    onClick={onClick}
    className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.04] transition-all cursor-pointer group"
  >
    <div className="flex items-center space-x-3">
       <div className="text-neutral-500 group-hover:text-white transition-colors">{icon}</div>
       <span className="text-sm font-bold text-neutral-300 group-hover:text-white transition-colors">{label}</span>
    </div>
    <div className="flex items-center">
      {rightText && <span className="text-xs text-sky-500 font-black mr-2 uppercase tracking-widest">{rightText}</span>}
      {rightAction ? rightAction : <ChevronRight className="w-4 h-4 text-neutral-700" />}
    </div>
  </div>
);

const Toggle = ({ active, onToggle }: { active: boolean, onToggle: () => void }) => (
  <div 
    onClick={(e) => { e.stopPropagation(); onToggle(); }}
    className={cn(
      "w-10 h-6 rounded-full relative transition-colors cursor-pointer border border-white/5 shadow-sm",
      active ? "bg-sky-500" : "bg-neutral-800"
    )}
  >
    <div className={cn(
      "absolute top-1 w-3.5 h-3.5 bg-white rounded-full transition-all shadow-md",
      active ? "left-5.5" : "left-1"
    )} style={{ left: active ? '22px' : '4px' }} />
  </div>
);

export default Messages;
