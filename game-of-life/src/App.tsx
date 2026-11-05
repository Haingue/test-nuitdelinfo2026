import { useEffect, useState } from 'react'
import { GameBoard } from './components/GameBoard'
import {
  createEmptyGrid,
  createRandomGrid,
  nextGeneration,
  toggleCell,
  type Grid,
} from './domain/gameOfLife'

const ROWS = 20
const COLUMNS = 20
const GENERATION_INTERVAL = 300
const buttonClassName =
  'inline-flex min-h-10 items-center justify-center rounded-md border border-[#becbc3] bg-white px-3 text-sm font-medium text-[#1c2822] transition-colors hover:bg-[#edf3ef] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bf4b29] disabled:cursor-not-allowed disabled:opacity-50'

function App() {
  const [grid, setGrid] = useState<Grid>(() => createEmptyGrid(ROWS, COLUMNS))
  const [generation, setGeneration] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const liveCells = grid.reduce(
    (total, row) => total + row.filter(Boolean).length,
    0,
  )

  useEffect(() => {
    if (!isRunning) return

    const intervalId = window.setInterval(() => {
      setGrid((currentGrid) => nextGeneration(currentGrid))
      setGeneration((currentGeneration) => currentGeneration + 1)
    }, GENERATION_INTERVAL)

    return () => window.clearInterval(intervalId)
  }, [isRunning])

  function advanceGeneration() {
    setGrid((currentGrid) => nextGeneration(currentGrid))
    setGeneration((currentGeneration) => currentGeneration + 1)
  }

  function handleToggleCell(row: number, column: number) {
    setGrid((currentGrid) => toggleCell(currentGrid, row, column))
  }

  function handleClear() {
    setIsRunning(false)
    setGrid(createEmptyGrid(ROWS, COLUMNS))
    setGeneration(0)
  }

  function handleRandomize() {
    setIsRunning(false)
    setGrid(createRandomGrid(ROWS, COLUMNS, 0.3))
    setGeneration(0)
  }

  return (
    <main className="min-h-screen bg-[#f8faf8] px-4 py-8 text-[#1c2822] sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-2xl">
        <header className="mb-6 border-b border-[#d6ded9] pb-5">
          <h1 className="text-3xl font-semibold">Jeu de la vie</h1>
          <p className="mt-1 text-sm text-[#59675f]">
            Automate cellulaire de Conway
          </p>
        </header>

        <section
          className="mb-4 flex flex-wrap gap-x-8 gap-y-2 text-sm text-[#59675f]"
          aria-label="État de la simulation"
        >
          <p>
            Génération{' '}
            <strong className="font-semibold text-[#1c2822]">
              {generation}
            </strong>
          </p>
          <p>
            Cellules vivantes{' '}
            <strong className="font-semibold text-[#1c2822]">
              {liveCells}
            </strong>
          </p>
        </section>

        <div className="mb-4 flex flex-wrap gap-2" aria-label="Commandes">
          <button
            className={buttonClassName}
            type="button"
            aria-pressed={isRunning}
            onClick={() => setIsRunning((running) => !running)}
          >
            {isRunning ? 'Pause' : 'Démarrer'}
          </button>
          <button
            className={buttonClassName}
            type="button"
            onClick={advanceGeneration}
            disabled={isRunning}
          >
            Étape
          </button>
          <button
            className={buttonClassName}
            type="button"
            onClick={handleRandomize}
          >
            Aléatoire
          </button>
          <button
            className={buttonClassName}
            type="button"
            onClick={handleClear}
          >
            Réinitialiser
          </button>
        </div>

        <GameBoard grid={grid} onToggleCell={handleToggleCell} />
      </div>
    </main>
  )
}

export default App
