import { Component } from 'react';
import type { ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: string) => void;
}

/**
 * エラー境界コンポーネント
 * React コンポーネントツリー内のJavaScriptエラーをキャッチし、
 * フォールバックUIを表示する
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // エラーが発生した場合の状態更新
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // エラー情報を状態に保存
    this.setState({
      errorInfo: errorInfo.componentStack || null,
    });

    // エラーログの記録
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // 親コンポーネントにエラーを通知
    if (this.props.onError) {
      this.props.onError(error, errorInfo.componentStack || '');
    }
  }

  handleRetry = () => {
    // エラー状態をリセット
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // カスタムフォールバックUIが提供されている場合はそれを使用
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // デフォルトのエラーUI
      return (
        <div className="min-h-screen flex items-center justify-center bg-base-100">
          <div className="card w-96 bg-base-200 shadow-xl">
            <div className="card-body text-center">
              <div className="text-6xl mb-4">🐕</div>
              <h2 className="card-title justify-center text-error">
                エラーが発生しました
              </h2>
              <p className="text-base-content/70 mb-4">
                申し訳ございません。予期しないエラーが発生しました。
                ページを再読み込みするか、しばらく時間をおいてから再度お試しください。
              </p>

              {/* 開発環境でのエラー詳細表示 */}
              {import.meta.env.DEV && this.state.error && (
                <div className="collapse collapse-arrow bg-base-300 mb-4">
                  <input type="checkbox" />
                  <div className="collapse-title text-sm font-medium">
                    エラー詳細を表示
                  </div>
                  <div className="collapse-content">
                    <div className="text-xs text-left bg-base-100 p-3 rounded">
                      <p className="font-bold text-error mb-2">
                        {this.state.error.name}: {this.state.error.message}
                      </p>
                      {this.state.errorInfo && (
                        <pre className="whitespace-pre-wrap text-xs">
                          {this.state.errorInfo}
                        </pre>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="card-actions justify-center">
                <button className="btn btn-primary" onClick={this.handleRetry}>
                  再試行
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() => window.location.reload()}
                >
                  ページを再読み込み
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * 関数コンポーネント用のエラー境界ラッパー
 */
interface WithErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: string) => void;
}

export function WithErrorBoundary({
  children,
  fallback,
  onError,
}: WithErrorBoundaryProps) {
  return (
    <ErrorBoundary fallback={fallback} onError={onError}>
      {children}
    </ErrorBoundary>
  );
}
