import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '../useLocalStorage'

describe('useLocalStorage', () => {
  let mockLocalStorage: {
    getItem: ReturnType<typeof vi.fn>
    setItem: ReturnType<typeof vi.fn>
    removeItem: ReturnType<typeof vi.fn>
    clear: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    mockLocalStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    }
    
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage
    })
    
    vi.clearAllMocks()
  })

  it('デフォルト値を返す', () => {
    mockLocalStorage.getItem.mockReturnValue(null)
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    
    expect(result.current.value).toBe('default')
  })

  it('ローカルストレージから既存の値を読み込む', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify('stored-value'))
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('test-key')
    expect(result.current.value).toBe('stored-value')
  })

  it('値を設定してローカルストレージに保存する', () => {
    mockLocalStorage.getItem.mockReturnValue(null)
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    
    act(() => {
      result.current.setValue('new-value')
    })
    
    expect(result.current.value).toBe('new-value')
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify('new-value'))
  })

  it('関数型更新をサポートする', () => {
    mockLocalStorage.getItem.mockReturnValue(null)
    
    const { result } = renderHook(() => useLocalStorage('test-key', 10))
    
    act(() => {
      result.current.setValue((prev) => prev + 5)
    })
    
    expect(result.current.value).toBe(15)
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify(15))
  })

  it('値を削除する', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify('stored-value'))
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    
    act(() => {
      result.current.removeValue()
    })
    
    expect(result.current.value).toBe('default')
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('test-key')
  })

  it('不正なJSONを処理する', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mockLocalStorage.getItem.mockReturnValue('invalid-json')
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    
    expect(result.current.value).toBe('default')
    expect(consoleSpy).toHaveBeenCalled()
    
    consoleSpy.mockRestore()
  })

  it('オブジェクトを正しく処理する', () => {
    const testObject = { name: 'test', count: 42 }
    mockLocalStorage.getItem.mockReturnValue(null)
    
    const { result } = renderHook(() => useLocalStorage('test-key', {}))
    
    act(() => {
      result.current.setValue(testObject)
    })
    
    expect(result.current.value).toEqual(testObject)
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify(testObject))
  })
})