import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ToastContainer, type ToastMessage } from '../Toast'

describe('ToastContainer', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const createMockToast = (overrides: Partial<ToastMessage> = {}): ToastMessage => ({
    id: 'test-toast-1',
    type: 'info',
    title: 'テストタイトル',
    message: 'テストメッセージ',
    duration: 5000,
    ...overrides
  })

  it('トーストが空の場合は何も表示しない', () => {
    render(<ToastContainer toasts={[]} onClose={mockOnClose} />)
    
    expect(document.querySelector('.toast')).not.toBeInTheDocument()
  })

  it('成功トーストを表示する', () => {
    const successToast = createMockToast({
      type: 'success',
      title: '成功しました'
    })

    render(<ToastContainer toasts={[successToast]} onClose={mockOnClose} />)
    
    expect(screen.getByText('成功しました')).toBeInTheDocument()
    expect(screen.getByText('テストメッセージ')).toBeInTheDocument()
    
    const alertElement = document.querySelector('.alert-success')
    expect(alertElement).toBeInTheDocument()
  })

  it('エラートーストを表示する', () => {
    const errorToast = createMockToast({
      type: 'error',
      title: 'エラーが発生しました'
    })

    render(<ToastContainer toasts={[errorToast]} onClose={mockOnClose} />)
    
    expect(screen.getByText('エラーが発生しました')).toBeInTheDocument()
    
    const alertElement = document.querySelector('.alert-error')
    expect(alertElement).toBeInTheDocument()
  })

  it('警告トーストを表示する', () => {
    const warningToast = createMockToast({
      type: 'warning',
      title: '警告'
    })

    render(<ToastContainer toasts={[warningToast]} onClose={mockOnClose} />)
    
    expect(screen.getByText('警告')).toBeInTheDocument()
    
    const alertElement = document.querySelector('.alert-warning')
    expect(alertElement).toBeInTheDocument()
  })

  it('情報トーストを表示する', () => {
    const infoToast = createMockToast({
      type: 'info',
      title: '情報'
    })

    render(<ToastContainer toasts={[infoToast]} onClose={mockOnClose} />)
    
    expect(screen.getByText('情報')).toBeInTheDocument()
    
    const alertElement = document.querySelector('.alert-info')
    expect(alertElement).toBeInTheDocument()
  })

  it('メッセージなしのトーストを表示する', () => {
    const toastWithoutMessage = createMockToast({
      message: undefined
    })

    render(<ToastContainer toasts={[toastWithoutMessage]} onClose={mockOnClose} />)
    
    expect(screen.getByText('テストタイトル')).toBeInTheDocument()
    expect(screen.queryByText('テストメッセージ')).not.toBeInTheDocument()
  })

  it('閉じるボタンでトーストを閉じる', async () => {
    const toast = createMockToast()

    render(<ToastContainer toasts={[toast]} onClose={mockOnClose} />)
    
    const closeButton = screen.getByLabelText('閉じる')
    fireEvent.click(closeButton)
    
    // アニメーション時間を待つ
    vi.advanceTimersByTime(300)
    
    expect(mockOnClose).toHaveBeenCalledWith('test-toast-1')
  })

  it('アクションボタンが動作する', () => {
    const mockAction = vi.fn()
    const toastWithAction = createMockToast({
      action: {
        label: 'アクション',
        onClick: mockAction
      }
    })

    render(<ToastContainer toasts={[toastWithAction]} onClose={mockOnClose} />)
    
    const actionButton = screen.getByText('アクション')
    fireEvent.click(actionButton)
    
    expect(mockAction).toHaveBeenCalledTimes(1)
  })

  it('指定時間後に自動的に閉じる', () => {
    const toast = createMockToast({
      duration: 3000
    })

    render(<ToastContainer toasts={[toast]} onClose={mockOnClose} />)
    
    expect(screen.getByText('テストタイトル')).toBeInTheDocument()
    
    // 指定時間を進める
    vi.advanceTimersByTime(3000)
    
    // アニメーション時間も進める
    vi.advanceTimersByTime(300)
    
    expect(mockOnClose).toHaveBeenCalledWith('test-toast-1')
  })

  it('duration が 0 の場合は自動的に閉じない', () => {
    const toast = createMockToast({
      duration: 0
    })

    render(<ToastContainer toasts={[toast]} onClose={mockOnClose} />)
    
    expect(screen.getByText('テストタイトル')).toBeInTheDocument()
    
    // 長時間経過させても閉じない
    vi.advanceTimersByTime(10000)
    
    expect(mockOnClose).not.toHaveBeenCalled()
    expect(screen.getByText('テストタイトル')).toBeInTheDocument()
  })

  it('複数のトーストを同時に表示する', () => {
    const toasts = [
      createMockToast({ id: 'toast-1', title: 'トースト1' }),
      createMockToast({ id: 'toast-2', title: 'トースト2', type: 'success' }),
      createMockToast({ id: 'toast-3', title: 'トースト3', type: 'error' })
    ]

    render(<ToastContainer toasts={toasts} onClose={mockOnClose} />)
    
    expect(screen.getByText('トースト1')).toBeInTheDocument()
    expect(screen.getByText('トースト2')).toBeInTheDocument()
    expect(screen.getByText('トースト3')).toBeInTheDocument()
  })
})