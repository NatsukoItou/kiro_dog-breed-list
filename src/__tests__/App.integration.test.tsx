import { render, screen } from '@testing-library/react'
import { DogApiService } from '../services/dogApi'
import { AppProvider } from '../context/AppContext'
import { ToastProvider } from '../context/ToastContext'
import { HomePage } from '../pages/HomePage'
import type { DogImage } from '../types'

// DogApiServiceをモック
vi.mock('../services/dogApi')
const mockDogApiService = vi.mocked(DogApiService)

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <AppProvider>
        <ToastProvider>
            {children}
        </ToastProvider>
    </AppProvider>
)

describe('App Integration Tests', () => {
    const mockRandomImage: DogImage = {
        id: 'random-id',
        url: 'https://images.dog.ceo/breeds/labrador/random.jpg',
        breed: 'labrador',
        addedAt: new Date()
    }

    beforeEach(() => {
        vi.clearAllMocks()
        localStorage.clear()

        // デフォルトのモック設定
        mockDogApiService.getRandomImage.mockResolvedValue(mockRandomImage)
        mockDogApiService.getAllBreeds.mockResolvedValue([
            { id: 'labrador', name: 'labrador', subBreeds: [] },
            { id: 'golden', name: 'golden', subBreeds: ['retriever'] },
            { id: 'bulldog', name: 'bulldog', subBreeds: ['english', 'french'] }
        ])
    })

    it('ホームページコンポーネントが正常にレンダリングされる', () => {
        render(
            <TestWrapper>
                <HomePage />
            </TestWrapper>
        )

        // ページタイトルが表示される
        expect(screen.getByText('🐕 ランダムな犬の画像')).toBeInTheDocument()

        // 犬種選択セクションが表示される
        expect(screen.getByText('犬種を選択')).toBeInTheDocument()
    })

    it('APIサービスが正しく呼び出される', () => {
        render(
            <TestWrapper>
                <HomePage />
            </TestWrapper>
        )

        // 初期化時にAPIが呼び出される
        expect(mockDogApiService.getRandomImage).toHaveBeenCalled()
        expect(mockDogApiService.getAllBreeds).toHaveBeenCalled()
    })

    it('エラー状態が正しく処理される', () => {
        // APIエラーをモック
        mockDogApiService.getRandomImage.mockRejectedValueOnce(new Error('API Error'))
        mockDogApiService.getAllBreeds.mockRejectedValueOnce(new Error('API Error'))

        render(
            <TestWrapper>
                <HomePage />
            </TestWrapper>
        )

        // コンポーネントがクラッシュしないことを確認
        expect(screen.getByText('🐕 ランダムな犬の画像')).toBeInTheDocument()
    })
})