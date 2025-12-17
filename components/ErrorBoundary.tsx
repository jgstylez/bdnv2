import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { logger } from '../lib/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('ErrorBoundary caught an error', error, { errorInfo });
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View
          style={{
            flex: 1,
            backgroundColor: '#232323',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        >
          <ScrollView
            contentContainerStyle={{
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100%',
            }}
          >
            <MaterialIcons name="error-outline" size={64} color="#ff4444" />
            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                color: '#ffffff',
                marginTop: 20,
                marginBottom: 10,
                textAlign: 'center',
              }}
            >
              Something went wrong
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: 'rgba(255, 255, 255, 0.7)',
                textAlign: 'center',
                marginBottom: 30,
                lineHeight: 24,
              }}
            >
              {this.state.error?.message || 'An unexpected error occurred'}
            </Text>
            <TouchableOpacity
              onPress={this.handleReset}
              style={{
                backgroundColor: '#ba9988',
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 8,
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  color: '#ffffff',
                  fontSize: 16,
                  fontWeight: '600',
                }}
              >
                Try Again
              </Text>
            </TouchableOpacity>
            {__DEV__ && this.state.error && (
              <View
                style={{
                  backgroundColor: '#474747',
                  borderRadius: 8,
                  padding: 16,
                  width: '100%',
                  maxWidth: 600,
                  marginTop: 20,
                }}
              >
                <Text
                  style={{
                    color: '#ff4444',
                    fontSize: 12,
                    fontFamily: 'monospace',
                    marginBottom: 8,
                  }}
                >
                  {this.state.error.toString()}
                </Text>
                {this.state.errorInfo && (
                  <Text
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: 11,
                      fontFamily: 'monospace',
                    }}
                  >
                    {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </View>
            )}
          </ScrollView>
        </View>
      );
    }

    return this.props.children;
  }
}

