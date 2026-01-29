'use client';
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, DollarSign, Users, Award, 
  ChevronRight, Sparkles, AlertCircle, CheckCircle2, 
  PieChart, Wallet, Settings, Landmark, Info, 
  ArrowLeft, Monitor, Heart, MousePointer2, 
  UserCheck, ShieldCheck, CreditCard, ChevronDown,
  Globe, Briefcase, FileText, Ban, Trash2, Smartphone
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { User } from '@/types/user';
import { MOCK_USERS } from '@/lib/constants';


const CATEGORIES = ['Technology', 'Gaming', 'Art & Design', 'Education', 'Lifestyle', 'Entertainment', 'Finance'];
const PAYOUT_METHODS = [
  { id: 'bank', icon: <Landmark className="w-5 h-5" />, label: 'Direct Bank Transfer', desc: 'Secure transfer to your local account' },
  { id: 'paypal', icon: <CreditCard className="w-5 h-5" />, label: 'PayPal', desc: 'Fast, worldwide payments' },
  { id: 'stripe', icon: <Globe className="w-5 h-5" />, label: 'Stripe Connect', desc: 'Best for professional creators' }
];

const CreatorStudio = () => {
    const user = MOCK_USERS[0];
  const [activeTab, setActiveTab] = useState<'analytics' | 'monetization' | 'payouts' | 'settings'>('analytics');
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [isApplying, setIsApplying] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('');
  const [timeRange, setTimeRange] = useState('28d');
  
  // Analytics sub-view
  const [analyticsView, setAnalyticsView] = useState<'overview' | 'content'>('overview');

  const criteria = {
    followers: { current: 12400, target: 10000 },
    views: { current: 4200000, target: 5000000 },
    consistency: { current: 12, target: 10 } // Posts in 30 days
  };

  const isEligible = criteria.followers.current >= criteria.followers.target && 
                     criteria.views.current >= criteria.views.target;

  const handleStartOnboarding = () => setOnboardingStep(1);
  const handleNextStep = () => setOnboardingStep(prev => prev + 1);
  const handlePrevStep = () => setOnboardingStep(prev => prev - 1);

  const finishOnboarding = () => {
    setIsApplying(true);
    setTimeout(() => {
      onUpgrade({ category: selectedCategory, payoutMethod });
      setIsApplying(false);
      setOnboardingStep(0);
    }, 2000);
  };

  if (!user.isCreator && onboardingStep === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-screen text-center space-y-12 animate-in fade-in duration-700">
        <div className="relative">
          <div className="absolute inset-0 bg-purple-500/20 blur-[100px] rounded-full" />
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 via-indigo-600 to-sky-500 rounded-[48px] flex items-center justify-center mx-auto shadow-[0_20px_60px_-15px_rgba(168,85,247,0.5)] relative z-10 border border-white/20">
            <Award className="w-10 h-10 text-white" />
          </div>
        </div>
        
        <div className="max-w-xl space-y-4">
          <h2 className="text-5xl font-black tracking-tighter text-white lg:text-6xl">
            Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-sky-400">Tools</span> for Visionaries
          </h2>
          <p className="text-neutral-400 font-medium text-xl leading-relaxed">
            Monetize your creativity with ad revenue sharing, premium subscriptions, and verified analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-2xl">
           <BenefitCard icon={<DollarSign className="text-emerald-500" />} title="Revenue Share" desc="Earn up to 70% of the ad revenue generated on your posts." />
           <BenefitCard icon={<UserCheck className="text-sky-500" />} title="Subscriber Tiers" desc="Create exclusive content for your most dedicated fans." />
           <BenefitCard icon={<BarChart3 className="text-purple-500" />} title="Advanced Data" desc="See exactly where your impressions come from." />
           <BenefitCard icon={<ShieldCheck className="text-amber-500" />} title="Priority Support" desc="Direct access to our dedicated human moderation team." />
        </div>

        <div className="flex flex-col items-center space-y-6 pt-4">
          <Button 
            onClick={handleStartOnboarding} 
            className="h-16 text-2xl shadow-2xl shadow-purple-500/30 active:scale-95 transition-all"
          >
            Start Application
          </Button>
          <p className="text-neutral-500 text-xs font-black uppercase tracking-[0.3em]">Application takes ~2 minutes</p>
        </div>
      </div>
    );
  }

  // ONBOARDING WIZARD
  if (onboardingStep > 0) {
    return (
      <div className="flex flex-col min-h-screen bg-background animate-in slide-in-from-bottom-6 duration-500">
        <header className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur-md z-20">
          <Button variant="ghost" size="icon" onClick={handlePrevStep} className="rounded-full"><ArrowLeft className="w-6 h-6" /></Button>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={cn("h-1.5 rounded-full transition-all duration-500", onboardingStep >= i ? "w-8 bg-purple-500" : "w-4 bg-neutral-800")} />
            ))}
          </div>
          <Button variant="ghost" size="icon" onClick={() => setOnboardingStep(0)} className="rounded-full"><X className="w-6 h-6" /></Button>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
           {onboardingStep === 1 && (
             <div className="space-y-8 w-full animate-in fade-in zoom-in-95 duration-300">
                <div className="space-y-2 text-center">
                  <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-500/20">
                    <Sparkles className="w-8 h-8 text-purple-500" />
                  </div>
                  <h2 className="text-4xl font-black tracking-tight">Define your content</h2>
                  <p className="text-neutral-500 text-lg">Select the primary category for your Creator Profile.</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {CATEGORIES.map(cat => (
                    <button 
                      key={cat} 
                      onClick={() => setSelectedCategory(cat)}
                      className={cn(
                        "p-5 rounded-[24px] border-2 text-left transition-all font-bold",
                        selectedCategory === cat ? "bg-purple-500/10 border-purple-500 text-white" : "bg-white/5 border-white/5 text-neutral-400 hover:border-white/10"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <Button disabled={!selectedCategory} onClick={handleNextStep} className="w-full h-16 rounded-[24px] font-black text-xl">Continue</Button>
             </div>
           )}

           {onboardingStep === 2 && (
             <div className="space-y-8 w-full animate-in slide-in-from-right-4 duration-300">
                <div className="space-y-2 text-center">
                  <div className="w-16 h-16 bg-sky-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-sky-500/20">
                    <CheckCircle2 className="w-8 h-8 text-sky-500" />
                  </div>
                  <h2 className="text-4xl font-black tracking-tight">Monetization Check</h2>
                  <p className="text-neutral-500 text-lg">We've verified your stats meet our criteria.</p>
                </div>
                <div className="space-y-4">
                  <CriteriaCheck label="10,000+ Followers" current={criteria.followers.current} target={criteria.followers.target} met={criteria.followers.current >= criteria.followers.target} />
                  <CriteriaCheck label="5M+ Impressions" current={criteria.views.current} target={criteria.views.target} met={criteria.views.current >= criteria.views.target} />
                  <CriteriaCheck label="10+ Posts (30 Days)" current={criteria.consistency.current} target={criteria.consistency.target} met={criteria.consistency.current >= criteria.consistency.target} />
                </div>
                <Button onClick={handleNextStep} className="w-full h-16 rounded-[24px] font-black text-xl">Confirm Eligibility</Button>
             </div>
           )}

           {onboardingStep === 3 && (
             <div className="space-y-8 w-full animate-in slide-in-from-right-4 duration-300">
                <div className="space-y-2 text-center">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                    <Wallet className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h2 className="text-4xl font-black tracking-tight">Setup Payouts</h2>
                  <p className="text-neutral-500 text-lg">Where should we send your earnings?</p>
                </div>
                <div className="space-y-3">
                   {PAYOUT_METHODS.map(m => (
                     <button 
                        key={m.id} 
                        onClick={() => setPayoutMethod(m.id)}
                        className={cn(
                          "w-full p-6 rounded-[28px] border-2 flex items-center space-x-5 transition-all text-left",
                          payoutMethod === m.id ? "bg-emerald-500/10 border-emerald-500" : "bg-white/5 border-white/5 hover:bg-white/10"
                        )}
                      >
                        <div className={cn("p-3 rounded-2xl", payoutMethod === m.id ? "bg-emerald-500 text-white" : "bg-neutral-800 text-neutral-500")}>{m.icon}</div>
                        <div>
                          <p className="font-bold text-lg">{m.label}</p>
                          <p className="text-xs text-neutral-500 font-medium">{m.desc}</p>
                        </div>
                     </button>
                   ))}
                </div>
                <Button disabled={!payoutMethod} onClick={handleNextStep} className="w-full h-16 rounded-[24px] font-black text-xl bg-white text-black hover:bg-neutral-200">Review Terms</Button>
             </div>
           )}

           {onboardingStep === 4 && (
             <div className="space-y-8 w-full animate-in slide-in-from-right-4 duration-300">
                <div className="space-y-2 text-center">
                  <h2 className="text-4xl font-black tracking-tight">One last thing...</h2>
                  <p className="text-neutral-500 text-lg">Accept the Nexus Hub Creator Agreement.</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 h-64 overflow-y-auto text-sm text-neutral-400 space-y-4 font-medium leading-relaxed no-scrollbar">
                   <p className="text-white font-bold">1. Revenue Split</p>
                   <p>Creators receive 70% of ad revenue generated on their content. Subscription revenue is shared 85/15 in favor of the creator.</p>
                   <p className="text-white font-bold">2. Compliance</p>
                   <p>Content must adhere to safety guidelines. Any violation may result in immediate monetization suspension.</p>
                   <p className="text-white font-bold">3. Payout Schedule</p>
                   <p>Payments are processed on the 15th of every month once the $50 USD threshold is met.</p>
                </div>
                <div className="flex flex-col space-y-4">
                  <Button onClick={finishOnboarding} disabled={isApplying} className="w-full h-16 rounded-[24px] font-black text-xl bg-purple-600 hover:bg-purple-500 text-white">
                    {isApplying ? "Submitting Application..." : "Accept & Finalize"}
                  </Button>
                  <p className="text-center text-[10px] text-neutral-600 font-black uppercase tracking-widest">Applying will verify your tax residency simulation</p>
                </div>
             </div>
           )}
        </main>
      </div>
    );
  }

  // MAIN STUDIO VIEW
  return (
    <div className="flex flex-col min-h-screen bg-black animate-in fade-in duration-300">
      <header className="sticky top-0 z-30 glass-header border-b border-white/[0.08] px-6 pt-8 pb-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-5">
             <div className="p-3 bg-purple-500/10 rounded-3xl border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.1)]">
               <BarChart3 className="w-8 h-8 text-purple-500" />
             </div>
             <div>
               <h1 className="text-3xl font-black tracking-tighter">Creator Studio</h1>
               <div className="flex items-center space-x-2 mt-1">
                 <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border border-emerald-500/20">Professional</span>
                 <span className="text-neutral-600 text-[10px] font-black uppercase tracking-widest">• Verified Creator</span>
               </div>
             </div>
          </div>
          <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/10">
             {['7d', '28d', '90d'].map(t => (
               <button 
                 key={t} 
                 onClick={() => setTimeRange(t)}
                 className={cn("px-4 py-1.5 rounded-full text-[10px] font-black transition-all", timeRange === t ? "bg-white text-black shadow-lg" : "text-neutral-500 hover:text-white")}
               >
                 {t.toUpperCase()}
               </button>
             ))}
          </div>
        </div>

        <nav className="flex space-x-8">
           <TabButton active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} label="Analytics" />
           <TabButton active={activeTab === 'monetization'} onClick={() => setActiveTab('monetization')} label="Monetization" />
           <TabButton active={activeTab === 'payouts'} onClick={() => setActiveTab('payouts')} label="Payouts" />
           <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} label="Settings" />
        </nav>
      </header>

      <div className="flex-1 p-6 space-y-10 overflow-y-auto no-scrollbar pb-32">
        {activeTab === 'analytics' && (
          <div className="space-y-10 animate-in slide-in-from-left-4 duration-300">
            {/* Analytics Navigation */}
            <div className="flex items-center space-x-1 bg-white/5 p-1 rounded-2xl w-fit border border-white/5">
               <button onClick={() => setAnalyticsView('overview')} className={cn("px-6 py-2 rounded-xl text-xs font-black transition-all", analyticsView === 'overview' ? "bg-neutral-800 text-white shadow-inner" : "text-neutral-500 hover:text-neutral-300")}>Overview</button>
               <button onClick={() => setAnalyticsView('content')} className={cn("px-6 py-2 rounded-xl text-xs font-black transition-all", analyticsView === 'content' ? "bg-neutral-800 text-white shadow-inner" : "text-neutral-500 hover:text-neutral-300")}>Content</button>
            </div>

            {analyticsView === 'overview' ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard icon={<TrendingUp />} label="Total Views" value="4.2M" trend="+12.5%" trendType="up" />
                  <StatCard icon={<Users />} label="Follower Gain" value="+1,242" trend="+3.2%" trendType="up" />
                  <StatCard icon={<MousePointer2 />} label="Profile Visits" value="45K" trend="-2.1%" trendType="down" />
                  <StatCard icon={<Heart />} label="Engagement" value="5.8%" trend="+0.4%" trendType="up" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                   <div className="lg:col-span-2 bg-white/[0.03] border border-white/[0.08] rounded-[32px] p-8 space-y-8 shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                         <TrendingUp className="w-48 h-48 text-purple-500" />
                      </div>
                      <div className="relative z-10 flex items-center justify-between">
                        <div>
                           <h3 className="text-xl font-black tracking-tight">Growth Trend</h3>
                           <p className="text-neutral-500 text-sm font-medium">Daily impressions over selected time range</p>
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-full text-neutral-500"><Info className="w-5 h-5" /></Button>
                      </div>
                      
                      <div className="h-56 flex items-end justify-between space-x-1.5 pt-4">
                         {[35, 60, 40, 75, 55, 90, 100, 85, 65, 110, 130, 95, 80, 120].map((h, i) => (
                           <div key={i} className="flex-1 group/bar relative">
                              <div 
                                style={{ height: `${h}%` }} 
                                className="bg-purple-600/20 group-hover/bar:bg-purple-500 group-hover/bar:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all rounded-t-lg border-t border-purple-500/40"
                              />
                              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
                                {h}K Impressions
                              </div>
                           </div>
                         ))}
                      </div>
                      <div className="flex justify-between px-1">
                        <span className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Feb 1</span>
                        <span className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Feb 14</span>
                        <span className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Feb 28</span>
                      </div>
                   </div>

                   <div className="bg-white/[0.03] border border-white/[0.08] rounded-[32px] p-8 flex flex-col justify-between">
                      <div className="space-y-6">
                        <h3 className="text-xl font-black tracking-tight">Audience Demo</h3>
                        <div className="space-y-4">
                          <AudienceBar label="Organic Reach" percent={78} color="bg-purple-500" />
                          <AudienceBar label="Discoveries" percent={45} color="bg-sky-500" />
                          <AudienceBar label="Search Grounding" percent={22} color="bg-emerald-500" />
                        </div>
                      </div>
                      <div className="pt-8 mt-8 border-t border-white/5">
                        <div className="flex items-center justify-between mb-2">
                           <span className="text-xs font-bold text-neutral-500">Gender Mix</span>
                           <span className="text-xs font-black text-white">62% M / 38% F</span>
                        </div>
                        <div className="h-2 w-full flex rounded-full overflow-hidden">
                           <div className="bg-purple-500 h-full w-[62%]" />
                           <div className="bg-rose-500 h-full w-[38%]" />
                        </div>
                      </div>
                   </div>
                </div>
              </>
            ) : (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                 <h3 className="px-2 text-xs font-black text-neutral-500 uppercase tracking-[0.2em]">Individual Content Performance</h3>
                 <div className="bg-white/[0.03] border border-white/[0.08] rounded-[32px] overflow-hidden">
                    <table className="w-full text-left">
                       <thead className="bg-white/[0.02] border-b border-white/5">
                          <tr className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">
                            <th className="p-5">Post</th>
                            <th className="p-5 text-right">Impressions</th>
                            <th className="p-5 text-right">Engagement</th>
                            <th className="p-5 text-right">Actions</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-white/5">
                          {[1,2,3,4,5].map(i => (
                            <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                              <td className="p-5">
                                 <div className="flex items-center space-x-4">
                                    <img src={`https://picsum.photos/seed/post${i}/200`} className="w-12 h-12 rounded-xl object-cover" />
                                    <p className="text-sm font-bold truncate max-w-[200px]">Checking out the latest AI design systems...</p>
                                 </div>
                              </td>
                              <td className="p-5 text-right font-black text-white">{(Math.random() * 100).toFixed(1)}K</td>
                              <td className="p-5 text-right font-black text-sky-500">{(Math.random() * 8 + 2).toFixed(1)}%</td>
                              <td className="p-5 text-right">
                                 <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white/5"><ChevronRight className="w-4 h-4" /></Button>
                              </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'monetization' && (
          <div className="space-y-10 animate-in slide-in-from-right-4 duration-300">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MonetizationCard 
                  title="Ad Revenue Sharing" 
                  desc="Share in the revenue generated from ads displayed in your post replies."
                  enabled={user.monetizationEnabled}
                  onToggle={onMonetize}
                  icon={<DollarSign />}
                />
                <MonetizationCard 
                  title="Fan Subscriptions" 
                  desc="Let followers pay a monthly fee for exclusive content and badges."
                  enabled={false}
                  onToggle={() => {}}
                  icon={<Heart />}
                  extra={
                    <div className="mt-4 pt-4 border-t border-white/5 space-y-4">
                       <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-neutral-500">Subscription Price</span>
                          <span className="text-lg font-black text-white">$4.99/mo</span>
                       </div>
                       <input type="range" className="w-full accent-purple-500" />
                    </div>
                  }
                />
             </div>

             <section className="space-y-6">
                <h3 className="px-2 text-xs font-black text-neutral-500 uppercase tracking-[0.2em]">Monetization Settings</h3>
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-[32px] p-2 space-y-1">
                   <SettingsRow icon={<Smartphone className="w-4 h-4" />} label="Allow ads on profile" toggle={<Toggle active={true} onToggle={() => {}} />} />
                   <SettingsRow icon={<Monitor className="w-4 h-4" />} label="Premium content previews" toggle={<Toggle active={false} onToggle={() => {}} />} />
                   <SettingsRow icon={<Users className="w-4 h-4" />} label="Auto-thank new subscribers" toggle={<Toggle active={true} onToggle={() => {}} />} />
                </div>
             </section>

             <div className="bg-sky-500/5 border border-sky-500/20 rounded-[32px] p-6 flex items-start space-x-4">
                <Info className="w-6 h-6 text-sky-500 shrink-0" />
                <div className="space-y-1">
                  <p className="font-bold text-white">About Revenue Split</p>
                  <p className="text-sm text-neutral-400 font-medium leading-relaxed">
                    Nexus Hub takes a 30% platform fee on all ad revenue. For subscriptions, we take 15%. Processing fees from payment providers may apply.
                  </p>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'payouts' && (
           <div className="space-y-10 animate-in zoom-in-95 duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-gradient-to-br from-neutral-900 via-black to-black p-10 rounded-[40px] border border-white/[0.1] shadow-2xl space-y-10 relative overflow-hidden">
                   <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full" />
                   <div className="flex items-center justify-between relative z-10">
                      <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20"><Wallet className="w-8 h-8 text-emerald-500" /></div>
                      <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-500/10">Active Balance</span>
                   </div>
                   <div>
                      <p className="text-xs font-black text-neutral-500 uppercase tracking-[0.2em]">Next Payout (Estimated)</p>
                      <h4 className="text-6xl font-black tracking-tighter text-white mt-2">${user.creatorStats?.monthlyEarnings.toLocaleString()}</h4>
                      <p className="text-neutral-500 text-sm mt-2 font-medium">Processing on Mar 15, 2024</p>
                   </div>
                   <div className="space-y-4 pt-10 border-t border-white/5 relative z-10">
                      <div className="flex justify-between text-sm">
                         <span className="font-bold text-neutral-500">Threshold ($50.00)</span>
                         <span className="font-black text-white">92% Met</span>
                      </div>
                      <div className="h-3 w-full bg-neutral-900 rounded-full overflow-hidden border border-white/10">
                         <div className="bg-emerald-500 h-full w-[92%] shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all duration-1000" />
                      </div>
                   </div>
                </div>

                <div className="bg-white/[0.03] border border-white/[0.08] rounded-[40px] p-8 flex flex-col justify-between">
                   <div className="space-y-6">
                      <h3 className="text-xl font-black tracking-tight">Payout Source</h3>
                      <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                         <div className="flex items-center space-x-3">
                            <div className="p-2 bg-white text-black rounded-lg"><Landmark className="w-5 h-5" /></div>
                            <span className="font-bold text-white truncate">Wells Fargo ****4210</span>
                         </div>
                         <Button variant="ghost" size="sm" className="text-sky-500 font-bold p-0 h-auto hover:bg-transparent">Update Method</Button>
                      </div>
                   </div>
                   <Button className="w-full h-14 rounded-2xl bg-white text-black font-black text-lg hover:bg-neutral-200 mt-10 shadow-2xl">Manage Transfers</Button>
                </div>
              </div>

              <div className="space-y-6">
                 <h3 className="px-2 text-xs font-black text-neutral-500 uppercase tracking-[0.2em]">Recent Transactions</h3>
                 <div className="bg-white/[0.03] border border-white/[0.08] rounded-[32px] overflow-hidden divide-y divide-white/5">
                    {[1, 2].map(i => (
                      <div key={i} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                         <div className="flex items-center space-x-5">
                            <div className="p-3 bg-neutral-800 rounded-2xl"><Landmark className="w-6 h-6 text-neutral-400" /></div>
                            <div>
                               <p className="font-bold text-lg text-white">Monthly Earnings Payout</p>
                               <p className="text-xs text-neutral-500 font-medium uppercase tracking-widest mt-0.5">Completed • Jan 15, 2024</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="font-black text-white text-2xl">$1,420.50</p>
                            <p className="text-[10px] text-sky-500 font-black uppercase tracking-tighter">View Receipt</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-10 animate-in slide-in-from-right-4 duration-300 max-w-4xl">
             <section className="space-y-6">
                <h3 className="px-2 text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]">Profile Identity</h3>
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-[32px] p-8 space-y-8">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                         <Avatar className="w-20 h-20 rounded-[32px] border-2 border-white/10 ring-4 ring-purple-500/10"><AvatarImage src={user.avatar} /></Avatar>
                         <div>
                            <p className="text-xl font-black">{user.name}</p>
                            <p className="text-neutral-500 font-bold uppercase text-xs tracking-widest">{selectedCategory || 'General Creator'}</p>
                         </div>
                      </div>
                      <Button variant="outline" className="rounded-2xl h-12 px-8 font-black border-white/10">Change Avatar</Button>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-neutral-600 uppercase tracking-widest ml-1">Creator Bio</label>
                      <textarea className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm font-medium h-24 focus:border-purple-500 outline-none transition-all resize-none" defaultValue={user.bio} />
                   </div>
                </div>
             </section>

             <section className="space-y-6">
                <h3 className="px-2 text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]">Compliance & Security</h3>
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-[32px] overflow-hidden divide-y divide-white/5">
                   <SettingsRow icon={<ShieldCheck className="w-4 h-4" />} label="Identity Verification" rightText="Verified" />
                   <SettingsRow icon={<FileText className="w-4 h-4" />} label="Tax Information" rightText="Completed" />
                   <SettingsRow icon={<Ban className="w-4 h-4 text-rose-500" />} label="Payout Lock" toggle={<Toggle active={false} onToggle={() => {}} />} />
                </div>
             </section>

             <div className="pt-10 border-t border-white/10 flex flex-col items-center">
                <Button variant="ghost" className="text-rose-500 font-black uppercase tracking-widest text-xs hover:bg-rose-500/10 px-8 rounded-full py-4">
                  Deactivate Professional Account
                </Button>
                <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest mt-4">This will pause all current monetization</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

// HELPER COMPONENTS
const TabButton = ({ active, onClick, label }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "pb-4 text-[14px] font-black uppercase tracking-widest transition-all relative",
      active ? "text-white" : "text-neutral-500 hover:text-neutral-300"
    )}
  >
    {label}
    {active && <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500 rounded-t-full shadow-[0_-4px_15px_rgba(168,85,247,0.4)]" />}
  </button>
);

const StatCard = ({ icon, label, value, trend, trendType }: any) => (
  <div className="bg-white/[0.03] border border-white/[0.08] p-6 rounded-[32px] space-y-4 hover:border-purple-500/30 transition-all shadow-xl group">
     <div className="flex items-center justify-between">
        <div className="p-2.5 bg-neutral-900 rounded-xl text-neutral-500 group-hover:text-purple-500 transition-colors">{icon}</div>
        <span className={cn(
          "text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter",
          trendType === 'up' ? "bg-emerald-500/10 text-emerald-500" : trendType === 'down' ? "bg-rose-500/10 text-rose-500" : "bg-neutral-800 text-neutral-500"
        )}>{trend}</span>
     </div>
     <div>
        <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">{label}</p>
        <h4 className="text-3xl font-black text-white mt-1.5">{value}</h4>
     </div>
  </div>
);

const BenefitCard = ({ icon, title, desc }: any) => (
  <div className="bg-white/[0.03] border border-white/[0.08] p-6 rounded-[32px] text-left hover:bg-white/[0.06] hover:border-white/20 transition-all group shadow-2xl">
     <div className="p-3.5 bg-neutral-900 rounded-2xl w-fit mb-5 group-hover:scale-110 group-hover:bg-neutral-800 transition-all shadow-inner">{icon}</div>
     <h4 className="font-black text-lg text-white tracking-tight leading-tight">{title}</h4>
     <p className="text-sm text-neutral-500 font-medium mt-2 leading-relaxed">{desc}</p>
  </div>
);

const CriteriaCheck = ({ label, current, target, met }: any) => (
  <div className="p-5 rounded-[24px] bg-white/5 border border-white/10 flex items-center justify-between group hover:bg-white/[0.08] transition-all">
    <div className="flex items-center space-x-4">
      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-all", met ? "bg-emerald-500/20 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]" : "bg-neutral-800 text-neutral-600")}>
        {met ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
      </div>
      <span className={cn("font-bold text-[16px]", met ? "text-white" : "text-neutral-500")}>{label}</span>
    </div>
    <div className="text-right">
       <span className={cn("font-black text-sm", met ? "text-emerald-500" : "text-neutral-400")}>{current.toLocaleString()}</span>
       <span className="text-[10px] text-neutral-600 font-black ml-1">/ {target.toLocaleString()}</span>
    </div>
  </div>
);

const AudienceBar = ({ label, percent, color }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
       <span className="text-neutral-500">{label}</span>
       <span className="text-white">{percent}%</span>
    </div>
    <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
       <div style={{ width: `${percent}%` }} className={cn("h-full rounded-full transition-all duration-1000 delay-300", color)} />
    </div>
  </div>
);

const MonetizationCard = ({ title, desc, enabled, onToggle, icon, extra }: any) => (
  <div className={cn(
    "p-8 rounded-[40px] border transition-all space-y-6 shadow-2xl relative overflow-hidden",
    enabled ? "bg-purple-500/10 border-purple-500/30" : "bg-white/[0.03] border-white/[0.08]"
  )}>
    <div className="flex items-center justify-between">
       <div className={cn("p-4 rounded-3xl", enabled ? "bg-purple-500 text-white" : "bg-neutral-800 text-neutral-500")}>
          {React.cloneElement(icon as React.ReactElement<any>, { className: "w-8 h-8" })}
       </div>
       <Toggle active={enabled} onToggle={onToggle} />
    </div>
    <div>
       <h4 className="text-2xl font-black text-white tracking-tight">{title}</h4>
       <p className="text-neutral-500 text-sm font-medium mt-2 leading-relaxed">{desc}</p>
    </div>
    {extra}
  </div>
);

const SettingsRow = ({ icon, label, rightText, toggle, onClick }: any) => (
  <div 
    onClick={onClick}
    className="flex items-center justify-between p-5 rounded-2xl hover:bg-white/[0.04] transition-all cursor-pointer group"
  >
    <div className="flex items-center space-x-4">
       <div className="p-2.5 rounded-xl bg-neutral-800 text-neutral-500 group-hover:bg-purple-500 group-hover:text-white transition-all">{icon}</div>
       <span className="text-sm font-bold text-neutral-300 group-hover:text-white transition-colors">{label}</span>
    </div>
    <div className="flex items-center">
      {rightText && <span className="text-xs text-purple-500 font-black mr-2 uppercase tracking-widest">{rightText}</span>}
      {toggle ? toggle : <ChevronRight className="w-4 h-4 text-neutral-700" />}
    </div>
  </div>
);

const Toggle = ({ active, onToggle }: { active: boolean, onToggle: () => void }) => (
  <div 
    onClick={(e) => { e.stopPropagation(); onToggle(); }}
    className={cn(
      "w-12 h-7 rounded-full relative transition-all cursor-pointer duration-300 border border-white/5 shadow-inner",
      active ? "bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]" : "bg-neutral-800"
    )}
  >
    <div className={cn(
      "absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-xl",
      active ? "left-6" : "left-1"
    )} />
  </div>
);

const X = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

export default CreatorStudio;
