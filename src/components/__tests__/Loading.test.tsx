import { render, screen } from '@testing-library/react'
import { Loading } from '../Loading'

describe('Loading', () => {
  it('デフォルトのローディング状態を表示する', () => {
    render(<Loading />)
    
    expect(screen.getByText('読み込み中...')).toBeInTheDocument()
    
    const loadingElement = document.querySelector('.loading')
    expect(loadingElement).toHaveClass('loading-spinner', 'loading-md')
  })

  it('カスタムメッセージを表示する', () => {
    render(<Loading message="データを取得中..." />)
    
    expect(screen.getByText('データを取得中...')).toBeInTheDocument()
  })

  it('メッセージなしで表示する', () => {
    render(<Loading message="" />)
    
    expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument()
    
    const loadingElement = document.querySelector('.loading')
    expect(loadingElement).toBeInTheDocument()
  })

  it('異なるサイズを適用する', () => {
    const { rerender } = render(<Loading size="small" />)
    
    let loadingElement = document.querySelector('.loading')
    expect(loadingElement).toHaveClass('loading-sm')
    
    let messageElement = screen.getByText('読み込み中...')
    expect(messageElement).toHaveClass('text-sm')
    
    rerender(<Loading size="large" />)
    loadingElement = document.querySelector('.loading')
    expect(loadingElement).toHaveClass('loading-lg')
    
    messageElement = screen.getByText('読み込み中...')
    expect(messageElement).toHaveClass('text-lg')
  })

  it('異なるバリアントを適用する', () => {
    const { rerender } = render(<Loading variant="spinner" />)
    
    let loadingElement = document.querySelector('.loading')
    expect(loadingElement).toHaveClass('loading-spinner')
    
    rerender(<Loading variant="dots" />)
    loadingElement = document.querySelector('.loading')
    expect(loadingElement).toHaveClass('loading-dots')
    
    rerender(<Loading variant="pulse" />)
    loadingElement = document.querySelector('.loading')
    expect(loadingElement).toHaveClass('loading-ring')
  })

  it('すべてのプロパティを組み合わせて使用できる', () => {
    render(<Loading message="カスタムメッセージ" size="large" variant="dots" />)
    
    expect(screen.getByText('カスタムメッセージ')).toBeInTheDocument()
    
    const loadingElement = document.querySelector('.loading')
    expect(loadingElement).toHaveClass('loading-dots', 'loading-lg')
    
    const messageElement = screen.getByText('カスタムメッセージ')
    expect(messageElement).toHaveClass('text-lg')
  })
})