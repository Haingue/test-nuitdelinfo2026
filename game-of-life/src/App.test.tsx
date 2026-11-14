import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'

const ROWS = 20
const COLUMNS = 20

function getCell(row: number, column: number, state: 'vivante' | 'morte') {
  return screen.getByRole('button', {
    name: `Ligne ${row}, colonne ${column}, cellule ${state}`,
  })
}

function expectGeneration(value: number) {
  expect(screen.getByText('Génération')).toHaveTextContent(
    new RegExp(`^Génération ${value}$`),
  )
}

function expectLiveCells(value: number) {
  expect(screen.getByText('Cellules vivantes')).toHaveTextContent(
    new RegExp(`^Cellules vivantes ${value}$`),
  )
}

describe('App', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('renders an empty paused simulation', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: 'Jeu de la vie' }),
    ).toBeInTheDocument()
    expectGeneration(0)
    expectLiveCells(0)
    expect(
      screen.getByRole('button', { name: 'Démarrer' }),
    ).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: 'Étape' })).toBeEnabled()

    const board = screen.getByRole('group', {
      name: 'Grille du Jeu de la vie',
    })
    expect(board.querySelectorAll('button')).toHaveLength(ROWS * COLUMNS)
  })

  it('toggles a cell on click and updates the live cell counter', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(getCell(3, 5, 'morte'))

    expect(getCell(3, 5, 'vivante')).toHaveAttribute('aria-pressed', 'true')
    expectLiveCells(1)

    await user.click(getCell(3, 5, 'vivante'))

    expect(getCell(3, 5, 'morte')).toHaveAttribute('aria-pressed', 'false')
    expectLiveCells(0)
  })

  it('advances a blinker by one generation with the step button', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Blinker horizontal sur la ligne 2
    await user.click(getCell(2, 1, 'morte'))
    await user.click(getCell(2, 2, 'morte'))
    await user.click(getCell(2, 3, 'morte'))
    expectLiveCells(3)

    await user.click(screen.getByRole('button', { name: 'Étape' }))

    expectGeneration(1)
    expectLiveCells(3)
    // Le blinker devient vertical sur la colonne 2
    expect(getCell(1, 2, 'vivante')).toBeInTheDocument()
    expect(getCell(2, 2, 'vivante')).toBeInTheDocument()
    expect(getCell(3, 2, 'vivante')).toBeInTheDocument()
    expect(getCell(2, 1, 'morte')).toBeInTheDocument()
    expect(getCell(2, 3, 'morte')).toBeInTheDocument()
  })

  it('runs the simulation every 300 ms once started and stops on pause', () => {
    vi.useFakeTimers()
    render(<App />)

    fireEvent.click(getCell(2, 1, 'morte'))
    fireEvent.click(getCell(2, 2, 'morte'))
    fireEvent.click(getCell(2, 3, 'morte'))

    fireEvent.click(screen.getByRole('button', { name: 'Démarrer' }))

    const pauseButton = screen.getByRole('button', { name: 'Pause' })
    expect(pauseButton).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Étape' })).toBeDisabled()

    act(() => {
      vi.advanceTimersByTime(300)
    })
    expectGeneration(1)

    act(() => {
      vi.advanceTimersByTime(300)
    })
    expectGeneration(2)

    fireEvent.click(pauseButton)
    expect(
      screen.getByRole('button', { name: 'Démarrer' }),
    ).toHaveAttribute('aria-pressed', 'false')

    act(() => {
      vi.advanceTimersByTime(900)
    })
    expectGeneration(2)
  })

  it('clears the board, stops the simulation and resets the generation', () => {
    vi.useFakeTimers()
    render(<App />)

    fireEvent.click(getCell(2, 1, 'morte'))
    fireEvent.click(getCell(2, 2, 'morte'))
    fireEvent.click(getCell(2, 3, 'morte'))
    fireEvent.click(screen.getByRole('button', { name: 'Démarrer' }))
    act(() => {
      vi.advanceTimersByTime(300)
    })

    fireEvent.click(screen.getByRole('button', { name: 'Réinitialiser' }))

    expectGeneration(0)
    expectLiveCells(0)
    expect(
      screen.getByRole('button', { name: 'Démarrer' }),
    ).toHaveAttribute('aria-pressed', 'false')

    act(() => {
      vi.advanceTimersByTime(900)
    })
    expectGeneration(0)
  })

  it('fills the board with random cells and resets the generation', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Étape' }))
    expectGeneration(1)

    await user.click(screen.getByRole('button', { name: 'Aléatoire' }))

    expectGeneration(0)
    expectLiveCells(ROWS * COLUMNS)
    expect(
      screen.getByRole('button', { name: 'Démarrer' }),
    ).toHaveAttribute('aria-pressed', 'false')
  })
})
