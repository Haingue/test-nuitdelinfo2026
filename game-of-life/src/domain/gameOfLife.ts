export type Grid = ReadonlyArray<ReadonlyArray<boolean>>

export function createEmptyGrid(rows: number, columns: number): Grid {
  if (!Number.isInteger(rows) || rows < 0) {
    throw new RangeError(
      'Le nombre de lignes doit être un entier positif ou nul.',
    )
  }
  if (!Number.isInteger(columns) || columns < 0) {
    throw new RangeError(
      'Le nombre de colonnes doit être un entier positif ou nul.',
    )
  }

  return Array.from({ length: rows }, () => Array(columns).fill(false))
}

export function countLiveNeighbors(
  grid: Grid,
  row: number,
  column: number,
): number {
  let liveNeighbors = 0

  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
    for (let columnOffset = -1; columnOffset <= 1; columnOffset += 1) {
      if (rowOffset === 0 && columnOffset === 0) continue

      const neighborRow = row + rowOffset
      const neighborColumn = column + columnOffset

      if (grid[neighborRow]?.[neighborColumn]) liveNeighbors += 1
    }
  }

  return liveNeighbors
}

export function nextGeneration(grid: Grid): Grid {
  return grid.map((cells, row) =>
    cells.map((isAlive, column) => {
      const neighbors = countLiveNeighbors(grid, row, column)
      return isAlive ? neighbors === 2 || neighbors === 3 : neighbors === 3
    }),
  )
}

export function toggleCell(grid: Grid, row: number, column: number): Grid {
  if (!Number.isInteger(row) || !grid[row]) {
    throw new RangeError('La ligne indiquée ne fait pas partie de la grille.')
  }
  if (!Number.isInteger(column) || column < 0 || column >= grid[row].length) {
    throw new RangeError('La colonne indiquée ne fait pas partie de la grille.')
  }

  return grid.map((cells, currentRow) =>
    cells.map((isAlive, currentColumn) =>
      currentRow === row && currentColumn === column ? !isAlive : isAlive,
    ),
  )
}

export function createRandomGrid(
  rows: number,
  columns: number,
  probability = 0.25,
  random: () => number = Math.random,
): Grid {
  if (probability < 0 || probability > 1) {
    throw new RangeError('La probabilité doit être comprise entre 0 et 1.')
  }

  return Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => random() < probability),
  )
}
