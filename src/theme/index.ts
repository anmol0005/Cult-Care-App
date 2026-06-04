export const Colors = {
  // Brand Colors
  primary: '#6366F1', // Premium Indigo
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',
  accent: '#10B981', // Emerald green accent
  
  // Neutral Colors (Dark Mode Default for Premium Look)
  background: '#0F172A', // Slate 900
  cardBackground: '#1E293B', // Slate 800
  border: '#334155', // Slate 700
  
  text: '#F8FAFC', // Slate 50
  textSecondary: '#94A3B8', // Slate 400
  textMuted: '#64748B', // Slate 500
  
  // Feedback
  error: '#EF4444', // Red 500
  errorLight: '#FEE2E2',
  success: '#10B981',
  
  // Overlay/Glass effect emulation
  overlay: 'rgba(255, 255, 255, 0.03)',
  overlayDark: 'rgba(0, 0, 0, 0.3)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Typography = {
  header: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
    letterSpacing: 0.5,
  },
  subheader: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: Colors.text,
    lineHeight: 20,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: Colors.textMuted,
  },
  error: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: Colors.error,
  },
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5.0,
    elevation: 5,
  },
};

export default {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
};
