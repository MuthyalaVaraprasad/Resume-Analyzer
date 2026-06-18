import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, ShieldCheck, Settings, Key, Check } from 'lucide-react';

export const Auth: React.FC = () => {
  const { login, triggerAdminAction, googleClientId, setGoogleClientId } = useApp();
  const [screenStep, setScreenStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [tempClientId, setTempClientId] = useState(googleClientId);
  const [clientIdSaved, setClientIdSaved] = useState(false);

  // Decode Google Cloud Sign-In JWT token
  const decodeJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("JWT Decode error", e);
      return null;
    }
  };

  // Google Cloud GIS Credentials callback
  const handleCredentialResponse = (response: any) => {
    setIsLoading(true);
    setLoadingProvider('Google');
    triggerAdminAction("[OAUTH] Received credentials token handshake from Google Cloud.");

    setTimeout(() => {
      const payload = decodeJwt(response.credential);
      setIsLoading(false);
      if (payload) {
        login('Google', {
          name: payload.name,
          email: payload.email,
          avatar: payload.picture
        });
      } else {
        alert("Verification failed. Please try again or use sandbox mock logins.");
      }
    }, 1200);
  };

  useEffect(() => {
    if (screenStep === 2) {
      // Initialize Google Identity Services if loaded
      const initGoogle = () => {
        if ((window as any).google?.accounts?.id) {
          try {
            // Clean container to prevent duplicate buttons or render bugs
            const btnContainer = document.getElementById("google-cloud-signin-btn");
            if (btnContainer) {
              btnContainer.innerHTML = "";
            }

            (window as any).google.accounts.id.initialize({
              client_id: googleClientId,
              callback: handleCredentialResponse
            });
            
            (window as any).google.accounts.id.renderButton(
              document.getElementById("google-cloud-signin-btn"),
              { theme: "outline", size: "large", width: 280 }
            );
          } catch (e) {
            console.error("Error rendering Google Sign-in button:", e);
          }
        } else {
          // Retry in 500ms if script is still loading
          setTimeout(initGoogle, 500);
        }
      };

      initGoogle();
    }
  }, [screenStep, googleClientId]);

  const handleOAuthClick = (provider: string) => {
    setIsLoading(true);
    setLoadingProvider(provider);
    
    // Simulate real OAuth popup delay
    setTimeout(() => {
      setIsLoading(false);
      login(provider);
    }, 1500);
  };

  const handleSaveClientId = () => {
    if (!tempClientId.trim()) return;
    setGoogleClientId(tempClientId.trim());
    triggerAdminAction(`[CONFIG] Google Client ID set to: ${tempClientId.trim()}`);
    setClientIdSaved(true);
    setTimeout(() => setClientIdSaved(false), 3000);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center select-none py-6 px-4">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 blur-[100px] pointer-events-none" />

      {screenStep === 1 ? (
        /* Screen 01: Welcome Screen */
        <div className="w-full max-w-md bg-zinc-950/60 border border-zinc-800/80 rounded-3xl p-8 text-center space-y-6 relative overflow-hidden glass-panel shadow-2xl animate-float">
          <div className="absolute -top-16 -left-16 w-32 h-32 bg-purple-500/20 rounded-full blur-[40px]" />
          
          <div className="w-16 h-16 bg-gradient-to-tr from-purple-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto border border-purple-500/20 shadow-lg animate-pulse-glow">
            <Sparkles className="w-8 h-8 text-white" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white tracking-tight">CV Analyzer</h2>
            <p className="text-xs uppercase tracking-widest text-zinc-500 font-mono">Resume Intelligence Platform</p>
          </div>

          <p className="text-zinc-400 text-xs px-2 leading-relaxed">
            Welcome to the developer-first resume compliance SaaS. Verify using Google Cloud credentials to unlock parser telemetry.
          </p>

          <button 
            type="button"
            onClick={() => setScreenStep(2)}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:brightness-110 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center space-x-2 active:scale-95 cursor-pointer"
          >
            <span>Continue to Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex justify-center items-center space-x-2 text-[10px] text-zinc-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Secure SSL Sandbox Encryption active</span>
          </div>
        </div>
      ) : (
        /* Screen 02: Google Cloud Authentication */
        <div className="w-full max-w-md bg-zinc-950/60 border border-zinc-800/80 rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden glass-panel shadow-2xl">
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-cyan-500/20 rounded-full blur-[40px]" />
          
          <div className="flex justify-between items-center">
            <button 
              type="button"
              onClick={() => setScreenStep(1)}
              className="text-xs text-zinc-500 hover:text-white font-semibold transition cursor-pointer"
            >
              Back
            </button>
            <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest font-mono">Sign In System</span>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold tracking-tight text-white">OAuth Connect</h3>
            <p className="text-zinc-500 text-xs">Verify your profile credentials to access dashboards.</p>
          </div>

          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-zinc-400 font-bold">Connecting to {loadingProvider} OAuth nodes...</p>
            </div>
          ) : (
            <div className="space-y-6 flex flex-col items-center justify-center w-full">
              {/* Google Cloud Button Container */}
              <div className="space-y-3 flex flex-col items-center w-full">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Real Google Cloud Integration</span>
                <div id="google-cloud-signin-btn" className="border border-zinc-850 rounded-xl overflow-hidden shadow-inner p-1.5 bg-zinc-900/40 min-h-[50px] flex items-center justify-center" />
              </div>

              {/* Developer Bypass Sandbox */}
              <div className="w-full pt-4 border-t border-zinc-900 space-y-3">
                <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider text-center block mb-1">Developer Sandbox Bypass</span>
                
                <button 
                  type="button"
                  onClick={() => handleOAuthClick('Google')}
                  className="w-full py-2.5 bg-zinc-900 border border-zinc-850 hover:border-zinc-800 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white transition flex items-center justify-center space-x-2 active:scale-95 cursor-pointer"
                >
                  <span>Verify via Mock Google Token</span>
                </button>
              </div>

              {/* Client ID Config Expandable Drawer */}
              <div className="w-full border-t border-zinc-900 pt-4">
                <button
                  type="button"
                  onClick={() => setShowConfig(!showConfig)}
                  className="w-full flex items-center justify-between text-xs text-zinc-500 hover:text-zinc-300 font-medium transition cursor-pointer"
                >
                  <div className="flex items-center space-x-1.5">
                    <Settings className="w-3.5 h-3.5" />
                    <span>Google Cloud Console Settings</span>
                  </div>
                  <span className="text-[10px]">{showConfig ? 'Hide' : 'Show'}</span>
                </button>

                {showConfig && (
                  <div className="mt-3 p-3 bg-zinc-900/40 border border-zinc-850 rounded-xl space-y-3 animate-slide-in">
                    <p className="text-[10px] text-zinc-500 leading-relaxed">
                      Configure your official Google Cloud OAuth Client ID to test real Google Authentication:
                    </p>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-1.5 bg-zinc-950 border border-zinc-800 rounded-lg p-1.5">
                        <Key className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        <input
                          type="text"
                          value={tempClientId}
                          onChange={(e) => setTempClientId(e.target.value)}
                          placeholder="Paste client ID here"
                          className="bg-transparent border-none outline-none text-[10px] font-mono text-zinc-300 w-full"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleSaveClientId}
                        className="w-full py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold rounded-lg transition active:scale-95 flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        {clientIdSaved ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Saved Client ID</span>
                          </>
                        ) : (
                          <span>Update Client ID</span>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="border-t border-zinc-900 pt-4 flex flex-col items-center space-y-2 text-[10px] text-zinc-500 leading-relaxed text-center">
            <p>Verification is compiled securely. No database credentials are recorded.</p>
            <p className="font-bold text-zinc-400">100% Free Forever • Google Login Active</p>
          </div>
        </div>
      )}
    </div>
  );
};
