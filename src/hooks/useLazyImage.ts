import { useState, useEffect, useRef, useCallback } from 'react';

interface UseLazyImageOptions {
  src: string;
  placeholder?: string;
  rootMargin?: string;
  threshold?: number;
}

interface UseLazyImageReturn {
  imageSrc: string;
  isLoading: boolean;
  isError: boolean;
  imageRef: React.RefObject<HTMLImageElement | null>;
  retry: () => void;
}

/**
 * 画像の遅延読み込みを管理するカスタムフック
 * Intersection Observer APIを使用してビューポートに入った時に画像を読み込む
 */
export function useLazyImage({
  src,
  placeholder = '',
  rootMargin = '50px',
  threshold = 0.1,
}: UseLazyImageOptions): UseLazyImageReturn {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [retryCounter, setRetryCounter] = useState(0);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Intersection Observer の設定
  useEffect(() => {
    const imageElement = imageRef.current;
    if (!imageElement) return;

    // IntersectionObserverが利用できない場合は即座に読み込み開始
    if (typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.unobserve(imageElement);
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(imageElement);

    return () => {
      observer.unobserve(imageElement);
    };
  }, [rootMargin, threshold]);

  // 画像の読み込み処理
  useEffect(() => {
    if (!shouldLoad || !src) return;

    setIsLoading(true);
    setIsError(false);

    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };

    img.onerror = () => {
      setIsError(true);
      setIsLoading(false);
    };

    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [shouldLoad, src, retryCounter]);

  const retry = useCallback(() => {
    setIsError(false);
    setRetryCounter((c) => c + 1);
  }, []);

  return {
    imageSrc,
    isLoading,
    isError,
    imageRef,
    retry,
  };
}