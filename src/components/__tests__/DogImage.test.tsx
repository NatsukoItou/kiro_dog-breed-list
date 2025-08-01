import { render, screen, fireEvent } from '@testing-library/react'
import { DogImage } from '../DogImage'
import type { DogImage as DogImageType } from '../../types'

describe('DogImage', () => {
  const mockImage: DogImageType = {
    id: 'test-id',
    url: 'https://images.dog.ceo/breeds/labrador/test.jpg',
    breed: 'labrador',
    addedAt: new Date('2024-01-01T00:00:00.000Z')
  }

  it('ローディング状態を表示する', () => {
    render(<DogImage image={null} loading={true} />)
    
    expect(screen.getByText('画像を読み込み中...')).toBeInTheDocument()
  })

  it('画像がない場合のプレースホルダーを表示する', () => {
    render(<DogImage image={null} loading={false} />)
    
    expect(screen.getByText('画像がありません')).toBeInTheDocument()
  })

  it('画像を正常に表示する', () => {
    render(<DogImage image={mockImage} loading={false} />)
    
    const img = screen.getByAltText('labradorの画像')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', mockImage.url)
    
    expect(screen.getByText('labrador')).toBeInTheDocument()
  })

  it('犬種名にスラッシュが含まれる場合、ハイフンに変換して表示する', () => {
    const imageWithSubBreed: DogImageType = {
      ...mockImage,
      breed: 'bulldog/english'
    }
    
    render(<DogImage image={imageWithSubBreed} loading={false} />)
    
    expect(screen.getByText('bulldog - english')).toBeInTheDocument()
  })

  it('犬種名がない場合、汎用的なalt属性を使用する', () => {
    const imageWithoutBreed: DogImageType = {
      ...mockImage,
      breed: undefined
    }
    
    render(<DogImage image={imageWithoutBreed} loading={false} />)
    
    const img = screen.getByAltText('犬の画像')
    expect(img).toBeInTheDocument()
  })

  it('画像読み込みエラー時にフォールバック画像を表示する', () => {
    render(<DogImage image={mockImage} loading={false} />)
    
    const img = screen.getByAltText('labradorの画像') as HTMLImageElement
    
    // エラーイベントを発火
    fireEvent.error(img)
    
    // フォールバック画像のsrcが設定されることを確認
    expect(img.src).toContain('data:image/svg+xml')
  })
})