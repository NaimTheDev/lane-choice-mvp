
'use client';

import { useEffect } from 'react';
import { useAuth } from './auth-provider';

const colorThemes: Record<string, { primary: string; accent: string }> = {
  teal: { primary: '180 84% 40%', accent: '180 84% 45%' },
  rose: { primary: '346.8 77.2% 49.8%', accent: '346.8 77.2% 54.8%' },
  violet: { primary: '262.1 83.3% 57.8%', accent: '262.1 83.3% 62.8%' },
  orange: { primary: '24.6 95% 53.1%', accent: '24.6 95% 58.1%' },
  blue: { primary: '221.2 83.2% 53.3%', accent: '221.2 83.2% 58.3%' },
};

export function CustomTheme() {
  const { appUser } = useAuth();

  useEffect(() => {
    const themeName = appUser?.themeColor || 'teal';
    const selectedTheme = colorThemes[themeName];

    if (selectedTheme) {
      document.documentElement.style.setProperty('--primary', selectedTheme.primary);
      document.documentElement.style.setProperty('--accent', selectedTheme.accent);
    }
  }, [appUser]);

  return null;
}
