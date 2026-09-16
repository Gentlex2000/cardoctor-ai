import { useState } from 'react';
import HomePage from '@/components/HomePage';
import ReportPage from '@/components/ReportPage';
import GuidePage from '@/components/GuidePage';
import { diagnose } from '@/services/aiDiagnosis';
import type { DiagnosisResult, Screen } from '@/types';

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDiagnose = async (carModel: string, symptom: string, imageDataUrl?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await diagnose({ carModel, symptom, imageDataUrl });
      setResult(res);
      setScreen('report');
    } catch (err) {
      const message = err instanceof Error ? err.message : '診斷失敗，請稍後再試';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackHome = () => {
    setScreen('home');
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen">
      {/* Top nav bar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-ink-950/70 border-b border-ink-800/50">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={handleBackHome}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-ink-950" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-bold text-ink-100 text-sm">CarDoctor AI</span>
          </button>

          {/* Screen indicator */}
          <div className="flex items-center gap-1.5 text-xs">
            {(['home', 'report', 'guide'] as Screen[]).map((s, idx) => {
              const labels = ['輸入', '報告', '教學'];
              const isActive = screen === s;
              const isPast =
                (screen === 'report' && s === 'home') ||
                (screen === 'guide' && (s === 'home' || s === 'report'));
              return (
                <div key={s} className="flex items-center gap-1.5">
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-full transition-all
                      ${isActive ? 'bg-accent-500/20 text-accent-500' : isPast ? 'text-ink-400' : 'text-ink-600'}`}
                  >
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold
                      ${isActive ? 'bg-accent-500 text-ink-950' : isPast ? 'bg-ink-600 text-ink-300' : 'bg-ink-800 text-ink-500'}`}
                    >
                      {idx + 1}
                    </span>
                    <span className="hidden sm:inline">{labels[idx]}</span>
                  </div>
                  {idx < 2 && <div className="w-3 h-px bg-ink-700" />}
                </div>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Screen content */}
      {screen === 'home' && (
        <HomePage onDiagnose={handleDiagnose} loading={loading} error={error} />
      )}
      {screen === 'report' && result && (
        <ReportPage
          result={result}
          onBack={handleBackHome}
          onStartGuide={() => setScreen('guide')}
        />
      )}
      {screen === 'guide' && result && (
        <GuidePage
          result={result}
          onBack={() => setScreen('report')}
          onFinish={handleBackHome}
        />
      )}
    </div>
  );
}

export default App;
