import { useEffect, useRef } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Logo } from './Logo';
import { InstallConfig, InstallStep, InstallResult } from '../App';
import { TranslationKey } from '../i18n';

type ProgressScreenProps = {
  config: InstallConfig;
  steps: InstallStep[];
  onStepUpdate: (stepId: string, status: InstallStep['status'], error?: string) => void;
  onComplete: (result: InstallResult) => void;
  t: (key: TranslationKey) => string;
  isRtl: boolean;
};

const stepIcons = {
  pending: '○',
  in_progress: '◐',
  completed: '✓',
  failed: '✕',
  skipped: '–',
};

const stepColors = {
  pending: 'text-slate-300',
  in_progress: 'text-startech-gold animate-pulse',
  completed: 'text-startech-teal',
  failed: 'text-startech-coral',
  skipped: 'text-slate-400',
};

export const ProgressScreen = ({ config, steps, onStepUpdate, onComplete, t, isRtl: _isRtl }: ProgressScreenProps) => {
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const runInstallation = async () => {
      const finalSteps: InstallStep[] = [...steps];
      let hasErrors = false;

      const updateStep = (index: number, status: InstallStep['status'], error?: string) => {
        finalSteps[index] = { ...finalSteps[index], status, error };
        onStepUpdate(finalSteps[index].id, status, error);
      };

      try {
        // Step 1: Create folder
        updateStep(0, 'in_progress');
        try {
          await invoke('create_install_folder', { folderName: config.folderName });
          updateStep(0, 'completed');
        } catch (err) {
          updateStep(0, 'failed', String(err));
          hasErrors = true;
        }

        // Step 2: Extract Processing
        updateStep(1, 'in_progress');
        try {
          await invoke('extract_processing', { folderName: config.folderName });
          updateStep(1, 'completed');
        } catch (err) {
          updateStep(1, 'failed', String(err));
          hasErrors = true;
        }

        // Step 3: Copy Startech
        updateStep(2, 'in_progress');
        try {
          await invoke('copy_startech', { folderName: config.folderName });
          updateStep(2, 'completed');
        } catch (err) {
          updateStep(2, 'failed', String(err));
          hasErrors = true;
        }

        // Step 4: Copy Template
        updateStep(3, 'in_progress');
        try {
          await invoke('copy_template', { folderName: config.folderName });
          updateStep(3, 'completed');
        } catch (err) {
          updateStep(3, 'failed', String(err));
          hasErrors = true;
        }

        // Step 5: Copy extra files
        if (config.extraFiles.length > 0) {
          updateStep(4, 'in_progress');
          try {
            await invoke('copy_extra_files', { 
              folderName: config.folderName,
              files: config.extraFiles 
            });
            updateStep(4, 'completed');
          } catch (err) {
            updateStep(4, 'failed', String(err));
            hasErrors = true;
          }
        } else {
          updateStep(4, 'skipped');
        }

        // Step 6: Create shortcuts
        updateStep(5, 'in_progress');
        try {
          await invoke('create_shortcuts', { folderName: config.folderName });
          updateStep(5, 'completed');
        } catch (err) {
          updateStep(5, 'failed', String(err));
          hasErrors = true;
        }

        // Step 7: Set file associations
        updateStep(6, 'in_progress');
        try {
          await invoke('set_file_associations', { folderName: config.folderName });
          updateStep(6, 'completed');
        } catch (err) {
          updateStep(6, 'failed', String(err));
          hasErrors = true;
        }

      } catch (err) {
        console.error('Installation error:', err);
        hasErrors = true;
      }

      // Complete
      onComplete({
        success: !hasErrors,
        steps: finalSteps,
        installPath: `C:\\${config.folderName}`,
      });
    };

    runInstallation();
  }, [config, steps, onStepUpdate, onComplete]);

  const completedSteps = steps.filter(s => s.status === 'completed' || s.status === 'skipped').length;
  const progress = Math.round((completedSteps / steps.length) * 100);

  const getStepLabel = (stepId: string): string => {
    return t(stepId as TranslationKey);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start px-6 py-8 animate-fade-in">
      {/* Logo */}
      <div className="mb-6">
        <Logo size="md" />
      </div>

      {/* Progress Title */}
      <h2 className="text-xl font-semibold text-slate-700 mb-6">
        {t('progress')}
      </h2>

      {/* Progress Bar */}
      <div className="w-full max-w-md mb-8">
        <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
          <span>{t('installing')}</span>
          <span className="font-mono">{progress}%</span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-startech-teal via-startech-cyan to-startech-teal 
                       bg-[length:200%_100%] animate-[shimmer_2s_linear_infinite] rounded-full
                       transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps List */}
      <div className="w-full max-w-md bg-white rounded-2xl p-5 shadow-lg shadow-slate-200/50 border border-slate-100">
        <div className="space-y-3">
          {steps.map((step, _index) => (
            <div 
              key={step.id}
              className={`flex items-center gap-3 py-2 px-3 rounded-xl transition-all duration-300
                ${step.status === 'in_progress' ? 'bg-startech-gold/10' : ''}
                ${step.status === 'completed' ? 'bg-startech-teal/5' : ''}
                ${step.status === 'failed' ? 'bg-startech-coral/5' : ''}
              `}
            >
              {/* Status Icon */}
              <span className={`text-xl font-bold ${stepColors[step.status]} transition-all`}>
                {stepIcons[step.status]}
              </span>
              
              {/* Step Label */}
              <span className={`flex-1 text-sm ${
                step.status === 'pending' ? 'text-slate-400' : 
                step.status === 'in_progress' ? 'text-slate-700 font-medium' :
                step.status === 'completed' ? 'text-slate-600' :
                step.status === 'failed' ? 'text-startech-coral' :
                'text-slate-400'
              }`}>
                {getStepLabel(step.id)}
              </span>

              {/* Spinner for in_progress */}
              {step.status === 'in_progress' && (
                <div className="w-5 h-5 border-2 border-startech-gold border-t-transparent rounded-full animate-spin" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Install Path */}
      <div className="mt-6 text-sm text-slate-400 font-mono">
        C:\{config.folderName}
      </div>
    </div>
  );
};

