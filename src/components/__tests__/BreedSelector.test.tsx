import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { BreedSelector } from '../BreedSelector'
import { DogApiService } from '../../services/dogApi'
import type { DogBreed, DogImage } from '../../types'

// DogApiServiceをモック
vi.mock('../../services/dogApi')
const mockDogApiService = vi.mocked(DogApiService)

// react-router-domをモック
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('BreedSelector', () => {
  const mockBreeds: DogBreed[] = [
    { id: 'labrador', name: 'labrador', subBreeds: [] },
    { id: 'golden', name: 'golden', subBreeds: ['retriever'] },
    { id: 'bulldog', name: 'bulldog', subBreeds: ['english', 'french'] }
  ]

  const mockImage: DogImage = {
    id: 'test-id',
    url: 'https://images.dog.ceo/breeds/labrador/test.jpg',
    breed: 'labrador',
    addedAt: new Date()
  }

  const mockOnImageLoad = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('ローディング状態を表示する', () => {
    render(
      <TestWrapper>
        <BreedSelector breeds={[]} loading={true} error={null} />
      </TestWrapper>
    )
    
    expect(screen.getByText('犬種リストを読み込み中...')).toBeInTheDocument()
  })

  it('エラー状態を表示する', () => {
    render(
      <TestWrapper>
        <BreedSelector breeds={[]} loading={false} error="テストエラー" />
      </TestWrapper>
    )
    
    expect(screen.getByText('エラー: テストエラー')).toBeInTheDocument()
  })

  it('犬種リストを表示する', () => {
    render(
      <TestWrapper>
        <BreedSelector breeds={mockBreeds} loading={false} error={null} />
      </TestWrapper>
    )
    
    expect(screen.getByText('犬種を選択')).toBeInTheDocument()
    expect(screen.getByText('labrador')).toBeInTheDocument()
    expect(screen.getByText('golden')).toBeInTheDocument()
    expect(screen.getByText('bulldog')).toBeInTheDocument()
    expect(screen.getByText('3 種類の犬が表示されています')).toBeInTheDocument()
  })

  it('サブ犬種のバッジを表示する', () => {
    render(
      <TestWrapper>
        <BreedSelector breeds={mockBreeds} loading={false} error={null} />
      </TestWrapper>
    )
    
    // goldenには1つのサブ犬種があるのでバッジに「1」が表示される
    const goldenButton = screen.getByText('golden').closest('button')
    expect(goldenButton).toContainHTML('1')
    
    // bulldogには2つのサブ犬種があるのでバッジに「2」が表示される
    const bulldogButton = screen.getByText('bulldog').closest('button')
    expect(bulldogButton).toContainHTML('2')
  })

  it('検索機能が動作する', () => {
    render(
      <TestWrapper>
        <BreedSelector breeds={mockBreeds} loading={false} error={null} />
      </TestWrapper>
    )
    
    const searchInput = screen.getByPlaceholderText('犬種を検索...')
    fireEvent.change(searchInput, { target: { value: 'lab' } })
    
    expect(screen.getByText('labrador')).toBeInTheDocument()
    expect(screen.queryByText('golden')).not.toBeInTheDocument()
    expect(screen.queryByText('bulldog')).not.toBeInTheDocument()
    expect(screen.getByText('1 種類の犬が表示されています')).toBeInTheDocument()
  })

  it('犬種選択時に画像を読み込む', async () => {
    mockDogApiService.getBreedImage.mockResolvedValueOnce(mockImage)
    
    render(
      <TestWrapper>
        <BreedSelector breeds={mockBreeds} loading={false} error={null} onImageLoad={mockOnImageLoad} />
      </TestWrapper>
    )
    
    const labradorButton = screen.getByText('labrador')
    fireEvent.click(labradorButton)
    
    await waitFor(() => {
      expect(mockDogApiService.getBreedImage).toHaveBeenCalledWith('labrador')
      expect(mockOnImageLoad).toHaveBeenCalledWith(mockImage)
    })
    
    expect(screen.getByAltText('labradorの画像')).toBeInTheDocument()
  })

  it('画像読み込みエラーを処理する', async () => {
    mockDogApiService.getBreedImage.mockRejectedValueOnce(new Error('API Error'))
    
    render(
      <TestWrapper>
        <BreedSelector breeds={mockBreeds} loading={false} error={null} />
      </TestWrapper>
    )
    
    const labradorButton = screen.getByText('labrador')
    fireEvent.click(labradorButton)
    
    await waitFor(() => {
      expect(screen.getByText('画像が見つかりません')).toBeInTheDocument()
      expect(screen.getByText('API Error')).toBeInTheDocument()
    })
  })

  it('次の画像ボタンが動作する', async () => {
    mockDogApiService.getBreedImage.mockResolvedValue(mockImage)
    
    render(
      <TestWrapper>
        <BreedSelector breeds={mockBreeds} loading={false} error={null} />
      </TestWrapper>
    )
    
    // 犬種を選択
    const labradorButton = screen.getByText('labrador')
    fireEvent.click(labradorButton)
    
    await waitFor(() => {
      expect(screen.getByAltText('labradorの画像')).toBeInTheDocument()
    })
    
    // 次の画像ボタンをクリック
    const nextButton = screen.getByText('次の画像')
    fireEvent.click(nextButton)
    
    await waitFor(() => {
      expect(mockDogApiService.getBreedImage).toHaveBeenCalledTimes(2)
    })
  })

  it('詳細ページへのナビゲーションが動作する', async () => {
    mockDogApiService.getBreedImage.mockResolvedValueOnce(mockImage)
    
    render(
      <TestWrapper>
        <BreedSelector breeds={mockBreeds} loading={false} error={null} />
      </TestWrapper>
    )
    
    // 犬種を選択
    const labradorButton = screen.getByText('labrador')
    fireEvent.click(labradorButton)
    
    await waitFor(() => {
      expect(screen.getByText('詳細ページへ')).toBeInTheDocument()
    })
    
    // 詳細ページボタンをクリック
    const detailButton = screen.getByText('詳細ページへ')
    fireEvent.click(detailButton)
    
    expect(mockNavigate).toHaveBeenCalledWith('/breed/labrador?from=/')
  })

  it('戻るボタンで選択をリセットする', async () => {
    mockDogApiService.getBreedImage.mockResolvedValueOnce(mockImage)
    
    render(
      <TestWrapper>
        <BreedSelector breeds={mockBreeds} loading={false} error={null} />
      </TestWrapper>
    )
    
    // 犬種を選択
    const labradorButton = screen.getByText('labrador')
    fireEvent.click(labradorButton)
    
    await waitFor(() => {
      expect(screen.getByText('labrador')).toBeInTheDocument()
    })
    
    // 戻るボタンをクリック
    const backButton = screen.getByRole('button', { name: '' }) // SVGアイコンのみのボタン
    fireEvent.click(backButton)
    
    expect(screen.getByText('犬種を選択')).toBeInTheDocument()
    expect(screen.getByText('3 種類の犬が表示されています')).toBeInTheDocument()
  })
})