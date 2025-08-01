import { renderHook, act } from '@testing-library/react'
import { useFavorites } from '../useFavorites'
import { AppProvider } from '../../context/AppContext'
import type { DogImage } from '../../types'

// テスト用のラッパーコンポーネント
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppProvider>{children}</AppProvider>
)

describe('useFavorites', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  const mockImage: DogImage = {
    id: 'test-id-1',
    url: 'https://images.dog.ceo/breeds/labrador/test.jpg',
    breed: 'labrador',
    addedAt: new Date('2024-01-01T00:00:00.000Z')
  }

  const mockImage2: DogImage = {
    id: 'test-id-2',
    url: 'https://images.dog.ceo/breeds/golden/test.jpg',
    breed: 'golden',
    addedAt: new Date('2024-01-02T00:00:00.000Z')
  }

  it('初期状態では空のお気に入りリストを返す', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper })
    
    expect(result.current.favorites).toEqual([])
  })

  it('お気に入りに画像を追加できる', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper })
    
    act(() => {
      result.current.addToFavorites(mockImage)
    })
    
    expect(result.current.favorites).toHaveLength(1)
    expect(result.current.favorites[0]).toEqual(mockImage)
  })

  it('お気に入りから画像を削除できる', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper })
    
    act(() => {
      result.current.addToFavorites(mockImage)
      result.current.addToFavorites(mockImage2)
    })
    
    expect(result.current.favorites).toHaveLength(2)
    
    act(() => {
      result.current.removeFromFavorites('test-id-1')
    })
    
    expect(result.current.favorites).toHaveLength(1)
    expect(result.current.favorites[0].id).toBe('test-id-2')
  })

  it('すべてのお気に入りをクリアできる', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper })
    
    act(() => {
      result.current.addToFavorites(mockImage)
      result.current.addToFavorites(mockImage2)
    })
    
    expect(result.current.favorites).toHaveLength(2)
    
    act(() => {
      result.current.clearAllFavorites()
    })
    
    expect(result.current.favorites).toHaveLength(0)
  })

  it('画像がお気に入りかどうかを正しく判定する', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper })
    
    expect(result.current.isFavorite('test-id-1')).toBe(false)
    
    act(() => {
      result.current.addToFavorites(mockImage)
    })
    
    expect(result.current.isFavorite('test-id-1')).toBe(true)
    expect(result.current.isFavorite('test-id-2')).toBe(false)
  })

  it('重複する画像を追加しても1つだけ保持される', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper })
    
    act(() => {
      result.current.addToFavorites(mockImage)
      result.current.addToFavorites(mockImage) // 同じ画像を再度追加
    })
    
    expect(result.current.favorites).toHaveLength(1)
  })
})