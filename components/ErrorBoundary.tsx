import React, { Component, ErrorInfo, ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // You can also log the error to an external error reporting service
    // logErrorToService(error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ThemedView style={styles.container}>
          <ThemedView style={styles.errorContainer} backgroundColor="secondary">
            <ThemedText type="title" style={styles.errorTitle}>
              Oops! Something went wrong
            </ThemedText>
            <ThemedText style={styles.errorMessage}>
              The application encountered an unexpected error. This has been logged and we'll work to fix it.
            </ThemedText>
            {__DEV__ && this.state.error && (
              <ThemedView style={styles.debugInfo}>
                <ThemedText type="subtitle" style={styles.debugTitle}>
                  Debug Information:
                </ThemedText>
                <ThemedText style={styles.debugText}>
                  {this.state.error.message}
                </ThemedText>
                <ThemedText style={styles.debugText}>
                  {this.state.error.stack}
                </ThemedText>
              </ThemedView>
            )}
            <ThemedView style={styles.buttonContainer}>
              <ThemedText
                style={styles.retryButton}
                onPress={this.handleRetry}
              >
                Try Again
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    padding: 24,
    borderRadius: 12,
    margin: 16,
    maxWidth: 400,
  },
  errorTitle: {
    textAlign: 'center',
    marginBottom: 16,
  },
  errorMessage: {
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  debugInfo: {
    marginBottom: 24,
    padding: 12,
    borderRadius: 8,
  },
  debugTitle: {
    marginBottom: 8,
  },
  debugText: {
    fontFamily: 'monospace',
    fontSize: 12,
    marginBottom: 4,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  retryButton: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default ErrorBoundary; 
