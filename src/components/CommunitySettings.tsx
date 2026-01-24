
import React, { useState } from 'react';
import { Community } from '../types';
import { 
  ChevronLeft, Bell, BellOff, Shield, BookOpen, LogOut, 
  ChevronRight, Info, Check, Globe, Lock, Users, 
  Eye, FileCheck, UserPlus, Settings, Ban, Trash2, 
  Activity, Sparkles, Plus
} from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from './ui/Avatar';

interface CommunitySettingsProps {
  community: Community;
  onBack: () => void;
  onLeave: (id: string) => void;
}

const CommunitySettings: React.FC<CommunitySettingsProps> = ({ community, onBack, onLeave }) => {
  const [notifications, setNotifications] = useState(true);
  const [requirePostApproval, setRequirePostApproval] = useState(community.requirePostApproval || false);
  const [memberVisibility, setMemberVisibility] = useState(community.memberVisibility ?? true);
  const [discoveryEnabled, setDiscoveryEnabled] = useState(true);
  const [privacyType, setPrivacyType] = useState(community.privacyType || 'public');
  const [activeSection, setActiveSection] = useState<'general' | 'moderation' | 'rules'>('general');

  const Toggle = ({ active, onToggle }: { active: boolean, onToggle: () => void }) => (
    <div 
      onClick={onToggle}
      className={cn(
        "w-11 h-6 rounded-full relative transition-all cursor-pointer duration-300",
        active ? "bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.3)]" : "bg-neutral-800"
      )}
    >
      <div className={cn(
        "absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-md",
        active ? "left-6" : "left-1"
      )} />
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-black animate-in fade-in duration-300">
      <header className="sticky top-0 z-40 glass-header border-b border-white/[0.08] px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-black tracking-tight">Settings</h1>
        </div>
        <Button variant="ghost" className="text-sky-500 font-bold hover:bg-sky-500/10 px-4 rounded-xl">Save</Button>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col md:flex-row">
        {/* Navigation Sidebar */}
        <div className="w-full md:w-64 border-r border-white/5 p-4 space-y-1">
           <NavButton active={activeSection === 'general'} onClick={() => setActiveSection('general')} icon={<Settings className="w-4 h-4" />} label="General" />
           <NavButton active={activeSection === 'moderation'} onClick={() => setActiveSection('moderation')} icon={<Shield className="w-4 h-4" />} label="Moderation" />
           <NavButton active={activeSection === 'rules'} onClick={() => setActiveSection('rules')} icon={<BookOpen className="w-4 h-4" />} label="Community Rules" />
        </div>

        <div className="flex-1 p-4 sm:p-8 space-y-10 pb-20">
          {activeSection === 'general' && (
            <div className="space-y-10 animate-in slide-in-from-right-4 duration-300">
              <section>
                <h3 className="px-2 mb-6 text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Appearance & Identity</h3>
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-[32px] p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-16 h-16 rounded-2xl border-2 border-white/10 shadow-xl">
                        <AvatarImage src={community.avatar} />
                        <AvatarFallback>{community.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-lg">{community.name}</p>
                        <p className="text-neutral-500 text-sm">@{community.handle}</p>
                      </div>
                    </div>
                    <Button variant="outline" className="rounded-2xl h-10 border-white/10 font-bold px-6">Change Avatar</Button>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-neutral-500 uppercase px-1">About</label>
                    <textarea 
                      defaultValue={community.description}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm font-medium outline-none focus:border-sky-500 transition-all h-24 resize-none"
                    />
                  </div>
                </div>
              </section>

              <section>
                <h3 className="px-2 mb-6 text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Community Privacy</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <PrivacyCard 
                    selected={privacyType === 'public'} 
                    onClick={() => setPrivacyType('public')} 
                    icon={<Globe className="w-5 h-5" />} 
                    title="Public" 
                    desc="Anyone can see and join." 
                  />
                  <PrivacyCard 
                    selected={privacyType === 'restricted'} 
                    onClick={() => setPrivacyType('restricted')} 
                    icon={<Users className="w-5 h-5" />} 
                    title="Restricted" 
                    desc="Join by approval only." 
                  />
                  <PrivacyCard 
                    selected={privacyType === 'private'} 
                    onClick={() => setPrivacyType('private')} 
                    icon={<Lock className="w-5 h-5" />} 
                    title="Private" 
                    desc="Invite only visibility." 
                  />
                </div>
              </section>

              <section>
                <h3 className="px-2 mb-6 text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Preferences</h3>
                <div className="space-y-4">
                  <SettingRow 
                    icon={<Bell className="w-5 h-5 text-sky-500" />} 
                    title="Notifications" 
                    desc="Enable alerts for new activity." 
                    control={<Toggle active={notifications} onToggle={() => setNotifications(!notifications)} />} 
                  />
                  <SettingRow 
                    icon={<Eye className="w-5 h-5 text-emerald-500" />} 
                    title="Discovery" 
                    desc="Show this community in suggested feeds." 
                    control={<Toggle active={discoveryEnabled} onToggle={() => setDiscoveryEnabled(!discoveryEnabled)} />} 
                  />
                  <SettingRow 
                    icon={<Users className="w-5 h-5 text-rose-500" />} 
                    title="Member Visibility" 
                    desc="Allow members to see each other." 
                    control={<Toggle active={memberVisibility} onToggle={() => setMemberVisibility(!memberVisibility)} />} 
                  />
                </div>
              </section>
            </div>
          )}

          {activeSection === 'moderation' && (
            <div className="space-y-10 animate-in slide-in-from-right-4 duration-300">
               <section>
                 <div className="p-8 bg-gradient-to-tr from-sky-500/10 to-indigo-500/10 rounded-[40px] border border-white/5 mb-8 relative overflow-hidden">
                    <div className="relative z-10 space-y-4">
                       <div className="w-12 h-12 bg-sky-500 rounded-2xl flex items-center justify-center shadow-lg"><Activity className="w-6 h-6 text-white" /></div>
                       <h2 className="text-2xl font-black tracking-tight">Moderation Hub</h2>
                       <p className="text-neutral-400 text-sm font-medium max-w-sm">Manage post approvals, flags, and restricted members to keep the community safe.</p>
                    </div>
                    <Sparkles className="absolute -right-10 -bottom-10 w-48 h-48 text-sky-500 opacity-5" />
                 </div>

                 <div className="space-y-4">
                    <SettingRow 
                      icon={<FileCheck className="w-5 h-5 text-sky-500" />} 
                      title="Post Approval" 
                      desc="Moderators must approve all new posts." 
                      control={<Toggle active={requirePostApproval} onToggle={() => setRequirePostApproval(!requirePostApproval)} />} 
                    />
                    <div className="flex items-center justify-between p-5 bg-white/[0.03] border border-white/[0.08] rounded-[28px] hover:bg-white/[0.05] transition-all cursor-pointer group">
                       <div className="flex items-center space-x-4">
                         <div className="p-2.5 rounded-2xl bg-neutral-800 text-neutral-400 group-hover:bg-sky-500 group-hover:text-white transition-all"><Users className="w-5 h-5" /></div>
                         <div>
                            <p className="font-bold text-[16px]">Member Requests</p>
                            <p className="text-xs text-neutral-500 font-medium">12 pending applications</p>
                         </div>
                       </div>
                       <ChevronRight className="w-5 h-5 text-neutral-700" />
                    </div>
                    <div className="flex items-center justify-between p-5 bg-white/[0.03] border border-white/[0.08] rounded-[28px] hover:bg-white/[0.05] transition-all cursor-pointer group">
                       <div className="flex items-center space-x-4">
                         <div className="p-2.5 rounded-2xl bg-neutral-800 text-neutral-400 group-hover:bg-rose-500 group-hover:text-white transition-all"><Ban className="w-5 h-5" /></div>
                         <div>
                            <p className="font-bold text-[16px]">Banned Members</p>
                            <p className="text-xs text-neutral-500 font-medium">Manage restricted accounts</p>
                         </div>
                       </div>
                       <ChevronRight className="w-5 h-5 text-neutral-700" />
                    </div>
                 </div>
               </section>
            </div>
          )}

          {activeSection === 'rules' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
               <div className="flex items-center justify-between">
                 <h3 className="text-xl font-black tracking-tight">Community Rules</h3>
                 <Button size="sm" className="rounded-xl h-9 px-6 bg-white text-black hover:bg-neutral-200"><Plus className="w-4 h-4 mr-2" /> Add Rule</Button>
               </div>
               <div className="space-y-4">
                 {[1,2,3].map(i => (
                   <div key={i} className="p-6 bg-white/[0.03] border border-white/[0.08] rounded-[32px] group relative hover:border-white/20 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest">Rule #{i}</span>
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-white"><Settings className="w-4 h-4" /></Button>
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500 hover:bg-rose-500/10"><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </div>
                      <h4 className="font-bold text-lg mb-1">Rule title here</h4>
                      <p className="text-sm text-neutral-500 font-medium leading-relaxed">Description of why this rule exists and how to follow it within the community context.</p>
                   </div>
                 ))}
               </div>
            </div>
          )}

          <section className="pt-10 border-t border-white/5">
            <h3 className="px-2 mb-6 text-[10px] font-black text-rose-500 uppercase tracking-[0.2em]">Danger Zone</h3>
            <Button 
              variant="outline" 
              className="w-full h-16 rounded-[28px] border-rose-500/20 text-rose-500 hover:bg-rose-500/10 hover:border-rose-500 font-black text-lg transition-all"
              onClick={() => onLeave(community.id)}
            >
              <LogOut className="w-6 h-6 mr-3" />
              Leave Community
            </Button>
            <p className="text-center text-[10px] text-neutral-600 font-bold uppercase tracking-widest mt-4">
              Action cannot be undone for private communities.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "w-full flex items-center space-x-3 p-3.5 rounded-2xl transition-all font-bold text-sm",
      active ? "bg-sky-500/10 text-sky-500 shadow-sm" : "text-neutral-500 hover:bg-white/5 hover:text-neutral-200"
    )}
  >
    <span className={active ? "text-sky-500" : "text-neutral-600"}>{icon}</span>
    <span>{label}</span>
  </button>
);

const SettingRow = ({ icon, title, desc, control }: any) => (
  <div className="flex items-center justify-between p-5 bg-white/[0.03] border border-white/[0.08] rounded-[28px] hover:bg-white/[0.05] transition-all">
    <div className="flex items-center space-x-4">
      <div className="p-2.5 rounded-2xl bg-neutral-800 shadow-inner">{icon}</div>
      <div>
        <p className="font-bold text-[16px]">{title}</p>
        <p className="text-xs text-neutral-500 font-medium">{desc}</p>
      </div>
    </div>
    {control}
  </div>
);

const PrivacyCard = ({ selected, onClick, icon, title, desc }: any) => (
  <div 
    onClick={onClick}
    className={cn(
      "p-5 rounded-[28px] border cursor-pointer transition-all flex flex-col items-center text-center space-y-3",
      selected ? "border-sky-500 bg-sky-500/5 shadow-[0_0_20px_rgba(14,165,233,0.1)]" : "border-white/[0.08] hover:bg-white/[0.03] hover:border-white/20"
    )}
  >
    <div className={cn("p-3 rounded-2xl transition-all", selected ? "bg-sky-500 text-white" : "bg-neutral-800 text-neutral-500")}>
      {icon}
    </div>
    <div>
      <h4 className="font-black text-sm uppercase tracking-widest">{title}</h4>
      <p className="text-[11px] text-neutral-500 font-bold mt-1 leading-tight">{desc}</p>
    </div>
    {selected && <div className="p-1 bg-sky-500 rounded-full"><Check className="w-3 h-3 text-white" /></div>}
  </div>
);

export default CommunitySettings;
