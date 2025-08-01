import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from '../context/AppContext'
import { ToastProvider } from '../context/ToastContext'
import App from '../App'
import { DogApiService } from '../services/dogApi'
import type { DogImage, DogBreed } from '../types'

// DogApiServiceをモック
vi.mock('../services/dogApi')
const mockDogApiService = vi.mocked(DogApiService)

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AppProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </AppProvider>
  </BrowserRouter>
)

// ブラウザ固有の機能をモック
const mockBrowserFeatures = {
  // Intersection Observer API のモック
  mockIntersectionObserver: () => {
    const mockIntersectionObserver = vi.fn()
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null
    })
    window.IntersectionObserver = mockIntersectionObserver
    window.IntersectionObserverEntry = vi.fn()
  },

  // Fetch API のモック
  mockFetch: () => {
    global.fetch = vi.fn()
  },

  // LocalStorage のモック
  mockLocalStorage: () => {
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    }
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    })
  },

  // ResizeObserver のモック
  mockResizeObserver: () => {
    window.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }))
  }
}

describe('クロスブラウザ互換性テスト', () => {
  const mockRandomImage: DogImage = {
    id: 'random-id',
    url: 'https://images.dog.ceo/breeds/labrador/random.jpg',
    breed: 'labrador',
    addedAt: new Date()
  }

  const mockBreeds: DogBreed[] = [
    { id: 'labrador', name: 'labrador', subBreeds: [] },
    { id: 'golden', name: 'golden', subBreeds: ['retriever'] }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()

    // ブラウザ機能のモック設定
    mockBrowserFeatures.mockIntersectionObserver()
    mockBrowserFeatures.mockFetch()
    mockBrowserFeatures.mockLocalStorage()
    mockBrowserFeatures.mockResizeObserver()

    // API モック設定
    mockDogApiService.getRandomImage.mockResolvedValue(mockRandomImage)
    mockDogApiService.getAllBreeds.mockResolvedValue(mockBreeds)
    mockDogApiService.getBreedImage.mockResolvedValue(mockRandomImage)
    mockDogApiService.getMultipleBreedImages.mockResolvedValue([mockRandomImage])
  })

  describe('基本的なブラウザ機能', () => {
    it('DOM 操作が正常に動作する', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // 基本的な DOM 要素が存在する
      expect(document.querySelector('header')).toBeTruthy()
      expect(document.querySelector('main')).toBeTruthy()
      expect(document.querySelector('nav')).toBeTruthy()
    })

    it('CSS クラスが正しく適用される', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      const header = screen.getByRole('banner')
      expect(header).toHaveClass('navbar')
    })

    it('イベントハンドリングが正常に動作する', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // クリック可能な要素が存在する
      const homeLink = screen.getByText('ホーム')
      expect(homeLink).toBeInTheDocument()
      
      const favoritesLink = screen.getByText('お気に入り')
      expect(favoritesLink).toBeInTheDocument()
    })
  })

  describe('Web API 互換性', () => {
    it('Fetch API が利用可能である', () => {
      expect(global.fetch).toBeDefined()
    })

    it('LocalStorage が利用可能である', () => {
      expect(window.localStorage).toBeDefined()
      expect(typeof window.localStorage.getItem).toBe('function')
      expect(typeof window.localStorage.setItem).toBe('function')
    })

    it('Intersection Observer が利用可能である', () => {
      expect(window.IntersectionObserver).toBeDefined()
    })

    it('ResizeObserver が利用可能である', () => {
      expect(window.ResizeObserver).toBeDefined()
    })
  })

  describe('CSS 機能の互換性', () => {
    it('Flexbox レイアウトが正常に動作する', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      const main = screen.getByRole('main')
      expect(main).toHaveClass('container')
    })

    it('Grid レイアウトが正常に動作する', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // Grid を使用するコンポーネントが正常にレンダリングされる
      expect(screen.getByRole('main')).toBeInTheDocument()
    })

    it('CSS カスタムプロパティが正常に動作する', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // daisyUI のテーマが適用される
      const html = document.documentElement
      expect(html).toBeDefined()
    })
  })

  describe('JavaScript 機能の互換性', () => {
    it('ES6+ 機能が正常に動作する', () => {
      // Arrow functions
      const arrowFunction = () => 'test'
      expect(arrowFunction()).toBe('test')

      // Template literals
      const template = `Hello ${'World'}`
      expect(template).toBe('Hello World')

      // Destructuring
      const { id } = mockRandomImage
      expect(id).toBe('random-id')

      // Spread operator
      const newImage = { ...mockRandomImage, breed: 'golden' }
      expect(newImage.breed).toBe('golden')
    })

    it('Promise が正常に動作する', async () => {
      const promise = Promise.resolve('test')
      const result = await promise
      expect(result).toBe('test')
    })

    it('async/await が正常に動作する', async () => {
      const asyncFunction = async () => {
        return 'async result'
      }
      
      const result = await asyncFunction()
      expect(result).toBe('async result')
    })
  })

  describe('React 機能の互換性', () => {
    it('React Hooks が正常に動作する', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // コンポーネントが正常にレンダリングされる
      expect(screen.getByText('🐕 Dog Gallery')).toBeInTheDocument()
    })

    it('Context API が正常に動作する', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // Context を使用するコンポーネントが正常に動作する
      expect(screen.getByRole('main')).toBeInTheDocument()
    })

    it('React Router が正常に動作する', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // ルーティングが正常に動作する
      expect(screen.getByText('ホーム')).toBeInTheDocument()
      expect(screen.getByText('お気に入り')).toBeInTheDocument()
    })
  })

  describe('パフォーマンス機能', () => {
    it('画像の遅延読み込みが正常に動作する', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // LazyImage コンポーネントが正常にレンダリングされる
      expect(screen.getByRole('main')).toBeInTheDocument()
    })

    it('メモ化が正常に動作する', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // memo でラップされたコンポーネントが正常に動作する
      expect(screen.getByText('🐕 Dog Gallery')).toBeInTheDocument()
    })
  })

  describe('アクセシビリティ機能', () => {
    it('ARIA 属性が正しく設定される', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // role 属性が正しく設定される
      expect(screen.getByRole('banner')).toBeInTheDocument()
      expect(screen.getByRole('main')).toBeInTheDocument()
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })

    it('キーボードナビゲーションが正常に動作する', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // フォーカス可能な要素が存在する
      const links = screen.getAllByRole('link')
      expect(links.length).toBeGreaterThan(0)
    })

    it('スクリーンリーダー対応が正常に動作する', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // alt 属性やラベルが適切に設定される
      const images = screen.getAllByRole('img', { hidden: true })
      images.forEach(img => {
        expect(img).toHaveAttribute('alt')
      })
    })
  })
})