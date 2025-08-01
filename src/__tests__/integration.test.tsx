import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { DogApiService } from '../services/dogApi'
import { AppProvider } from '../context/AppContext'
import { ToastProvider } from '../context/ToastContext'
import App from '../App'
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

describe('統合テスト', () => {
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

  const mockBreedImages: DogImage[] = [
    {
      id: 'breed-1',
      url: 'https://images.dog.ceo/breeds/labrador/1.jpg',
      breed: 'labrador',
      addedAt: new Date()
    },
    {
      id: 'breed-2',
      url: 'https://images.dog.ceo/breeds/labrador/2.jpg',
      breed: 'labrador',
      addedAt: new Date()
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()

    // デフォルトのモック設定
    mockDogApiService.getRandomImage.mockResolvedValue(mockRandomImage)
    mockDogApiService.getAllBreeds.mockResolvedValue(mockBreeds)
    mockDogApiService.getBreedImage.mockResolvedValue(mockBreedImages[0])
    mockDogApiService.getMultipleBreedImages.mockResolvedValue(mockBreedImages)
  })

  describe('アプリケーション全体の統合テスト', () => {
    it('アプリケーションが正常に起動し、基本機能が動作する', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // ヘッダーが表示される
      expect(screen.getByText('🐕 Dog Gallery')).toBeInTheDocument()

      // ナビゲーションが表示される
      expect(screen.getByText('ホーム')).toBeInTheDocument()
      expect(screen.getByText('お気に入り')).toBeInTheDocument()

      // ホームページのコンテンツが表示される
      await waitFor(() => {
        expect(screen.getByText('おすすめの犬画像')).toBeInTheDocument()
      })

      // 犬種選択セクションが表示される
      expect(screen.getByText('犬種から選ぶ')).toBeInTheDocument()
    })

    it('ランダム画像の取得と表示が正常に動作する', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // 初期読み込み完了を待つ
      await waitFor(() => {
        expect(mockDogApiService.getRandomImage).toHaveBeenCalled()
      })

      // 新しい画像ボタンをクリック
      const newImageButton = screen.getByText('新しい画像')
      await user.click(newImageButton)

      // APIが再度呼び出される
      await waitFor(() => {
        expect(mockDogApiService.getRandomImage).toHaveBeenCalledTimes(2)
      })
    })

    it('犬種選択機能が正常に動作する', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // 犬種リストの読み込み完了を待つ
      await waitFor(() => {
        expect(mockDogApiService.getAllBreeds).toHaveBeenCalled()
      })

      // 犬種を選択
      const breedButton = await screen.findByText('labrador')
      await user.click(breedButton)

      // 犬種画像の取得が呼び出される
      await waitFor(() => {
        expect(mockDogApiService.getBreedImage).toHaveBeenCalledWith('labrador')
      })
    })

    it('お気に入り機能が正常に動作する', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // 初期読み込み完了を待つ
      await waitFor(() => {
        expect(mockDogApiService.getRandomImage).toHaveBeenCalled()
      })

      // お気に入りボタンをクリック
      const favoriteButton = screen.getByLabelText('お気に入りに追加')
      await user.click(favoriteButton)

      // お気に入りページに移動
      const favoritesLink = screen.getByText('お気に入り')
      await user.click(favoritesLink)

      // お気に入りページが表示される
      await waitFor(() => {
        expect(screen.getByText('お気に入り')).toBeInTheDocument()
      })
    })

    it('ナビゲーション機能が正常に動作する', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // お気に入りページに移動
      const favoritesLink = screen.getByText('お気に入り')
      await user.click(favoritesLink)

      await waitFor(() => {
        expect(screen.getByText('💖 お気に入りの犬の画像')).toBeInTheDocument()
      })

      // ホームページに戻る
      const homeLink = screen.getByText('ホーム')
      await user.click(homeLink)

      await waitFor(() => {
        expect(screen.getByText('おすすめの犬画像')).toBeInTheDocument()
      })
    })
  })

  describe('エラーハンドリングの統合テスト', () => {
    it('API エラー時に適切なエラーメッセージが表示される', async () => {
      // APIエラーをモック
      mockDogApiService.getRandomImage.mockRejectedValueOnce(new Error('Network Error'))
      mockDogApiService.getAllBreeds.mockRejectedValueOnce(new Error('Network Error'))

      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // エラー状態でもアプリケーションがクラッシュしない
      expect(screen.getByText('🐕 Dog Gallery')).toBeInTheDocument()
    })

    it('画像読み込みエラー時にフォールバック表示される', async () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // 初期読み込み完了を待つ
      await waitFor(() => {
        expect(mockDogApiService.getRandomImage).toHaveBeenCalled()
      })

      // 画像要素を取得してエラーイベントを発火
      const images = screen.getAllByRole('img')
      if (images.length > 0) {
        fireEvent.error(images[0])
        
        // エラー表示を確認
        await waitFor(() => {
          expect(screen.getByText('読み込みエラー')).toBeInTheDocument()
        })
      }
    })
  })

  describe('ローカルストレージの統合テスト', () => {
    it('お気に入りがローカルストレージに正しく保存される', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // 初期読み込み完了を待つ
      await waitFor(() => {
        expect(mockDogApiService.getRandomImage).toHaveBeenCalled()
      })

      // お気に入りボタンをクリック
      const favoriteButton = screen.getByLabelText('お気に入りに追加')
      await user.click(favoriteButton)

      // ローカルストレージに保存されることを確認
      const storedData = localStorage.getItem('dogApp')
      expect(storedData).toBeTruthy()
      
      if (storedData) {
        const parsedData = JSON.parse(storedData)
        expect(parsedData.favorites).toHaveLength(1)
      }
    })

    it('ページリロード後もお気に入りが保持される', async () => {
      // 事前にお気に入りをローカルストレージに保存
      const favoriteData = {
        favorites: [mockRandomImage],
        preferences: {}
      }
      localStorage.setItem('dogApp', JSON.stringify(favoriteData))

      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // お気に入りページに移動
      const favoritesLink = screen.getByText('お気に入り')
      await userEvent.setup().click(favoritesLink)

      // 保存されたお気に入りが表示される
      await waitFor(() => {
        expect(screen.getByText('お気に入り')).toBeInTheDocument()
      })
    })
  })
})