import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

describe('E2E テスト - ユーザーフロー', () => {
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

  describe('基本的なユーザーフロー', () => {
    it('ユーザーがアプリを開いてランダム画像を閲覧する', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // 1. アプリが正常に読み込まれる
      expect(screen.getByText('🐕 Dog Gallery')).toBeInTheDocument()

      // 2. ランダム画像セクションが表示される
      await waitFor(() => {
        expect(screen.getByText('🐕 ランダムな犬の画像')).toBeInTheDocument()
      })

      // 3. 新しい画像ボタンをクリック
      const newImageButton = screen.getByText('新しい画像')
      await user.click(newImageButton)

      // 4. 新しい画像が読み込まれる
      await waitFor(() => {
        expect(mockDogApiService.getRandomImage).toHaveBeenCalledTimes(2)
      })
    })

    it('ユーザーが犬種を選択して画像を閲覧する', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // 1. 犬種選択セクションが表示される
      await waitFor(() => {
        expect(screen.getByText('犬種を選択')).toBeInTheDocument()
      })

      // 2. 犬種を選択
      const breedButton = await screen.findByText('labrador')
      await user.click(breedButton)

      // 3. 犬種画像が読み込まれる
      await waitFor(() => {
        expect(mockDogApiService.getBreedImages).toHaveBeenCalledWith('labrador')
      })

      // 4. 次の画像ボタンをクリック
      const nextImageButton = screen.getByText('次の画像')
      await user.click(nextImageButton)

      // 5. 詳細ページへのナビゲーション
      const viewDetailsButton = screen.getByText('詳細を見る')
      await user.click(viewDetailsButton)
    })

    it('ユーザーがお気に入り機能を使用する', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // 1. 初期読み込み完了を待つ
      await waitFor(() => {
        expect(mockDogApiService.getRandomImage).toHaveBeenCalled()
      })

      // 2. お気に入りボタンをクリック
      const favoriteButton = screen.getByLabelText('お気に入りに追加')
      await user.click(favoriteButton)

      // 3. お気に入りページに移動
      const favoritesLink = screen.getByText('お気に入り')
      await user.click(favoritesLink)

      // 4. お気に入りページが表示される
      await waitFor(() => {
        expect(screen.getByText('💖 お気に入りの犬の画像')).toBeInTheDocument()
      })

      // 5. お気に入りから削除
      const removeButton = screen.getByLabelText('お気に入りから削除')
      await user.click(removeButton)
    })
  })

  describe('エラーハンドリングのユーザーフロー', () => {
    it('ネットワークエラー時のユーザー体験', async () => {
      const user = userEvent.setup()
      
      // APIエラーをモック
      mockDogApiService.getRandomImage.mockRejectedValueOnce(new Error('Network Error'))
      
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // 1. エラー状態でもアプリが動作する
      expect(screen.getByText('🐕 Dog Gallery')).toBeInTheDocument()

      // 2. 再試行ボタンをクリック（存在する場合）
      const retryButtons = screen.queryAllByText('再試行')
      if (retryButtons.length > 0) {
        await user.click(retryButtons[0])
      }
    })

    it('画像読み込みエラー時のユーザー体験', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // 1. 初期読み込み完了を待つ
      await waitFor(() => {
        expect(mockDogApiService.getRandomImage).toHaveBeenCalled()
      })

      // 2. 画像エラーをシミュレート
      const images = screen.getAllByRole('img', { hidden: true })
      if (images.length > 0) {
        fireEvent.error(images[0])
        
        // 3. エラー表示を確認
        await waitFor(() => {
          expect(screen.getByText('読み込みエラー')).toBeInTheDocument()
        })

        // 4. 再試行ボタンをクリック
        const retryButton = screen.getByText('再試行')
        await user.click(retryButton)
      }
    })
  })

  describe('複雑なユーザーフロー', () => {
    it('複数の機能を組み合わせたフロー', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // 1. ランダム画像を表示
      await waitFor(() => {
        expect(screen.getByText('🐕 ランダムな犬の画像')).toBeInTheDocument()
      })

      // 2. 犬種を選択
      const breedButton = await screen.findByText('labrador')
      await user.click(breedButton)

      // 3. 犬種画像をお気に入りに追加
      await waitFor(() => {
        expect(mockDogApiService.getBreedImages).toHaveBeenCalled()
      })
      
      const favoriteButton = screen.getByLabelText('お気に入りに追加')
      await user.click(favoriteButton)

      // 4. お気に入りページで確認
      const favoritesLink = screen.getByText('お気に入り')
      await user.click(favoritesLink)

      await waitFor(() => {
        expect(screen.getByText('💖 お気に入りの犬の画像')).toBeInTheDocument()
      })

      // 5. ホームに戻る
      const homeLink = screen.getByText('ホーム')
      await user.click(homeLink)

      // 6. 新しいランダム画像を取得
      const newImageButton = screen.getByText('新しい画像')
      await user.click(newImageButton)

      await waitFor(() => {
        expect(mockDogApiService.getRandomImage).toHaveBeenCalledTimes(2)
      })
    })

    it('ページ間のナビゲーションフロー', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // 1. ホームページから開始
      expect(screen.getByText('🐕 Dog Gallery')).toBeInTheDocument()

      // 2. お気に入りページに移動
      const favoritesLink = screen.getByText('お気に入り')
      await user.click(favoritesLink)

      await waitFor(() => {
        expect(screen.getByText('💖 お気に入りの犬の画像')).toBeInTheDocument()
      })

      // 3. ホームページに戻る
      const homeLink = screen.getByText('ホーム')
      await user.click(homeLink)

      await waitFor(() => {
        expect(screen.getByText('🐕 ランダムな犬の画像')).toBeInTheDocument()
      })

      // 4. 犬種選択
      const breedButton = await screen.findByText('labrador')
      await user.click(breedButton)

      // 5. 詳細ページへ移動
      const viewDetailsButton = screen.getByText('詳細を見る')
      await user.click(viewDetailsButton)
    })
  })

  describe('データ永続化のフロー', () => {
    it('お気に入りの永続化フロー', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // 1. 画像をお気に入りに追加
      await waitFor(() => {
        expect(mockDogApiService.getRandomImage).toHaveBeenCalled()
      })

      const favoriteButton = screen.getByLabelText('お気に入りに追加')
      await user.click(favoriteButton)

      // 2. ローカルストレージに保存されることを確認
      const storedData = localStorage.getItem('dogApp')
      expect(storedData).toBeTruthy()

      // 3. ページリロードをシミュレート（新しいレンダリング）
      const { rerender } = render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // 4. お気に入りページで保存されたデータを確認
      const favoritesLink = screen.getByText('お気に入り')
      await user.click(favoritesLink)

      await waitFor(() => {
        expect(screen.getByText('💖 お気に入りの犬の画像')).toBeInTheDocument()
      })
    })
  })

  describe('パフォーマンステスト', () => {
    it('大量のお気に入りアイテムの処理', async () => {
      const user = userEvent.setup()
      
      // 大量のお気に入りデータを事前に設定
      const manyFavorites = Array.from({ length: 50 }, (_, i) => ({
        id: `favorite-${i}`,
        url: `https://images.dog.ceo/breeds/labrador/${i}.jpg`,
        breed: 'labrador',
        addedAt: new Date()
      }))

      localStorage.setItem('dogApp', JSON.stringify({
        favorites: manyFavorites,
        preferences: {}
      }))

      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )

      // お気に入りページに移動
      const favoritesLink = screen.getByText('お気に入り')
      await user.click(favoritesLink)

      // ページが正常に表示されることを確認
      await waitFor(() => {
        expect(screen.getByText('💖 お気に入りの犬の画像')).toBeInTheDocument()
      })
    })
  })
})