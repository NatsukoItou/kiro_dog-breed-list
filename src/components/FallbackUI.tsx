import type { ReactNode } from 'react';

interface FallbackUIProps {
  type?: 'error' | 'network' | 'notFound' | 'loading' | 'empty';
  title?: string;
  message?: string;
  icon?: ReactNode;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
  }>;
  children?: ReactNode;
}

/**
 * 汎用フォールバックUIコンポーネント
 * エラー、ローディング、空状態などの様々な状況で使用
 */
export function FallbackUI({
  type = 'error',
  title,
  message,
  icon,
  actions = [],
  children,
}: FallbackUIProps) {
  const getDefaultContent = () => {
    switch (type) {
      case 'network':
        return {
          icon: '🌐',
          title: 'ネットワークエラー',
          message: 'インターネット接続を確認してください。',
        };
      case 'notFound':
        return {
          icon: '🔍',
          title: 'ページが見つかりません',
          message: 'お探しのページは存在しないか、移動された可能性があります。',
        };
      case 'loading':
        return {
          icon: <span className="loading loading-spinner loading-lg"></span>,
          title: '読み込み中...',
          message: 'しばらくお待ちください。',
        };
      case 'empty':
        return {
          icon: '📭',
          title: 'データがありません',
          message: 'まだデータが登録されていません。',
        };
      default:
        return {
          icon: '⚠️',
          title: 'エラーが発生しました',
          message: '予期しないエラーが発生しました。',
        };
    }
  };

  const defaultContent = getDefaultContent();
  const displayTitle = title || defaultContent.title;
  const displayMessage = message || defaultContent.message;
  const displayIcon = icon || defaultContent.icon;

  const getButtonVariant = (variant?: string) => {
    switch (variant) {
      case 'primary':
        return 'btn-primary';
      case 'secondary':
        return 'btn-secondary';
      case 'outline':
        return 'btn-outline';
      default:
        return 'btn-primary';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="mb-6 text-6xl">{displayIcon}</div>

      <h2 className="text-2xl font-bold mb-4 text-base-content">
        {displayTitle}
      </h2>

      {displayMessage && (
        <p className="text-base-content/70 mb-6 max-w-md">{displayMessage}</p>
      )}

      {children && <div className="mb-6">{children}</div>}

      {actions.length > 0 && (
        <div className="flex flex-wrap gap-3 justify-center">
          {actions.map((action, index) => (
            <button
              key={index}
              className={`btn ${getButtonVariant(action.variant)}`}
              onClick={action.onClick}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * ネットワークエラー用のフォールバックUI
 */
interface NetworkErrorFallbackProps {
  onRetry?: () => void;
  message?: string;
}

export function NetworkErrorFallback({
  onRetry,
  message,
}: NetworkErrorFallbackProps) {
  const actions = onRetry
    ? [
        {
          label: '再試行',
          onClick: onRetry,
          variant: 'primary' as const,
        },
        {
          label: 'ホームに戻る',
          onClick: () => (window.location.href = '/'),
          variant: 'outline' as const,
        },
      ]
    : [];

  return <FallbackUI type="network" message={message} actions={actions} />;
}

/**
 * 画像読み込みエラー用のフォールバックUI
 */
interface ImageErrorFallbackProps {
  onRetry?: () => void;
  breed?: string;
}

export function ImageErrorFallback({
  onRetry,
  breed,
}: ImageErrorFallbackProps) {
  const message = breed
    ? `${breed}の画像を読み込めませんでした。`
    : '画像を読み込めませんでした。';

  const actions = onRetry
    ? [
        {
          label: '別の画像を試す',
          onClick: onRetry,
          variant: 'primary' as const,
        },
      ]
    : [];

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-base-200 rounded-lg min-h-[300px]">
      <div className="text-4xl mb-4">🖼️</div>
      <p className="text-base-content/70 mb-4 text-center">{message}</p>
      {actions.length > 0 && (
        <div className="flex gap-2">
          {actions.map((action, index) => (
            <button
              key={index}
              className={`btn btn-sm ${getButtonVariant(action.variant)}`}
              onClick={action.onClick}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * 空のお気に入りリスト用のフォールバックUI
 */
export function EmptyFavoritesUI() {
  return (
    <FallbackUI
      type="empty"
      title="お気に入りがありません"
      message="気に入った犬の画像を見つけたら、ハートボタンでお気に入りに追加してみましょう！"
      actions={[
        {
          label: 'ランダム画像を見る',
          onClick: () => (window.location.href = '/'),
          variant: 'primary',
        },
        {
          label: '犬種から選ぶ',
          onClick: () => (window.location.href = '/breeds'),
          variant: 'outline',
        },
      ]}
    />
  );
}

/**
 * ボタンのバリアント用のヘルパー関数
 */
function getButtonVariant(variant?: string) {
  switch (variant) {
    case 'primary':
      return 'btn-primary';
    case 'secondary':
      return 'btn-secondary';
    case 'outline':
      return 'btn-outline';
    default:
      return 'btn-primary';
  }
}
