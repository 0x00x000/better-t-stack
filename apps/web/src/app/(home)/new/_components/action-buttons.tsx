"use client";

import { RefreshCw, Settings, Shuffle, Star } from "lucide-react";

import { cn } from "@/lib/utils";

type ActionButtonsProps = {
  onReset: () => void;
  onRandom: () => void;
  onSave: () => void;
  onLoad: () => void;
  hasSavedStack: boolean;
};

const mutedActionClasses =
  "builder-focus-ring pointer-coarse:min-h-8 flex items-center justify-center gap-1.5 rounded-[4px] border px-2 py-1.5 font-mono text-[10px] text-fd-muted-foreground uppercase tracking-[0.10em] transition-colors duration-150 hover:text-fd-foreground";

export function ActionButtons({
  onReset,
  onRandom,
  onSave,
  onLoad,
  hasSavedStack,
}: ActionButtonsProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <p className="font-mono text-[11px] text-fd-muted-foreground uppercase tracking-[0.08em]">
          Actions
        </p>
        <span aria-hidden="true" className="h-px flex-1 bg-fd-border" />
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        <button
          type="button"
          onClick={onRandom}
          className="builder-focus-ring pointer-coarse:min-h-8 flex items-center justify-center gap-1.5 rounded-[4px] border px-2 py-1.5 font-mono text-[10px] text-primary uppercase tracking-[0.10em] transition-colors duration-150 hover:border-primary"
          title="Generate a random stack"
        >
          <Shuffle className="h-3 w-3" />
          Randomize
        </button>
        <button
          type="button"
          onClick={onSave}
          className={mutedActionClasses}
          title="Save current preferences"
        >
          <Star className="h-3 w-3" />
          Save
        </button>
        <button
          type="button"
          onClick={onReset}
          className={cn(mutedActionClasses, !hasSavedStack && "col-span-2")}
          title="Reset to defaults"
        >
          <RefreshCw className="h-3 w-3" />
          Reset
        </button>
        {hasSavedStack && (
          <button
            type="button"
            onClick={onLoad}
            className={mutedActionClasses}
            title="Load saved preferences"
          >
            <Settings className="h-3 w-3" />
            Load
          </button>
        )}
      </div>
    </div>
  );
}
