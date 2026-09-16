import { useState, useRef } from 'react';
import { Car, ChevronDown, Upload, Wrench, Sparkles, Image as ImageIcon, X, AlertCircle } from 'lucide-react';
import { carModels } from '@/data/carModels';

interface HomePageProps {
  onDiagnose: (carModel: string, symptom: string, imageDataUrl?: string) => void;
  loading: boolean;
  error: string | null;
}

export default function HomePage({ onDiagnose, loading, error }: HomePageProps) {
  const [selectedCar, setSelectedCar] = useState('');
  const [symptom, setSymptom] = useState('');
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>();
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => setImageDataUrl(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleSubmit = () => {
    if (!selectedCar || !symptom.trim()) return;
    onDiagnose(selectedCar, symptom.trim(), imageDataUrl);
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8 sm:py-12 animate-fade-in">
      {/* Header */}
      <div className="w-full max-w-2xl text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-4">
          <Sparkles className="w-4 h-4 text-accent-500" />
          <span className="text-sm text-ink-300 font-medium">AI 汽車診斷系統</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-3 tracking-tight">
          <span className="text-glow bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
            CarDoctor AI
          </span>
        </h1>
        <p className="text-ink-400 text-base sm:text-lg">
          輸入症狀，讓 AI 技師幫你診斷問題、估算省下金額，並一步步教你 DIY 修車
        </p>
      </div>

      {/* Main form card */}
      <div className="w-full max-w-2xl card p-6 sm:p-8 glow-accent animate-slide-up">
        {/* Car model selector */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-medium text-ink-200 mb-2">
            <Car className="w-4 h-4 text-accent-500" />
            選擇車型
          </label>
          <div className="relative">
            <select
              value={selectedCar}
              onChange={(e) => setSelectedCar(e.target.value)}
              className="input-field appearance-none cursor-pointer pr-10"
            >
              <option value="">請選擇您的車型...</option>
              {carModels.map((car) => (
                <option key={car.id} value={car.label} className="bg-ink-850">
                  {car.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400 pointer-events-none" />
          </div>
        </div>

        {/* Symptom input */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-medium text-ink-200 mb-2">
            <Wrench className="w-4 h-4 text-accent-500" />
            描述症狀
          </label>
          <textarea
            value={symptom}
            onChange={(e) => setSymptom(e.target.value)}
            placeholder="例如：D 檔怠速時車身明顯抖動，冷車時更嚴重..."
            rows={4}
            className="input-field resize-none"
          />
          <p className="mt-1.5 text-xs text-ink-400">
            越詳細越好：發生時機、頻率、聲音、儀表板燈號等
          </p>
        </div>

        {/* Image upload */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-medium text-ink-200 mb-2">
            <ImageIcon className="w-4 h-4 text-accent-500" />
            上傳照片或影片（選填）
          </label>
          {imageDataUrl ? (
            <div className="relative rounded-xl overflow-hidden border border-ink-600/50 group">
              <img src={imageDataUrl} alt="uploaded" className="w-full max-h-48 object-cover" />
              <button
                onClick={() => setImageDataUrl(undefined)}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-ink-950/80 text-ink-200 hover:bg-danger-500/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all duration-200
                ${dragOver
                  ? 'border-accent-500 bg-accent-500/10'
                  : 'border-ink-600/50 hover:border-accent-500/40 hover:bg-ink-800/40'
                }`}
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-ink-400" />
              <p className="text-sm text-ink-300">點擊或拖曳上傳</p>
              <p className="text-xs text-ink-400 mt-1">支援 JPG、PNG、MP4</p>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 rounded-xl border border-danger-500/30 bg-danger-500/10 p-4 animate-slide-in">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-danger-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-danger-400 mb-0.5">診斷失敗</p>
                <p className="text-sm text-ink-200">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Diagnose button */}
        <button
          onClick={handleSubmit}
          disabled={!selectedCar || !symptom.trim() || loading}
          className="btn-primary w-full py-4 rounded-xl text-lg flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-ink-950/30 border-t-ink-950 rounded-full animate-spin" />
              AI 診斷中...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              開始 AI 診斷
            </>
          )}
        </button>
      </div>

      {/* Feature highlights */}
      <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
        {[
          { icon: '🔍', title: '智能診斷', desc: 'AI 分析故障原因機率' },
          { icon: '💰', title: '省錢估算', desc: '計算 DIY 可省金額' },
          { icon: '📚', title: '分步教學', desc: '圖文步驟安全指引' },
        ].map((f) => (
          <div key={f.title} className="card p-4 text-center">
            <div className="text-2xl mb-1">{f.icon}</div>
            <h3 className="text-sm font-semibold text-ink-100">{f.title}</h3>
            <p className="text-xs text-ink-400 mt-0.5">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
