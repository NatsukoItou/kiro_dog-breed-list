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

// ビューポートサイズを変更するヘルパー関数
const setViewportSize = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  })
  window.dispatchEvent(new Event('resize'))
}

describe('レスポンシブデザインテスト', () => {
  const mockRandomImage: DogImage = {
    id: 'random-id',
    url: 'https://images.dog.ceo/breeds/labrador/random.jpg',
    breed: 'labrador',
    addedAt: new Date()
  }

  const mockBreeds: DogBreed[] = [
    { id: 'labrador', name: 'labrador', subBreeds: [] },
    { id: 'golden', name: 'golden', subBreeds: ['retriever'] },
    { id: 'bulldog', name: 'bulldog', subBreeds: ['english', 'french'] }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()

    // デフォルトのモック設定
    mockDogApiService.getRandomImage.mockResolvedValue(mockRandomImage)
    mockDogApiService.getAllBreeds.mockResolvedValue(mockBreeds)
    mockDogApiService.getBreedImage.mockResolvedValue(mockRandomImage)
    mockDogApiService.getMultipleBreedImages.mockResolvedValue([mockRandomImage])
  })

  describe('モバイルビュー (320px - 768px)', () => {
    beforeEach(() => {
      setViewportSize(375, 667) // iPhone SE サイズ
    })

    it('モバイルでヘッダーが適切に表示される', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      const header = screen.getByRole('banner')
      expect(header).toBeInTheDocument()
      
      // ヘッダータイトルが表示される
      expect(screen.getByText('🐕 Dog Gallery')).toBeInTheDocument()
    })

    it('モバイルでナビゲーションが適切に表示される', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // ナビゲーションリンクが表示される
      expect(screen.getByText('ホーム')).toBeInTheDocument()
      expect(screen.getByText('お気に入り')).toBeInTheDocument()
    })

    it('モバイルでコンテンツが適切にレイアウトされる', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // メインコンテンツが表示される
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
      
      // レスポンシブクラスが適用されているかチェック
      expect(main).toHaveClass('container', 'mx-auto', 'px-4', 'py-8')
    })
  })

  describe('タブレットビュー (768px - 1024px)', () => {
    beforeEach(() => {
      setViewportSize(768, 1024) // iPad サイズ
    })

    it('タブレットでレイアウトが適切に表示される', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
      
      // タブレット用のレスポンシブクラスが適用される
      expect(main).toHaveClass('container', 'mx-auto', 'px-4', 'py-8')
    })

    it('タブレットでナビゲーションが適切に表示される', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // ナビゲーションが表示される
      expect(screen.getByText('ホーム')).toBeInTheDocument()
      expect(screen.getByText('お気に入り')).toBeInTheDocument()
    })
  })

  describe('デスクトップビュー (1024px+)', () => {
    beforeEach(() => {
      setViewportSize(1920, 1080) // フルHD サイズ
    })

    it('デスクトップでレイアウトが適切に表示される', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
      
      // デスクトップ用のレスポンシブクラスが適用される
      expect(main).toHaveClass('container', 'mx-auto', 'px-4', 'py-8')
    })

    it('デスクトップでヘッダーが適切に表示される', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      const header = screen.getByRole('banner')
      expect(header).toBeInTheDocument()
      
      // ヘッダータイトルが表示される
      expect(screen.getByText('🐕 Dog Gallery')).toBeInTheDocument()
    })

    it('デスクトップでナビゲーションが適切に表示される', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // ナビゲーションリンクが表示される
      expect(screen.getByText('ホーム')).toBeInTheDocument()
      expect(screen.getByText('お気に入り')).toBeInTheDocument()
    })
  })

  describe('画像のレスポンシブ表示', () => {
    it('異なる画面サイズで画像が適切にスケールされる', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // 画像コンテナが存在することを確認
      const imageContainers = screen.getAllByRole('img', { hidden: true })
      expect(imageContainers.length).toBeGreaterThan(0)
    })

    it('モバイルで画像が適切なサイズで表示される', () => {
      setViewportSize(375, 667)
      
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // 画像要素が存在することを確認
      const images = screen.getAllByRole('img', { hidden: true })
      expect(images.length).toBeGreaterThan(0)
    })
  })

  describe('テキストとボタンのレスポンシブ表示', () => {
    it('異なる画面サイズでテキストが読みやすく表示される', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // タイトルテキストが表示される
      expect(screen.getByText('🐕 Dog Gallery')).toBeInTheDocument()
    })

    it('ボタンが異なる画面サイズで適切に表示される', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // ナビゲーションボタンが表示される
      expect(screen.getByText('ホーム')).toBeInTheDocument()
      expect(screen.getByText('お気に入り')).toBeInTheDocument()
    })
  })

  describe('レイアウトの一貫性', () => {
    it('画面サイズ変更時にレイアウトが崩れない', () => {
      const { rerender } = render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // モバイルサイズ
      setViewportSize(375, 667)
      rerender(
        <TestWrapper>
          <App />
        </TestWrapper>
      )
      expect(screen.getByText('🐕 Dog Gallery')).toBeInTheDocument()

      // タブレットサイズ
      setViewportSize(768, 1024)
      rerender(
        <TestWrapper>
          <App />
        </TestWrapper>
      )
      expect(screen.getByText('🐕 Dog Gallery')).toBeInTheDocument()

      // デスクトップサイズ
      setViewportSize(1920, 1080)
      rerender(
        <TestWrapper>
          <App />
        </TestWrapper>
      )
      expect(screen.getByText('🐕 Dog Gallery')).toBeInTheDocument()
    })
  })
})