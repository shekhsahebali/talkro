
import React, { useState } from 'react';
import { Button } from './ui/Button';
import { X, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

interface AuthProps {
  onAuthSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'landing'>('landing');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onAuthSuccess();
    }, 1500);
  };

  const renderLanding = () => (
    <div className="flex flex-col lg:flex-row w-full h-screen bg-black overflow-hidden animate-in fade-in duration-500">
      {/* Left side - Big X logo */}
      <div className="flex-1 flex items-center justify-center p-12 lg:p-24 bg-black">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="w-48 h-48 lg:w-96 lg:h-96 fill-white">
          <g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g>
        </svg>
      </div>

      {/* Right side - Buttons */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-24 pb-12 lg:pb-0 space-y-12">
        <div className="space-y-4">
          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter">Happening now</h1>
          <h2 className="text-2xl lg:text-3xl font-black">Join today.</h2>
        </div>

        <div className="max-w-[320px] space-y-4">
          <Button variant="secondary" className="w-full h-11 rounded-full font-bold flex items-center justify-center space-x-2">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
            <span>Sign up with Google</span>
          </Button>
          <Button variant="secondary" className="w-full h-11 rounded-full font-bold flex items-center justify-center space-x-2 bg-white text-black hover:bg-neutral-200">
            <svg viewBox="0 0 384 512" className="w-4 h-4 fill-current"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"></path></svg>
            <span>Sign up with Apple</span>
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-neutral-500 font-bold uppercase">or</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <Button 
            className="w-full h-11 rounded-full font-bold bg-sky-500 text-white hover:bg-sky-400"
            onClick={() => setMode('signup')}
          >
            Create account
          </Button>
          
          <p className="text-[11px] text-neutral-500 leading-tight">
            By signing up, you agree to the <span className="text-sky-500 hover:underline cursor-pointer">Terms of Service</span> and <span className="text-sky-500 hover:underline cursor-pointer">Privacy Policy</span>, including <span className="text-sky-500 hover:underline cursor-pointer">Cookie Use</span>.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold">Already have an account?</h3>
          <Button 
            variant="outline" 
            className="max-w-[320px] w-full h-11 rounded-full font-bold text-sky-500 border-white/10 hover:bg-sky-500/10"
            onClick={() => setMode('login')}
          >
            Sign in
          </Button>
        </div>
      </div>
    </div>
  );

  const renderModal = () => (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-sky-500/10 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div 
        className="bg-black w-full max-w-[600px] h-full sm:h-auto sm:min-h-[400px] sm:max-h-[90vh] rounded-[32px] border border-white/10 shadow-2xl flex flex-col relative overflow-hidden animate-in zoom-in-95 duration-200"
      >
        <header className="p-4 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => setMode('landing')} className="rounded-full">
            <X className="w-5 h-5" />
          </Button>
          <svg viewBox="0 0 24 24" aria-hidden="true" className="w-8 h-8 fill-white">
            <g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g>
          </svg>
          <div className="w-10" />
        </header>

        <form onSubmit={handleSubmit} className="flex-1 p-8 sm:p-12 flex flex-col space-y-8 max-w-[450px] mx-auto w-full">
          <h2 className="text-3xl font-black tracking-tight">
            {mode === 'login' ? 'Sign in to Nexus Hub' : 'Create your account'}
          </h2>

          <div className="space-y-4">
            <div className="relative group">
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                className="w-full bg-black border border-white/20 rounded-lg px-4 pt-6 pb-2 text-white outline-none focus:border-sky-500 peer transition-all"
              />
              <label className="absolute left-4 top-4 text-neutral-500 transition-all pointer-events-none peer-focus:top-1 peer-focus:text-xs peer-focus:text-sky-500 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs">
                Email
              </label>
            </div>

            <div className="relative group">
              <input 
                required
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                className="w-full bg-black border border-white/20 rounded-lg px-4 pt-6 pb-2 text-white outline-none focus:border-sky-500 peer transition-all"
              />
              <label className="absolute left-4 top-4 text-neutral-500 transition-all pointer-events-none peer-focus:top-1 peer-focus:text-xs peer-focus:text-sky-500 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs">
                Password
              </label>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-full font-black text-lg bg-white text-black hover:bg-neutral-200"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                mode === 'login' ? 'Log in' : 'Sign up'
              )}
            </Button>
            
            {mode === 'login' && (
              <Button variant="ghost" className="w-full h-11 rounded-full font-bold border border-white/10 hover:bg-white/5">
                Forgot password?
              </Button>
            )}
          </div>

          <p className="text-sm text-neutral-500">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <span 
              className="text-sky-500 hover:underline cursor-pointer" 
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            >
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </span>
          </p>
        </form>
        
        {/* Subtle AI sparkle background effect */}
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-sky-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-4 -translate-y-1/2 opacity-10">
           <Sparkles className="w-32 h-32 text-sky-500" />
        </div>
      </div>
    </div>
  );

  return mode === 'landing' ? renderLanding() : renderModal();
};

export default Auth;
