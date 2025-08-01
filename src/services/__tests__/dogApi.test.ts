import { DogApiService } from '../dogApi'
import type { DogApiResponse, BreedListResponse } from '../../types'

// fetchのモック
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('DogApiService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('getRandomImage', () => {
    it('ランダム画像を正常に取得する', async () => {
      const mockResponse: DogApiResponse = {
        message: 'https://images.dog.ceo/breeds/labrador/test.jpg',
        status: 'success'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await DogApiService.getRandomImage()

      expect(mockFetch).toHaveBeenCalledWith('https://dog.ceo/api/breeds/image/random')
      expect(result).toEqual({
        id: 'https://images.dog.ceo/breeds/labrador/test.jpg',
        url: 'https://images.dog.ceo/breeds/labrador/test.jpg',
        breed: 'labrador',
        addedAt: new Date('2024-01-01T00:00:00.000Z')
      })
    })

    it('HTTPエラーを適切に処理する', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      })

      await expect(DogApiService.getRandomImage()).rejects.toEqual({
        message: 'HTTP error! status: 404',
        code: 'API_ERROR'
      })
    })

    it('APIステータスエラーを適切に処理する', async () => {
      const mockResponse: DogApiResponse = {
        message: '',
        status: 'error'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      await expect(DogApiService.getRandomImage()).rejects.toEqual({
        message: 'ランダム画像の取得に失敗しました',
        code: 'API_ERROR'
      })
    })
  })

  describe('getBreedImage', () => {
    it('特定犬種の画像を正常に取得する', async () => {
      const mockResponse: DogApiResponse = {
        message: 'https://images.dog.ceo/breeds/golden/test.jpg',
        status: 'success'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await DogApiService.getBreedImage('golden')

      expect(mockFetch).toHaveBeenCalledWith('https://dog.ceo/api/breed/golden/images/random')
      expect(result).toEqual({
        id: 'https://images.dog.ceo/breeds/golden/test.jpg',
        url: 'https://images.dog.ceo/breeds/golden/test.jpg',
        breed: 'golden',
        addedAt: new Date('2024-01-01T00:00:00.000Z')
      })
    })

    it('存在しない犬種のエラーを適切に処理する', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      })

      await expect(DogApiService.getBreedImage('nonexistent')).rejects.toEqual({
        message: 'HTTP error! status: 404',
        code: 'API_ERROR'
      })
    })
  })

  describe('getBreedsList', () => {
    it('犬種リストを正常に取得する', async () => {
      const mockResponse: BreedListResponse = {
        message: {
          'labrador': [],
          'golden': ['retriever'],
          'bulldog': ['english', 'french']
        },
        status: 'success'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await DogApiService.getBreedsList()

      expect(mockFetch).toHaveBeenCalledWith('https://dog.ceo/api/breeds/list/all')
      expect(result).toEqual([
        'bulldog',
        'bulldog/english',
        'bulldog/french',
        'golden',
        'golden/retriever',
        'labrador'
      ])
    })

    it('犬種リスト取得エラーを適切に処理する', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      })

      await expect(DogApiService.getBreedsList()).rejects.toEqual({
        message: 'HTTP error! status: 500',
        code: 'API_ERROR'
      })
    })
  })

  describe('getMultipleBreedImages', () => {
    it('複数の犬種画像を正常に取得する', async () => {
      const mockResponse: DogApiResponse = {
        message: [
          'https://images.dog.ceo/breeds/labrador/test1.jpg',
          'https://images.dog.ceo/breeds/labrador/test2.jpg'
        ],
        status: 'success'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await DogApiService.getMultipleBreedImages('labrador', 2)

      expect(mockFetch).toHaveBeenCalledWith('https://dog.ceo/api/breed/labrador/images/random/2')
      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        id: 'https://images.dog.ceo/breeds/labrador/test1.jpg',
        url: 'https://images.dog.ceo/breeds/labrador/test1.jpg',
        breed: 'labrador',
        addedAt: new Date('2024-01-01T00:00:00.000Z')
      })
    })
  })

  describe('getAllBreeds', () => {
    it('DogBreed形式で犬種リストを取得する', async () => {
      const mockResponse: BreedListResponse = {
        message: {
          'labrador': [],
          'golden': ['retriever']
        },
        status: 'success'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await DogApiService.getAllBreeds()

      expect(result).toEqual([
        {
          id: 'golden',
          name: 'golden',
          subBreeds: ['retriever']
        },
        {
          id: 'golden/retriever',
          name: 'golden (retriever)',
          subBreeds: []
        },
        {
          id: 'labrador',
          name: 'labrador',
          subBreeds: []
        }
      ])
    })
  })

  describe('checkConnection', () => {
    it('接続成功時にtrueを返す', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true
      })

      const result = await DogApiService.checkConnection()

      expect(mockFetch).toHaveBeenCalledWith('https://dog.ceo/api/breeds/image/random', {
        method: 'HEAD',
        cache: 'no-cache'
      })
      expect(result).toBe(true)
    })

    it('接続失敗時にfalseを返す', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const result = await DogApiService.checkConnection()

      expect(result).toBe(false)
    })
  })
})