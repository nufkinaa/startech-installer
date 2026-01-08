import { useState, useRef } from 'react';
import { open } from '@tauri-apps/plugin-dialog';
import { Logo } from './Logo';
import { InstallConfig } from '../App';
import { TranslationKey } from '../i18n';

type WelcomeScreenProps = {
  config: InstallConfig;
  onConfigChange: (config: Partial<InstallConfig>) => void;
  onInstall: () => void;
  t: (key: TranslationKey) => string;
  isRtl: boolean;
};

export const WelcomeScreen = ({ config, onConfigChange, onInstall, t, isRtl: _isRtl }: WelcomeScreenProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showFolderInput, setShowFolderInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    // Note: In Tauri, drag and drop provides full paths via dataTransfer
    const files = Array.from(e.dataTransfer.files).map(f => (f as File & { path?: string }).path || f.name);
    if (files.length > 0) {
      onConfigChange({ extraFiles: [...config.extraFiles, ...files] });
    }
  };

  const handleBrowseFiles = async () => {
    try {
      const selected = await open({
        multiple: true,
        directory: false,
      });
      
      if (selected) {
        const files = Array.isArray(selected) ? selected : [selected];
        onConfigChange({ extraFiles: [...config.extraFiles, ...files] });
      }
    } catch (err) {
      console.error('Error selecting files:', err);
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = config.extraFiles.filter((_, i) => i !== index);
    onConfigChange({ extraFiles: newFiles });
  };

  const handleClearAll = () => {
    onConfigChange({ extraFiles: [] });
  };

  const handleFolderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[<>:"/\\|?*]/g, ''); // Remove invalid chars
    onConfigChange({ folderName: value || 'Programming' });
  };

  const handleInstallClick = () => {
    onInstall();
  };

  const handleInstallKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onInstall();
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start px-6 py-8 animate-fade-in overflow-y-auto">
      {/* Logo and Title */}
      <div className="flex flex-col items-center gap-3 mb-8">
        <Logo size="lg" showTagline tagline={t('tagline')} />
        <div className="text-center">
          <h1 className="text-xl font-semibold text-slate-700">{t('subtitle')}</h1>
        </div>
      </div>

      {/* Configuration Card */}
      <div className="w-full max-w-md space-y-4">
        {/* Install Location */}
        <div className="bg-white rounded-2xl p-5 shadow-lg shadow-slate-200/50 border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <span className="text-lg">📁</span>
              {t('installLocation')}
            </label>
            <button
              onClick={() => setShowFolderInput(!showFolderInput)}
              className="text-xs text-startech-cyan hover:text-startech-teal transition-colors"
              tabIndex={0}
              aria-label="Change folder name"
            >
              {showFolderInput ? '✕' : '✎ Edit'}
            </button>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-3 font-mono text-sm">
            <span className="text-slate-400">C:\</span>
            {showFolderInput ? (
              <input
                type="text"
                value={config.folderName}
                onChange={handleFolderNameChange}
                className="flex-1 bg-transparent border-b-2 border-startech-teal outline-none text-slate-700 font-mono"
                placeholder={t('folderNamePlaceholder')}
                autoFocus
              />
            ) : (
              <span className="text-slate-700 font-semibold">{config.folderName}</span>
            )}
          </div>
        </div>

        {/* Extra Files Drop Zone */}
        <div className="bg-white rounded-2xl p-5 shadow-lg shadow-slate-200/50 border border-slate-100">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-3">
            <span className="text-lg">➕</span>
            {t('extraFiles')}
            <span className="text-xs font-normal text-slate-400">(optional)</span>
          </label>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleBrowseFiles}
            onKeyDown={(e) => e.key === 'Enter' && handleBrowseFiles()}
            className={`
              relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer
              transition-all duration-300 group
              ${isDragging 
                ? 'border-startech-teal bg-startech-teal/5 scale-[1.02]' 
                : 'border-slate-200 hover:border-startech-teal hover:bg-slate-50'
              }
            `}
            role="button"
            tabIndex={0}
            aria-label={t('extraFilesDesc')}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files || []).map(f => f.name);
                onConfigChange({ extraFiles: [...config.extraFiles, ...files] });
              }}
            />
            
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
              {isDragging ? '📥' : '📎'}
            </div>
            <p className="text-sm text-slate-500">
              {t('extraFilesDesc')}
            </p>
          </div>

          {/* File List */}
          {config.extraFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{config.extraFiles.length} {t('extraFilesAdded')}</span>
                <button
                  onClick={handleClearAll}
                  className="text-startech-coral hover:text-red-600 transition-colors"
                  tabIndex={0}
                >
                  {t('clearAll')}
                </button>
              </div>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {config.extraFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2 text-xs group"
                  >
                    <span className="truncate flex-1 text-slate-600" dir="ltr">
                      {file.split(/[/\\]/).pop()}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile(index);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-startech-coral hover:text-red-600 transition-all ml-2"
                      tabIndex={0}
                      aria-label={`${t('removeFile')} ${file}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Install Button */}
      <div className="mt-8 w-full max-w-md">
        <button
          onClick={handleInstallClick}
          onKeyDown={handleInstallKeyDown}
          className="w-full py-4 px-8 rounded-2xl font-bold text-lg text-white
                     bg-gradient-to-r from-startech-teal via-startech-cyan to-startech-teal
                     bg-[length:200%_100%] hover:bg-[position:100%_0]
                     shadow-lg shadow-startech-teal/30 hover:shadow-xl hover:shadow-startech-teal/40
                     transform hover:scale-[1.02] active:scale-[0.98]
                     transition-all duration-300 ease-out
                     focus:outline-none focus:ring-4 focus:ring-startech-teal/50"
          tabIndex={0}
          aria-label={t('install')}
        >
          <span className="flex items-center justify-center gap-3">
            <span className="text-2xl">▶</span>
            {t('install')}
          </span>
        </button>
      </div>
    </div>
  );
};

