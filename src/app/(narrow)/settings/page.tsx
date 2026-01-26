'use client';
import React, { useState, useEffect } from 'react';
import { 
  Settings, User, Bell, Shield, Eye, HelpCircle, Moon, Sun, Monitor, 
  ChevronRight, Globe, Lock, Check, Smartphone, Accessibility, 
  Ban, Database, Activity, EyeOff, Key, Fingerprint, 
  SmartphoneNfc, UserX, AlertTriangle, ShieldCheck, 
  Languages, Search, Trash2, LogOut, ChevronLeft, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { CURRENT_USER } from '@/lib/constants';
import { cn } from '@/lib/utils';


const SettingsPage  = () => {
  const [activeTab, setActiveTab] = useState<'General' | 'Account' | 'Privacy' | 'Security' | 'Notifications'>('General');
  const [twoFactor, setTwoFactor] = useState(false);
  const [dataSaver, setDataSaver] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [sensitiveContent, setSensitiveContent] = useState(false);
  
  // Notification states
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(false);
  
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const Toggle = ({ active, onToggle }: { active: boolean, onToggle: () => void }) => (
    <div 
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      className={cn(
        "w-11 h-6 rounded-full relative transition-all cursor-pointer duration-300",
        active ? "bg-sky-500 shadow-[0_0_10px_rgba(29,155,240,0.4)]" : "bg-neutral-800"
      )}
    >
      <div className={cn(
        "absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-md",
        active ? "left-6" : "left-1"
      )} />
    </div>
  );

  const renderAccount = () => (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
       <section>
          <h2 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] px-2 mb-4">Account Information</h2>
          <div className="bg-white/[0.03] rounded-[32px] border border-white/[0.08] overflow-hidden divide-y divide-white/5">
             <SettingsRow icon={<User className="w-5 h-5" />} label="Username" rightText={CURRENT_USER.handle} />
             <SettingsRow icon={<Globe className="w-5 h-5" />} label="Email" rightText="dev@nexushub.com" />
             <SettingsRow icon={<Languages className="w-5 h-5" />} label="Display Language" rightText="English (US)" />
             <SettingsRow icon={<ShieldCheck className="w-5 h-5" />} label="Verification" rightText="Approved" />
          </div>
       </section>

       <section>
          <h2 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] px-2 mb-4">Danger Zone</h2>
          <button 
            onClick={() => setShowDeactivateConfirm(true)}
            className="w-full flex items-center justify-between p-5 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 rounded-[28px] transition-all group"
          >
             <div className="flex items-center space-x-4">
                <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-500 group-hover:scale-110 transition-transform"><UserX className="w-5 h-5" /></div>
                <div className="text-left">
                   <p className="font-bold text-rose-500 text-lg">Deactivate Account</p>
                   <p className="text-xs text-rose-400 font-medium">Temporarily disable your profile</p>
                </div>
             </div>
             <ChevronRight className="w-5 h-5 text-rose-700" />
          </button>
       </section>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
       <div className="p-8 bg-gradient-to-tr from-sky-500/10 to-purple-500/10 rounded-[40px] border border-white/5 mb-8 relative overflow-hidden">
          <div className="relative z-10 space-y-4">
             <div className="w-12 h-12 bg-sky-500 rounded-2xl flex items-center justify-center shadow-lg"><Shield className="w-6 h-6 text-white" /></div>
             <h2 className="text-2xl font-black tracking-tight">Security Checkup</h2>
             <p className="text-neutral-400 text-sm font-medium max-w-sm">Keep your account secure with advanced protection tools and login alerts.</p>
          </div>
          <Fingerprint className="absolute -right-10 -bottom-10 w-48 h-48 text-sky-500 opacity-5" />
       </div>

       <section>
          <h2 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] px-2 mb-4">Account Access</h2>
          <div className="bg-white/[0.03] rounded-[32px] border border-white/[0.08] overflow-hidden divide-y divide-white/5">
             <SettingsRow icon={<Key className="w-5 h-5" />} label="Change Password" description="Last changed 3 months ago" />
             <SettingsRow 
                icon={<SmartphoneNfc className="w-5 h-5 text-emerald-500" />} 
                label="Two-Factor Authentication" 
                description="Secure login via SMS or App"
                toggle={<Toggle active={twoFactor} onToggle={() => { setTwoFactor(!twoFactor); showToast(`2FA ${!twoFactor ? 'Enabled' : 'Disabled'}`); }} />} 
             />
             <SettingsRow icon={<Database className="w-5 h-5" />} label="Connected Apps" rightText="12 Active" />
          </div>
       </section>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background animate-in fade-in duration-300">
      <header className="sticky top-0 z-40 glass-header border-b border-white/[0.08] px-6 py-6 flex items-center justify-between">
        <h1 className="text-2xl font-black tracking-tighter">Settings</h1>
        <Button variant="ghost" size="icon" className="rounded-full"><Search className="w-5 h-5 text-neutral-400" /></Button>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        <section className="p-6">
          <div className="flex items-center space-x-5 bg-white/[0.03] p-6 rounded-[32px] border border-white/[0.08] shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Avatar className="w-20 h-20 border-2 border-white/10 ring-4 ring-sky-500/5 shadow-xl">
              <AvatarImage src={CURRENT_USER.avatar} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-black text-xl leading-tight">{CURRENT_USER.name}</h3>
                {isPrivate && <Lock className="w-4 h-4 text-sky-500" />}
              </div>
              <p className="text-neutral-500 font-bold uppercase text-[10px] tracking-widest mt-1">Nexus Prime Member</p>
            </div>
            <Button variant="outline" className="rounded-2xl h-10 px-6 font-bold border-white/10 hover:border-sky-500/30">Switch</Button>
          </div>
        </section>

        <div className="flex px-4 py-2 border-b border-white/[0.08] overflow-x-auto no-scrollbar sticky top-[72px] glass-header z-30">
          {['General', 'Account', 'Privacy', 'Security', 'Notifications'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={cn(
                "rounded-full mr-2 h-10 px-8 shrink-0 font-black uppercase text-[10px] tracking-widest transition-all",
                activeTab === tab ? "bg-white text-black shadow-xl" : "text-neutral-500 hover:text-neutral-300"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-10">
          {activeTab === 'General' && (
            <div className="space-y-10 animate-in slide-in-from-left-4 duration-300">
              <section>
                <h2 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] px-2 mb-4">Display & Visuals</h2>
                <div className="space-y-4">
                  <div className="bg-white/[0.03] rounded-[32px] p-8 border border-white/[0.08] flex items-center justify-between">
                    <div>
                      <p className="font-black text-lg tracking-tight">App Theme</p>
                      <p className="text-xs text-neutral-500 font-medium">Automatic system switching available</p>
                    </div>
                    <div className="flex bg-neutral-900 rounded-2xl p-1 border border-white/5">
                      <button onClick={() => { setTheme('light'); showToast('Switched to Light Mode'); }} className={cn("flex items-center px-6 py-2.5 rounded-xl text-xs font-black transition-all", theme === 'light' ? "bg-white text-black shadow-2xl" : "text-neutral-500 hover:text-neutral-300")}>
                        <Sun className="w-4 h-4 mr-2" /> Light
                      </button>
                      <button onClick={() => { setTheme('dark'); showToast('Switched to Dark Mode'); }} className={cn("flex items-center px-6 py-2.5 rounded-xl text-xs font-black transition-all", theme === 'dark' ? "bg-sky-500 text-white shadow-2xl" : "text-neutral-500 hover:text-neutral-300")}>
                        <Moon className="w-4 h-4 mr-2" /> Dark
                      </button>
                    </div>
                  </div>

                  
                </div>
              </section>
              
              <section>
                <h2 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] px-2 mb-4">Usage & Accessibility</h2>
                <div className="bg-white/[0.03] rounded-[32px] border border-white/[0.08] overflow-hidden divide-y divide-white/5">
                  <SettingsRow 
                    icon={<Smartphone className="w-5 h-5 text-sky-500" />} 
                    label="Haptic Feedback" 
                    description="Vibrate device on key interactions" 
                    toggle={<Toggle active={true} onToggle={() => showToast('Haptics Toggled')} />} 
                  />
                  <SettingsRow 
                    icon={<Database className="w-5 h-5 text-emerald-500" />} 
                    label="Data Saver" 
                    description="Reduce image quality to save bandwidth" 
                    toggle={<Toggle active={dataSaver} onToggle={() => { setDataSaver(!dataSaver); showToast(`Data Saver ${!dataSaver ? 'ON' : 'OFF'}`); }} />} 
                  />
                </div>
              </section>
            </div>
          )}

          {activeTab === 'Privacy' && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
               <section>
                  <h2 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] px-2 mb-4">Content Safety</h2>
                  <div className="bg-white/[0.03] rounded-[32px] border border-white/[0.08] overflow-hidden divide-y divide-white/5">
                     <SettingsRow 
                        icon={<EyeOff className="w-5 h-5 text-rose-500" />} 
                        label="Filter Sensitive Content" 
                        description="Automatically blur media that may contain sensitive content"
                        toggle={<Toggle active={sensitiveContent} onToggle={() => { setsensitiveContent(!sensitiveContent); showToast('Content filter updated'); }} />} 
                     />
                     <SettingsRow 
                        icon={<Lock className="w-5 h-5 text-sky-500" />} 
                        label="Private Account" 
                        description="Only followers can see your posts and media"
                        toggle={<Toggle active={isPrivate} onToggle={() => { setIsPrivate(!isPrivate); showToast(`Account is now ${!isPrivate ? 'Private' : 'Public'}`); }} />} 
                     />
                     <SettingsRow icon={<Ban className="w-5 h-5 text-neutral-500" />} label="Blocked Accounts" rightText="14 Blocked" />
                     <SettingsRow icon={<Users className="w-5 h-5 text-sky-500" />} label="Audience & Tagging" description="Manage who can mention or tag you" />
                  </div>
               </section>

               <section>
                  <h2 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] px-2 mb-4">Data Discovery</h2>
                  <div className="bg-white/[0.03] rounded-[32px] border border-white/[0.08] overflow-hidden divide-y divide-white/5">
                     <SettingsRow icon={<Monitor className="w-5 h-5" />} label="Ad Preferences" description="Manage data used for tailored ads" />
                     <SettingsRow icon={<Accessibility className="w-5 h-5" />} label="Searchability" description="Allow search engines to index profile" toggle={<Toggle active={true} onToggle={() => {}} />} />
                  </div>
               </section>
            </div>
          )}

          {activeTab === 'Account' && renderAccount()}
          {activeTab === 'Security' && renderSecurity()}
          {activeTab === 'Notifications' && (
            <div className="space-y-8 animate-in slide-in-from-top-4 duration-300">
               <section>
                  <h2 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] px-2 mb-4">Preferences</h2>
                  <div className="bg-white/[0.03] rounded-[32px] border border-white/[0.08] overflow-hidden divide-y divide-white/5">
                     <SettingsRow label="Push Notifications" toggle={<Toggle active={pushEnabled} onToggle={() => { setPushEnabled(!pushEnabled); showToast('Push settings updated'); }} />} />
                     <SettingsRow label="Email Notifications" toggle={<Toggle active={emailEnabled} onToggle={() => { setEmailEnabled(!emailEnabled); showToast('Email settings updated'); }} />} />
                     <SettingsRow label="SMS Notifications" toggle={<Toggle active={smsEnabled} onToggle={() => { setSmsEnabled(!smsEnabled); showToast('SMS settings updated'); }} />} />
                  </div>
               </section>
               <section>
                  <h2 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] px-2 mb-4">Activity Specifics</h2>
                  <div className="bg-white/[0.03] rounded-[32px] border border-white/[0.08] overflow-hidden divide-y divide-white/5">
                     <SettingsRow label="Likes" rightText="All" />
                     <SettingsRow label="Reposts" rightText="Following" />
                     <SettingsRow label="Direct Messages" rightText="All" />
                     <SettingsRow label="New Followers" toggle={<Toggle active={true} onToggle={() => {}} />} />
                  </div>
               </section>
            </div>
          )}
        </div>
      </div>

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] bg-white text-black font-black px-6 py-3 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4 flex items-center space-x-3">
           <Check className="w-4 h-4 text-emerald-600" />
           <span className="text-sm">{toast}</span>
        </div>
      )}

      {/* Deactivation Modal Overlay */}
      {showDeactivateConfirm && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="bg-[#1c1c1c] w-full max-w-md rounded-[32px] border border-white/10 p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto"><AlertTriangle className="w-8 h-8 text-rose-500" /></div>
              <div className="text-center space-y-2">
                 <h3 className="text-2xl font-black tracking-tight">Deactivate account?</h3>
                 <p className="text-neutral-500 text-sm leading-relaxed">This will temporarily hide your profile, posts, and likes. You can restore your account within 30 days.</p>
              </div>
              <div className="flex flex-col space-y-3">
                 <Button className="w-full h-12 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black">Yes, deactivate</Button>
                 <Button variant="ghost" onClick={() => setShowDeactivateConfirm(false)} className="w-full h-12 rounded-2xl text-neutral-500 font-bold uppercase tracking-widest text-[10px]">Cancel</Button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const SettingsRow = ({ icon, label, description, rightText, toggle, onClick }: any) => (
  <div 
    onClick={onClick}
    className="flex items-center justify-between p-5 hover:bg-white/[0.03] transition-all cursor-pointer group"
  >
    <div className="flex items-center space-x-4">
      {icon && <div className="p-2 rounded-xl bg-neutral-900 text-neutral-500 group-hover:text-sky-500 transition-colors">{icon}</div>}
      <div>
        <p className="font-bold text-[15px] group-hover:text-white transition-colors">{label}</p>
        {description && <p className="text-xs text-neutral-500 font-medium">{description}</p>}
      </div>
    </div>
    <div className="flex items-center space-x-2">
       {rightText && <span className="text-xs text-sky-500 font-black uppercase tracking-widest mr-1">{rightText}</span>}
       {toggle ? toggle : <ChevronRight className="w-4 h-4 text-neutral-700" />}
    </div>
  </div>
);

export default SettingsPage;
