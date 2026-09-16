import { useState, useMemo } from 'react';
import {
  ArrowLeft, Star, TrendingDown, Shield, CheckCircle2, Circle,
  Wrench, Package, AlertTriangle, ChevronRight, DollarSign, PiggyBank,
} from 'lucide-react';
import type { DiagnosisResult } from '@/types';

interface ReportPageProps {
  result: DiagnosisResult;
  onBack: () => void;
  onStartGuide: () => void;
}

export default function ReportPage({ result, onBack, onStartGuide }: ReportPageProps) {
  const [tools, setTools] = useState(result.tools);
  const [materials, setMaterials] = useState(result.materials);

  const toggleTool = (id: string) => {
    setTools((prev) => prev.map((t) => (t.id === id ? { ...t, have: !t.have } : t)));
  };

  const toggleMaterial = (id: string) => {
    setMaterials((prev) => prev.map((m) => (m.id === id ? { ...m, have: !m.have } : m)));
  };

  const missingCost = useMemo(() => {
    const toolsCost = tools.filter((t) => !t.have).reduce((sum, t) => sum + t.price, 0);
    const materialsCost = materials.filter((m) => !m.have).reduce((sum, m) => sum + m.price, 0);
    return toolsCost + materialsCost;
  }, [tools, materials]);

  const totalDiyCost = result.estimatedDiyCost;
  const actualSavings = result.estimatedShopCost - totalDiyCost;
  const remainingBudget = actualSavings - missingCost;

  return (
    <div className="min-h-screen px-4 py-6 sm:py-8 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-ink-400 hover:text-ink-100 transition-colors mb-4 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首頁
        </button>

        {/* Header */}
        <div className="card p-5 mb-4 animate-slide-up">
          <div className="flex items-center gap-2 text-xs text-accent-500 font-medium mb-1">
            <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse" />
            AI 診斷完成
          </div>
          <h2 className="text-2xl font-bold text-ink-100 mb-1">診斷報告</h2>
          <p className="text-sm text-ink-400">
            {result.carModel} · {result.symptom}
          </p>
        </div>

        {/* Savings card — green highlight */}
        <div className="card p-5 mb-4 bg-gradient-to-br from-success-500/15 to-success-600/5 border-success-500/30 animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <PiggyBank className="w-5 h-5 text-success-500" />
              <span className="font-semibold text-success-400">預估省下金額</span>
            </div>
            <span className="text-3xl font-bold text-success-400">
              ${actualSavings.toLocaleString()}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-ink-300">
              <DollarSign className="w-4 h-4 text-ink-400" />
              車廠預估：<span className="text-ink-100 font-medium">${result.estimatedShopCost.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-ink-300">
              <DollarSign className="w-4 h-4 text-ink-400" />
              DIY 預估：<span className="text-ink-100 font-medium">${totalDiyCost.toLocaleString()}</span>
            </div>
          </div>
          {missingCost > 0 && (
            <div className="mt-3 pt-3 border-t border-success-500/20">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-300">缺少工具/材料需購買：</span>
                <span className="text-warning-400 font-medium">${missingCost.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-ink-300">實際可省：</span>
                <span className={`font-bold ${remainingBudget >= 0 ? 'text-success-400' : 'text-danger-400'}`}>
                  ${Math.max(0, remainingBudget).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* DIY Difficulty */}
        <div className="card p-5 mb-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-ink-300 mb-1">DIY 難度</h3>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={`w-5 h-5 ${n <= result.diyDifficulty ? 'fill-accent-500 text-accent-500' : 'text-ink-600'}`}
                  />
                ))}
                <span className="ml-2 text-sm text-ink-300">
                  {['簡單', '容易', '中等', '偏難', '專業級'][result.diyDifficulty - 1]}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-ink-400 mb-1">建議</p>
              <p className={`text-sm font-medium ${result.diyDifficulty <= 3 ? 'text-success-400' : 'text-warning-400'}`}>
                {result.diyDifficulty <= 3 ? '適合自行操作' : '建議評估後再操作'}
              </p>
            </div>
          </div>
        </div>

        {/* Fault causes — probability bars */}
        <div className="card p-5 mb-4 animate-slide-up">
          <h3 className="text-sm font-medium text-ink-300 mb-3 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-accent-500" />
            可能故障原因（依機率排序）
          </h3>
          <div className="space-y-3">
            {result.causes.map((cause, idx) => (
              <div key={cause.id} className="animate-slide-in" style={{ animationDelay: `${idx * 80}ms` }}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-ink-400 w-6">{String(idx + 1).padStart(2, '0')}</span>
                    <span className="text-sm font-medium text-ink-100">{cause.name}</span>
                  </div>
                  <span className="text-sm font-bold text-accent-500">{cause.probability}%</span>
                </div>
                <div className="h-2 rounded-full bg-ink-900 overflow-hidden ml-8">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent-600 to-accent-400 transition-all duration-700"
                    style={{ width: `${cause.probability}%` }}
                  />
                </div>
                <p className="text-xs text-ink-400 mt-1 ml-8">{cause.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Safety warning box */}
        <div className="card p-5 mb-4 border-warning-500/30 bg-warning-500/5 animate-slide-up">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-warning-500" />
            <h3 className="text-sm font-semibold text-warning-400">安全注意事項</h3>
          </div>
          <ul className="space-y-2">
            {result.safetyWarnings.map((warning, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-ink-200">
                <AlertTriangle className="w-4 h-4 text-warning-500 mt-0.5 flex-shrink-0" />
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tools checklist */}
        <div className="card p-5 mb-4 animate-slide-up">
          <h3 className="text-sm font-medium text-ink-300 mb-3 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-accent-500" />
            工具清單
            <span className="text-xs text-ink-400 ml-1">（勾選你已有的工具）</span>
          </h3>
          <div className="space-y-2">
            {tools.map((tool) => (
              <label
                key={tool.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-ink-900/40 hover:bg-ink-800/40 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={tool.have}
                  onChange={() => toggleTool(tool.id)}
                  className="custom-checkbox"
                />
                {tool.have ? (
                  <CheckCircle2 className="w-4 h-4 text-success-500" />
                ) : (
                  <Circle className="w-4 h-4 text-ink-500" />
                )}
                <span className={`text-sm flex-1 ${tool.have ? 'text-ink-400 line-through' : 'text-ink-100'}`}>
                  {tool.name}
                </span>
                <span className={`text-sm font-mono ${tool.have ? 'text-ink-500' : 'text-ink-300'}`}>
                  ${tool.price.toLocaleString()}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Materials checklist */}
        <div className="card p-5 mb-4 animate-slide-up">
          <h3 className="text-sm font-medium text-ink-300 mb-3 flex items-center gap-2">
            <Package className="w-4 h-4 text-accent-500" />
            材料清單
            <span className="text-xs text-ink-400 ml-1">（勾選你已有的材料）</span>
          </h3>
          <div className="space-y-2">
            {materials.map((mat) => (
              <label
                key={mat.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-ink-900/40 hover:bg-ink-800/40 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={mat.have}
                  onChange={() => toggleMaterial(mat.id)}
                  className="custom-checkbox"
                />
                {mat.have ? (
                  <CheckCircle2 className="w-4 h-4 text-success-500" />
                ) : (
                  <Circle className="w-4 h-4 text-ink-500" />
                )}
                <span className={`text-sm flex-1 ${mat.have ? 'text-ink-400 line-through' : 'text-ink-100'}`}>
                  {mat.name}
                </span>
                <span className={`text-sm font-mono ${mat.have ? 'text-ink-500' : 'text-ink-300'}`}>
                  ${mat.price.toLocaleString()}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Start guide button */}
        <button
          onClick={onStartGuide}
          className="btn-primary w-full py-4 rounded-xl text-lg flex items-center justify-center gap-2 mt-2"
        >
          開始排除測試
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
