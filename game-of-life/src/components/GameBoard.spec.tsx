import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { GameBoard } from './GameBoard'
import type { Grid } from '../domain/gameOfLife'

const grid: Grid = [
  [false, true],
  [true, false],
]

describe('GameBoard', () => {
  it('renders one button per cell inside a labelled group', () => {
    render(<GameBoard grid={grid} onToggleCell={() => {}} />)

    const board = screen.getByRole('group', {
      name: 'Grille du Jeu de la vie',
    })
    expect(board).toBeInTheDocument()
    expect(screen.getAllByRole('button')).toHaveLength(4)
  })

  it('sizes the CSS grid according to the number of columns', () => {
    render(<GameBoard grid={grid} onToggleCell={() => {}} />)

    expect(
      screen.getByRole('group', { name: 'Grille du Jeu de la vie' }),
    ).toHaveStyle({ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' })
  })

  it('exposes the cell state through aria-pressed and the accessible name', () => {
    render(<GameBoard grid={grid} onToggleCell={() => {}} />)

    const aliveCell = screen.getByRole('button', {
      name: 'Ligne 1, colonne 2, cellule vivante',
    })
    const deadCell = screen.getByRole('button', {
      name: 'Ligne 1, colonne 1, cellule morte',
    })

    expect(aliveCell).toHaveAttribute('aria-pressed', 'true')
    expect(deadCell).toHaveAttribute('aria-pressed', 'false')
  })

  it('notifies the clicked cell coordinates', async () => {
    const user = userEvent.setup()
    const onToggleCell = vi.fn()
    render(<GameBoard grid={grid} onToggleCell={onToggleCell} />)

    await user.click(
      screen.getByRole('button', {
        name: 'Ligne 2, colonne 1, cellule vivante',
      }),
    )

    expect(onToggleCell).toHaveBeenCalledExactlyOnceWith(1, 0)
  })

  it('renders an empty board without cells', () => {
    render(<GameBoard grid={[]} onToggleCell={() => {}} />)

    expect(screen.queryAllByRole('button')).toHaveLength(0)
  })
})
