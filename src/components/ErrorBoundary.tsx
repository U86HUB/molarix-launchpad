
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });
    
    // Log error for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle>Something went wrong</CardTitle>
              <CardDescription>
                We encountered an unexpected error. This has been logged and our team will investigate.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2">
                <Button onClick={this.handleRetry} className="w-full" variant="default">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button onClick={this.handleGoHome} className="w-full" variant="outline">
                  <Home className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Button>
              </div>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                  <summary className="cursor-pointer font-medium">Error Details (Dev Mode)</summary>
                  <pre className="mt-2 whitespace-pre-wrap">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
