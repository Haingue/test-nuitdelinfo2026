import { describe, expect, it } from 'vitest'
import {
  countLiveNeighbors,
  createEmptyGrid,
  createRandomGrid,
  nextGeneration,
  toggleCell,
} from './gameOfLife'

describe('createEmptyGrid', () => {
  it('creates a grid of the requested size filled with dead cells', () => {
    expect(createEmptyGrid(2, 3)).toEqual([
      [false, false, false],
      [false, false, false],
    ])
  })

  it('rejects invalid dimensions', () => {
    expect(() => createEmptyGrid(-1, 3)).toThrow(RangeError)
    expect(() => createEmptyGrid(2, 1.5)).toThrow(RangeError)
  })
})

describe('countLiveNeighbors', () => {
  it('counts adjacent live cells without wrapping at the edges', () => {
    const grid = [
      [false, true, false],
      [true, false, true],
      [false, true, false],
    ]

    expect(countLiveNeighbors(grid, 1, 1)).toBe(4)
    expect(countLiveNeighbors(grid, 0, 0)).toBe(2)
  })
})

describe('nextGeneration', () => {
  it('kills a live cell with fewer than two neighbors', () => {
    expect(
      nextGeneration([
        [true, false],
        [false, false],
      ]),
    ).toEqual([
      [false, false],
      [false, false],
    ])
  })

  it('keeps a live cell with two or three neighbors', () => {
    const block = [
      [true, true],
      [true, true],
    ]

    expect(nextGeneration(block)).toEqual(block)
  })

  it('kills a live cell with more than three neighbors', () => {
    const crowded = [
      [true, true, true],
      [true, true, true],
      [true, true, true],
    ]

    expect(nextGeneration(crowded)[1][1]).toBe(false)
  })

  it('births a dead cell with exactly three neighbors', () => {
    const blinker = [
      [false, false, false],
      [true, true, true],
      [false, false, false],
    ]

    expect(nextGeneration(blinker)).toEqual([
      [false, true, false],
      [false, true, false],
      [false, true, false],
    ])
  })

  it('does not mutate the previous generation', () => {
    const grid = [
      [false, false, false],
      [true, true, true],
      [false, false, false],
    ]

    nextGeneration(grid)

    expect(grid).toEqual([
      [false, false, false],
      [true, true, true],
      [false, false, false],
    ])
  })
})

describe('toggleCell', () => {
  it('returns a new grid with only the selected cell toggled', () => {
    const grid = createEmptyGrid(2, 2)
    const updatedGrid = toggleCell(grid, 0, 1)

    expect(updatedGrid).toEqual([
      [false, true],
      [false, false],
    ])
    expect(grid).toEqual(createEmptyGrid(2, 2))
  })

  it('rejects coordinates outside the grid', () => {
    expect(() => toggleCell(createEmptyGrid(2, 2), 2, 0)).toThrow(RangeError)
    expect(() => toggleCell(createEmptyGrid(2, 2), 0, 2)).toThrow(RangeError)
  })
})

describe('createRandomGrid', () => {
  it('supports deterministic random generation and a configurable density', () => {
    const values = [0.1, 0.8, 0.3, 0.9]
    let index = 0

    expect(createRandomGrid(2, 2, 0.5, () => values[index++])).toEqual([
      [true, false],
      [true, false],
    ])
  })
})
