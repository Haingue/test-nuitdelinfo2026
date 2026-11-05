import type { Grid } from '../domain/gameOfLife'

type GameBoardProps = {
  grid: Grid
  onToggleCell: (row: number, column: number) => void
}

export function GameBoard({ grid, onToggleCell }: GameBoardProps) {
  return (
    <div
      className="grid aspect-square w-full gap-px bg-[#8a9690] p-px"
      role="group"
      aria-label="Grille du Jeu de la vie"
      style={{ gridTemplateColumns: `repeat(${grid[0]?.length ?? 0}, minmax(0, 1fr))` }}
    >
      {grid.flatMap((cells, row) =>
        cells.map((isAlive, column) => (
          <button
            key={`${row}-${column}`}
            className="min-h-0 min-w-0 cursor-pointer border-0 bg-[#f3f5f2] p-0 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#bf4b29] aria-pressed:bg-[#246b52]"
            type="button"
            aria-pressed={isAlive}
            aria-label={`Ligne ${row + 1}, colonne ${column + 1}, cellule ${isAlive ? 'vivante' : 'morte'}`}
            onClick={() => onToggleCell(row, column)}
          />
        )),
      )}
    </div>
  )
}