// Design tokens from Figma - Real world design system

export const colors = {
  brand: {
    primary: '#4F46E5',
    primaryHover: '#4338CA',
    secondary: '#7C3AED',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
  },
  surface: {
    white: '#FFFFFF',
    light: '#F9FAFB',
    muted: '#F3F4F6',
    border: '#E5E7EB',
  },
  status: {
    inProgress: '#F59E0B',
    inProgressBg: '#FEF3C7',
    completed: '#3B82F6',
    completedBg: '#DBEAFE',
    disabled: '#9CA3AF',
    disabledBg: '#F3F4F6',
    defaultBg: '#F9FAFB',
  },
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    disabled: '#9CA3AF',
  }
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
} as const;

export const typography = {
  heading: {
    fontSize: '18px',
    lineHeight: '28px',
    fontWeight: '600',
  },
  body: {
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: '400',
  },
  small: {
    fontSize: '12px',
    lineHeight: '16px',
    fontWeight: '400',
  }
} as const;

export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
} as const;

export default { colors, spacing, typography, borderRadius };
