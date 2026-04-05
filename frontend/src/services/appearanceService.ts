export type AppearanceTheme = 'dark' | 'light';
export type AppearanceAccent = 'cyan' | 'violet' | 'pink' | 'green' | 'blue' | 'amber';
export type AppearanceFontSize = 'small' | 'normal' | 'large';

export interface AppearancePrefs {
  theme: AppearanceTheme;
  accentColor: AppearanceAccent;
  fontSize: AppearanceFontSize;
}

export const APPEARANCE_STORAGE_KEY = 'chatflow_appearance';

const DEFAULT_APPEARANCE: AppearancePrefs = {
  theme: 'dark',
  accentColor: 'cyan',
  fontSize: 'normal',
};

const accentRgbMap: Record<AppearanceAccent, string> = {
  cyan: '34 211 238',
  violet: '139 92 246',
  pink: '236 72 153',
  green: '16 185 129',
  blue: '59 130 246',
  amber: '245 158 11',
};

const fontSizeMap: Record<AppearanceFontSize, string> = {
  small: '14px',
  normal: '16px',
  large: '18px',
};

export const loadAppearancePrefs = (): AppearancePrefs => {
  try {
    const raw = localStorage.getItem(APPEARANCE_STORAGE_KEY);
    if (!raw) return DEFAULT_APPEARANCE;
    const parsed = JSON.parse(raw) as Partial<AppearancePrefs>;

    return {
      theme: parsed.theme === 'light' ? 'light' : 'dark',
      accentColor: (parsed.accentColor && parsed.accentColor in accentRgbMap
        ? parsed.accentColor
        : 'cyan') as AppearanceAccent,
      fontSize: parsed.fontSize === 'small' || parsed.fontSize === 'large' ? parsed.fontSize : 'normal',
    };
  } catch {
    return DEFAULT_APPEARANCE;
  }
};

export const saveAppearancePrefs = (prefs: AppearancePrefs): void => {
  localStorage.setItem(APPEARANCE_STORAGE_KEY, JSON.stringify(prefs));
};

export const applyAppearancePrefs = (prefs: AppearancePrefs): void => {
  const root = document.documentElement;
  root.setAttribute('data-theme', prefs.theme);
  root.style.setProperty('--accent-rgb', accentRgbMap[prefs.accentColor]);
  root.style.setProperty('--base-font-size', fontSizeMap[prefs.fontSize]);
};

export const getDefaultAppearancePrefs = (): AppearancePrefs => DEFAULT_APPEARANCE;
