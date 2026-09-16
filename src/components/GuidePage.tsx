import { useState } from 'react';
import {
  ArrowLeft, ArrowRight, CheckCircle2, Circle, AlertTriangle,
  Lightbulb, Clock, Flag, ChevronRight,
} from 'lucide-react';
import type { DiagnosisResult } from '@/types';

interface GuidePageProps {
  result: DiagnosisResult;
  onBack: () => void;
  onFinish: () => void;
}

export default function GuidePage({ result, onBack, onFinish }: GuidePageProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  const step = result.steps[currentStep];
  const isLast = currentStep === result.steps.length - 1;
  const isFirst = currentStep === 0;
  const progress = ((currentStep + 1) / result.steps.length) * 100;

  const toggleComplete = (idx: number) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const next = () => {
    if (!isLast) setCurrentStep((s) => s + 1);
  };

  const prev = () => {
    if (!isFirst) setCurrentStep((s) => s - 1);
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:py-8 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-ink-400 hover:text-ink-100 transition-colors mb-4 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          返回診斷報告
        </button>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-ink-100">分步教學</h2>
            <span className="text-sm text-ink-400 font-mono">
              {currentStep + 1} / {result.steps.length}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-ink-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent-600 to-accent-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step indicator dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {result.steps.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentStep(idx)}
              className={`transition-all duration-300 rounded-full ${
                idx === currentStep
                  ? 'w-8 h-2 bg-accent-500'
                  : completed.has(idx)
                    ? 'w-2 h-2 bg-success-500'
                    : 'w-2 h-2 bg-ink-600 hover:bg-ink-500'
              }`}
              aria-label={`步驟 ${idx + 1}`}
            />
          ))}
        </div>

        {/* Step card */}
        <div key={step.id} className="card p-6 mb-4 animate-slide-up">
          {/* Step number + title */}
          <div className="flex items-start gap-3 mb-4">
            <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg
              ${completed.has(currentStep)
                ? 'bg-success-500/20 text-success-400'
                : 'bg-accent-500/15 text-accent-500'}`}
            >
              {completed.has(currentStep) ? <CheckCircle2 className="w-5 h-5" /> : step.id}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-ink-100">{step.title}</h3>
              <div className="flex items-center gap-1.5 mt-1">
                <Clock className="w-3.5 h-3.5 text-ink-400" />
                <span className="text-xs text-ink-400">{step.duration}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-ink-200 leading-relaxed mb-4">{step.description}</p>

          {/* Warning box */}
          {step.warning && (
            <div className="rounded-xl border border-danger-500/30 bg-danger-500/10 p-4 mb-3 animate-slide-in">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-danger-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-danger-400 mb-1">安全警告</p>
                  <p className="text-sm text-ink-200">{step.warning}</p>
                </div>
              </div>
            </div>
          )}

          {/* Tip box */}
          {step.tip && (
            <div className="rounded-xl border border-accent-500/20 bg-accent-500/5 p-4 animate-slide-in">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-accent-500 mb-1">小技巧</p>
                  <p className="text-sm text-ink-200">{step.tip}</p>
                </div>
              </div>
            </div>
          )}

          {/* Mark complete */}
          <button
            onClick={() => toggleComplete(currentStep)}
            className={`w-full mt-4 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200
              ${completed.has(currentStep)
                ? 'bg-success-500/15 text-success-400 border border-success-500/30'
                : 'bg-ink-800/60 text-ink-300 border border-ink-600/40 hover:bg-ink-700/60'
              }`}
          >
            {completed.has(currentStep) ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                已完成此步驟
              </>
            ) : (
              <>
                <Circle className="w-4 h-4" />
                標記為完成
              </>
            )}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={prev}
            disabled={isFirst}
            className="flex items-center gap-1.5 px-5 py-3 rounded-xl glass text-ink-200 text-sm font-medium
              transition-all hover:bg-ink-700/60 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            上一步
          </button>

          {isLast ? (
            <button
              onClick={onFinish}
              className="flex-1 btn-primary py-3 rounded-xl flex items-center justify-center gap-2 text-sm"
            >
              <Flag className="w-4 h-4" />
              完成維修
            </button>
          ) : (
            <button
              onClick={next}
              className="flex-1 btn-primary py-3 rounded-xl flex items-center justify-center gap-2 text-sm"
            >
              下一步
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Completion summary */}
        {completed.size === result.steps.length && (
          <div className="card p-5 mt-4 bg-success-500/10 border-success-500/30 text-center animate-slide-up">
            <CheckCircle2 className="w-10 h-10 text-success-500 mx-auto mb-2" />
            <h3 className="text-lg font-bold text-success-400 mb-1">所有步驟已完成！</h3>
            <p className="text-sm text-ink-300">
              恭喜完成 DIY 維修。建議試車確認問題是否排除，若仍有異常建議進廠檢查。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
