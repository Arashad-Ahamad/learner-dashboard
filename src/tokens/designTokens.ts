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
    // Accessible text color for the in-progress badge. #F59E0B on #FEF3C7 is
    // only 1.93:1 — fails WCAG AA (4.5:1). #92400E (amber-800) hits 6.37:1.
    inProgressText: '#92400E',
    completed: '#3B82F6',
    completedBg: '#DBEAFE',
    // #3B82F6 on #DBEAFE is 3.01:1 — fails AA. #1E40AF (blue-800) hits 7.15:1.
    completedText: '#1E40AF',
    disabled: '#9CA3AF',
    disabledBg: '#F3F4F6',
    // #9CA3AF on #F3F4F6 is 2.31:1 — fails AA. #4B5563 (gray-600) hits 6.87:1.
    disabledText: '#4B5563',
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
