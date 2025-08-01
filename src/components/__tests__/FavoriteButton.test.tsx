import { render, screen, fireEvent } from '@testing-library/react'
import { FavoriteButton } from '../FavoriteButton'

describe('FavoriteButton', () => {
  const mockOnToggle = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('お気に入りでない状態を正しく表示する', () => {
    render(<FavoriteButton isFavorite={false} onToggle={mockOnToggle} />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('title', 'お気に入りに追加')
    expect(screen.getByText('お気に入りに追加')).toBeInTheDocument()
  })

  it('お気に入り状態を正しく表示する', () => {
    render(<FavoriteButton isFavorite={true} onToggle={mockOnToggle} />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('title', 'お気に入りから削除')
    expect(screen.getByText('お気に入りから削除')).toBeInTheDocument()
  })

  it('クリック時にonToggleが呼ばれる', () => {
    render(<FavoriteButton isFavorite={false} onToggle={mockOnToggle} />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(mockOnToggle).toHaveBeenCalledTimes(1)
  })

  it('disabled状態では操作できない', () => {
    render(<FavoriteButton isFavorite={false} onToggle={mockOnToggle} disabled={true} />)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    
    fireEvent.click(button)
    expect(mockOnToggle).not.toHaveBeenCalled()
  })

  it('circle variantではテキストを表示しない', () => {
    render(<FavoriteButton isFavorite={false} onToggle={mockOnToggle} variant="circle" />)
    
    expect(screen.queryByText('お気に入りに追加')).not.toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveAttribute('title', 'お気に入りに追加')
  })

  it('カスタムクラス名を適用する', () => {
    render(<FavoriteButton isFavorite={false} onToggle={mockOnToggle} className="custom-class" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  it('異なるサイズのアイコンを表示する', () => {
    const { rerender } = render(<FavoriteButton isFavorite={false} onToggle={mockOnToggle} size="sm" />)
    
    let svg = screen.getByRole('button').querySelector('svg')
    expect(svg).toHaveClass('h-1.5', 'w-1.5')
    
    rerender(<FavoriteButton isFavorite={false} onToggle={mockOnToggle} size="md" />)
    svg = screen.getByRole('button').querySelector('svg')
    expect(svg).toHaveClass('h-2', 'w-2')
    
    rerender(<FavoriteButton isFavorite={false} onToggle={mockOnToggle} size="lg" />)
    svg = screen.getByRole('button').querySelector('svg')
    expect(svg).toHaveClass('h-2', 'w-2')
  })
})