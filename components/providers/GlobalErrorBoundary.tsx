'use client';

import React from 'react';
import { TriangleAlert } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

/**
 * GlobalErrorBoundary — catches unexpected render-phase errors anywhere in the
 * React tree and renders a friendly fallback instead of a blank screen.
 *
 * Must be a class component: React's componentDidCatch lifecycle is not yet
 * available as a hook.
 */
export class GlobalErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error?.message ?? 'An unexpected error occurred.',
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    // In production you would send this to an error-tracking service.
    console.error('[ErrorBoundary] Uncaught error:', error, info.componentStack);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, message: '' });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <TriangleAlert className="h-6 w-6 text-red-500" />
          </div>
          <h1 className="text-lg font-semibold text-slate-800">
            Đã xảy ra lỗi không mong đợi
          </h1>
          <p className="max-w-sm text-sm text-slate-500">{this.state.message}</p>
          <button
            onClick={this.handleReset}
            className="mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors"
          >
            Thử lại
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
