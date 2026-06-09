'use client'
import { Check, Circle } from 'lucide-react'

type Step = { key: string; label: string; done: boolean; active: boolean }

export function PipelineTracker({ steps }: { steps: Step[] }) {
  return (
    <div className="flex items-center gap-0 w-full">
      {steps.map((step, i) => (
        <div key={step.key} className="flex items-center flex-1 min-w-0">
          <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
              step.done
                ? 'bg-emerald-500 border-emerald-500'
                : step.active
                  ? 'bg-accent/20 border-accent'
                  : 'bg-white/[0.03] border-white/10'
            }`}>
              {step.done
                ? <Check size={13} className="text-white" strokeWidth={3} />
                : <Circle size={7} className={step.active ? 'text-accent fill-accent' : 'text-white/20 fill-white/20'} />
              }
            </div>
            <span className={`text-[9px] tracking-wide uppercase whitespace-nowrap ${
              step.done ? 'text-emerald-400' : step.active ? 'text-accent' : 'text-white/20'
            }`}>{step.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-px mx-1 mb-4 transition-all ${step.done ? 'bg-emerald-500/40' : 'bg-white/[0.05]'}`} />
          )}
        </div>
      ))}
    </div>
  )
}
