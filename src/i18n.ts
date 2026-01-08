export type Language = 'en' | 'he';

export const translations = {
  en: {
    title: 'Startech Installer',
    subtitle: 'Processing 3.5.4 Setup',
    tagline: 'Program what you love',
    
    // Config screen
    installLocation: 'Install Location',
    folderName: 'Folder Name',
    folderNamePlaceholder: 'Programming',
    extraFiles: 'Extra Files',
    extraFilesDesc: 'Drag & drop files here or click to browse',
    extraFilesAdded: 'files added',
    removeFile: 'Remove',
    clearAll: 'Clear All',
    
    // Buttons
    install: 'Install Processing',
    installing: 'Installing...',
    close: 'Close',
    openProcessing: 'Open Processing',
    browseFiles: 'Browse Files',
    
    // Progress screen
    progress: 'Installation Progress',
    step1: 'Creating Programming folder',
    step2: 'Extracting Processing 3.5.4',
    step3: 'Copying Startech folder',
    step4: 'Copying Template folder',
    step5: 'Copying extra files',
    step6: 'Creating desktop shortcuts',
    step7: 'Setting up file associations',
    
    // Status
    pending: 'Pending',
    inProgress: 'In Progress',
    completed: 'Completed',
    failed: 'Failed',
    skipped: 'Skipped',
    
    // Completion screen
    installComplete: 'Installation Complete!',
    installFailed: 'Installation Failed',
    shortcutsCreated: 'Desktop shortcuts created:',
    processing: 'Processing',
    startech: 'Startech',
    template: 'Template',
    autoCloseIn: 'Auto-closing in',
    seconds: 'seconds',
    
    // Errors
    errorCreateFolder: 'Failed to create folder',
    errorExtract: 'Failed to extract Processing',
    errorCopyStartech: 'Failed to copy Startech folder',
    errorCopyTemplate: 'Failed to copy Template folder',
    errorCopyExtra: 'Failed to copy extra files',
    errorShortcuts: 'Failed to create shortcuts',
    errorAssociation: 'Failed to set file associations',
    
    // Misc
    adminRequired: 'Administrator privileges required',
    version: 'Version 2.0',
  },
  he: {
    title: 'מתקין Startech',
    subtitle: 'התקנת Processing 3.5.4',
    tagline: 'לתכנת את מה שאוהבים',
    
    // Config screen
    installLocation: 'מיקום התקנה',
    folderName: 'שם התיקייה',
    folderNamePlaceholder: 'Programming',
    extraFiles: 'קבצים נוספים',
    extraFilesDesc: 'גרור קבצים לכאן או לחץ לבחירה',
    extraFilesAdded: 'קבצים נוספו',
    removeFile: 'הסר',
    clearAll: 'נקה הכל',
    
    // Buttons
    install: 'התקן Processing',
    installing: 'מתקין...',
    close: 'סגור',
    openProcessing: 'פתח Processing',
    browseFiles: 'בחר קבצים',
    
    // Progress screen
    progress: 'התקדמות ההתקנה',
    step1: 'יוצר תיקיית Programming',
    step2: 'מחלץ Processing 3.5.4',
    step3: 'מעתיק תיקיית Startech',
    step4: 'מעתיק תיקיית Template',
    step5: 'מעתיק קבצים נוספים',
    step6: 'יוצר קיצורי דרך על שולחן העבודה',
    step7: 'מגדיר שיוך קבצים',
    
    // Status
    pending: 'ממתין',
    inProgress: 'בתהליך',
    completed: 'הושלם',
    failed: 'נכשל',
    skipped: 'דולג',
    
    // Completion screen
    installComplete: 'ההתקנה הושלמה!',
    installFailed: 'ההתקנה נכשלה',
    shortcutsCreated: 'קיצורי דרך נוצרו על שולחן העבודה:',
    processing: 'Processing',
    startech: 'Startech',
    template: 'Template',
    autoCloseIn: 'נסגר אוטומטית בעוד',
    seconds: 'שניות',
    
    // Errors
    errorCreateFolder: 'נכשל ביצירת תיקייה',
    errorExtract: 'נכשל בחילוץ Processing',
    errorCopyStartech: 'נכשל בהעתקת תיקיית Startech',
    errorCopyTemplate: 'נכשל בהעתקת תיקיית Template',
    errorCopyExtra: 'נכשל בהעתקת קבצים נוספים',
    errorShortcuts: 'נכשל ביצירת קיצורי דרך',
    errorAssociation: 'נכשל בהגדרת שיוך קבצים',
    
    // Misc
    adminRequired: 'נדרשות הרשאות מנהל',
    version: 'גרסה 2.0',
  }
} as const;

export type TranslationKey = keyof typeof translations.en;

export const useTranslation = (lang: Language) => {
  return (key: TranslationKey): string => {
    return translations[lang][key] || translations.en[key] || key;
  };
};

