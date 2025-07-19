import { StyleSheet } from 'react-native';
import { borderRadius, shadows, spacing, typography } from './spacing';

// Common form styles that can be reused across screens
export const formStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  scrollView: {
    flex: 1,
  },

  // Header styles
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.md,
  },
  title: {
    marginBottom: spacing.xs,
    textAlign: 'center',
    ...typography.title2,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
    ...typography.subhead,
    lineHeight: 20,
    paddingHorizontal: spacing.lg,
  },

  // Form styles
  form: {
    marginBottom: spacing.lg,
  },
  inputWrapper: {
    paddingHorizontal: 0,
    marginBottom: spacing.sm,
  },
  inputContainer: {
    borderBottomWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.xs,
  },
  errorText: {
    color: '#FF6B6B',
    ...typography.caption1,
    fontWeight: '500',
    marginTop: spacing.xs,
  },
  helperText: {
    ...typography.caption1,
    opacity: 0.6,
    fontStyle: 'italic',
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },

  // Preview and summary styles
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  previewText: {
    ...typography.footnote,
    fontWeight: '500',
    opacity: 0.8,
  },
  summaryContainer: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  summaryTitle: {
    ...typography.headline,
    marginBottom: spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    ...typography.footnote,
    opacity: 0.7,
  },
  summaryValue: {
    ...typography.footnote,
    fontWeight: '600',
  },

  // Button styles
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  deleteButtonContainer: {
    width: '100%',
    marginBottom: spacing.sm,
  },
  deleteButton: {
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    ...typography.subhead,
    fontWeight: '600',
  },
  cancelButtonContainer: {
    flex: 1,
  },
  cancelButton: {
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
  },
  cancelButtonText: {
    ...typography.subhead,
    fontWeight: '600',
  },
  saveButtonContainer: {
    flex: 2,
  },
  saveButton: {
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    ...shadows.md,
  },
  saveButtonText: {
    color: '#FFFFFF',
    ...typography.subhead,
    fontWeight: '600',
  },

  // Label styles
  label: {
    ...typography.footnote,
    fontWeight: '600',
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  currencySymbol: {
    ...typography.callout,
    fontWeight: '600',
    marginRight: spacing.sm,
  },
});

// Common input styles for React Native Elements
export const inputStyles = {
  inputStyle: { fontSize: 16 },
  labelStyle: { fontSize: 14, fontWeight: '600' },
  placeholderTextColor: 'rgba(0,0,0,0.6)',
  containerStyle: { paddingHorizontal: 0, marginBottom: 8 },
  inputContainerStyle: {
    borderBottomWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 4,
  },
  errorStyle: {
    color: '#FF6B6B',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
}; 
