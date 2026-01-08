import { useState, useCallback } from 'react';
import { Language, useTranslation } from './i18n';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ProgressScreen } from './components/ProgressScreen';
import { CompletionScreen } from './components/CompletionScreen';
import { LanguageToggle } from './components/LanguageToggle';

export type AppScreen = 'welcome' | 'progress' | 'completion';

export type InstallStep = {
  id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  error?: string;
};

export type InstallConfig = {
  folderName: string;
  extraFiles: string[];
};

export type InstallResult = {
  success: boolean;
  steps: InstallStep[];
  installPath: string;
};

const App = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [screen, setScreen] = useState<AppScreen>('welcome');
  const [config, setConfig] = useState<InstallConfig>({
    folderName: 'Programming',
    extraFiles: [],
  });
  const [installResult, setInstallResult] = useState<InstallResult | null>(null);
  const [steps, setSteps] = useState<InstallStep[]>([
    { id: 'step1', status: 'pending' },
    { id: 'step2', status: 'pending' },
    { id: 'step3', status: 'pending' },
    { id: 'step4', status: 'pending' },
    { id: 'step5', status: 'pending' },
    { id: 'step6', status: 'pending' },
    { id: 'step7', status: 'pending' },
  ]);

  const t = useTranslation(language);
  const isRtl = language === 'he';

  const handleLanguageChange = useCallback((lang: Language) => {
    setLanguage(lang);
  }, []);

  const handleConfigChange = useCallback((newConfig: Partial<InstallConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  const handleInstallStart = useCallback(() => {
    setScreen('progress');
  }, []);

  const handleStepUpdate = useCallback((stepId: string, status: InstallStep['status'], error?: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status, error } : step
    ));
  }, []);

  const handleInstallComplete = useCallback((result: InstallResult) => {
    setInstallResult(result);
    setScreen('completion');
  }, []);

  return (
    <div 
      className="h-full w-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100 no-select"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Header with language toggle */}
      <div className="absolute top-4 right-4 z-50">
        <LanguageToggle 
          currentLanguage={language} 
          onLanguageChange={handleLanguageChange} 
        />
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {screen === 'welcome' && (
          <WelcomeScreen
            config={config}
            onConfigChange={handleConfigChange}
            onInstall={handleInstallStart}
            t={t}
            isRtl={isRtl}
          />
        )}
        
        {screen === 'progress' && (
          <ProgressScreen
            config={config}
            steps={steps}
            onStepUpdate={handleStepUpdate}
            onComplete={handleInstallComplete}
            t={t}
            isRtl={isRtl}
          />
        )}
        
        {screen === 'completion' && installResult && (
          <CompletionScreen
            result={installResult}
            t={t}
            isRtl={isRtl}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="py-2 text-center text-xs text-slate-400">
        {t('version')} • st@rTech
      </footer>
    </div>
  );
};

export default App;

