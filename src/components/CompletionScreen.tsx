import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { exit } from '@tauri-apps/plugin-process';
import { Logo } from './Logo';
import { InstallResult } from '../App';
import { TranslationKey } from '../i18n';

type CompletionScreenProps = {
  result: InstallResult;
  t: (key: TranslationKey) => string;
  isRtl: boolean;
};

const AUTO_CLOSE_SECONDS = 20;

export const CompletionScreen = ({ result, t, isRtl: _isRtl }: CompletionScreenProps) => {
  const [countdown, setCountdown] = useState(AUTO_CLOSE_SECONDS);
  const [isPaused, setIsPaused] = useState(false);

  const handleClose = useCallback(async () => {
    try {
      await exit(0);
    } catch (err) {
      window.close();
    }
  }, []);

  const handleOpenProcessing = useCallback(async () => {
    try {
      await invoke('open_processing', { folderName: result.installPath.split('\\').pop() });
    } catch (err) {
      console.error('Failed to open Processing:', err);
    }
  }, [result.installPath]);

  useEffect(() => {
    if (isPaused || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          handleClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, countdown, handleClose]);

  const handlePauseTimer = () => {
    setIsPaused(true);
  };

  const failedSteps = result.steps.filter(s => s.status === 'failed');

  return (
    <div 
      className="flex-1 flex flex-col items-center justify-start px-6 py-8 animate-fade-in"
      onMouseEnter={handlePauseTimer}
      onFocus={handlePauseTimer}
    >
      {/* Logo */}
      <div className="mb-6">
        <Logo size="md" />
      </div>

      {/* Status Icon */}
      <div className={`text-6xl mb-4 animate-slide-up ${result.success ? '' : 'animate-pulse'}`}>
        {result.success ? '✅' : '⚠️'}
      </div>

      {/* Status Title */}
      <h2 className={`text-2xl font-bold mb-2 ${result.success ? 'text-startech-teal' : 'text-startech-gold'}`}>
        {result.success ? t('installComplete') : t('installFailed')}
      </h2>

      {/* Install Path */}
      <p className="text-sm text-slate-500 font-mono mb-6">
        {result.installPath}
      </p>

      {/* Success Content */}
      {result.success && (
        <div className="w-full max-w-md bg-white rounded-2xl p-5 shadow-lg shadow-slate-200/50 border border-slate-100 mb-6">
          <h3 className="text-sm font-semibold text-slate-600 mb-3">
            {t('shortcutsCreated')}
          </h3>
          <div className="space-y-2">
            {[
              { icon: '🎨', name: t('processing') },
              { icon: '⭐', name: t('startech') },
              { icon: '📄', name: t('template') },
            ].map((shortcut, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 py-2 px-3 bg-slate-50 rounded-xl"
              >
                <span className="text-xl">{shortcut.icon}</span>
                <span className="text-sm text-slate-700">{shortcut.name}</span>
                <span className="text-startech-teal ml-auto">✓</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Failed Steps */}
      {failedSteps.length > 0 && (
        <div className="w-full max-w-md bg-startech-coral/5 rounded-2xl p-5 border border-startech-coral/20 mb-6">
          <h3 className="text-sm font-semibold text-startech-coral mb-3">
            {failedSteps.length} step(s) failed:
          </h3>
          <div className="space-y-2">
            {failedSteps.map((step, index) => (
              <div key={index} className="text-sm text-slate-600">
                <span className="text-startech-coral">✕</span> {t(step.id as TranslationKey)}
                {step.error && (
                  <p className="text-xs text-slate-400 mt-1 ml-4 font-mono">{step.error}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="w-full max-w-md flex gap-3">
        {result.success && (
          <button
            onClick={handleOpenProcessing}
            className="flex-1 py-3 px-6 rounded-xl font-semibold text-white
                       bg-gradient-to-r from-startech-cyan to-startech-teal
                       hover:shadow-lg hover:shadow-startech-teal/30
                       transform hover:scale-[1.02] active:scale-[0.98]
                       transition-all duration-300
                       focus:outline-none focus:ring-4 focus:ring-startech-teal/50"
            tabIndex={0}
            aria-label={t('openProcessing')}
          >
            {t('openProcessing')}
          </button>
        )}
        <button
          onClick={handleClose}
          className={`${result.success ? '' : 'flex-1'} py-3 px-6 rounded-xl font-semibold
                     bg-slate-100 text-slate-600 hover:bg-slate-200
                     transform hover:scale-[1.02] active:scale-[0.98]
                     transition-all duration-300
                     focus:outline-none focus:ring-4 focus:ring-slate-300`}
          tabIndex={0}
          aria-label={t('close')}
        >
          {t('close')}
        </button>
      </div>

      {/* Auto-close Timer */}
      {!isPaused && countdown > 0 && (
        <div className="mt-6 text-sm text-slate-400">
          {t('autoCloseIn')} <span className="font-mono font-bold text-startech-teal">{countdown}</span> {t('seconds')}
        </div>
      )}

      {/* Progress ring for countdown */}
      {!isPaused && countdown > 0 && (
        <div className="mt-4 relative w-12 h-12">
          <svg className="w-12 h-12 transform -rotate-90">
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-slate-100"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              className="text-startech-teal transition-all duration-1000"
              style={{
                strokeDasharray: `${2 * Math.PI * 20}`,
                strokeDashoffset: `${2 * Math.PI * 20 * (1 - countdown / AUTO_CLOSE_SECONDS)}`,
              }}
            />
          </svg>
        </div>
      )}
    </div>
  );
};

