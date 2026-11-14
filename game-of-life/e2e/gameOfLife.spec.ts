import { expect, test, type Page } from '@playwright/test'

const ROWS = 20
const COLUMNS = 20

function cell(page: Page, row: number, column: number) {
  return page.getByRole('button', {
    name: new RegExp(`^Ligne ${row}, colonne ${column}, cellule`),
  })
}

function generation(page: Page) {
  return page.getByText('Génération', { exact: true }).locator('..')
}

function liveCells(page: Page) {
  return page.getByText('Cellules vivantes', { exact: true }).locator('..')
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('affiche une grille vide à l’état initial', async ({ page }) => {
  await expect(
    page.getByRole('heading', { name: 'Jeu de la vie' }),
  ).toBeVisible()
  await expect(generation(page)).toHaveText('Génération 0')
  await expect(liveCells(page)).toHaveText('Cellules vivantes 0')

  const board = page.getByRole('group', { name: 'Grille du Jeu de la vie' })
  await expect(board.getByRole('button')).toHaveCount(ROWS * COLUMNS)
  await expect(page.getByRole('button', { name: 'Démarrer' })).toBeVisible()
})

test('active une cellule au clic et met à jour le compteur', async ({
  page,
}) => {
  await cell(page, 5, 5).click()

  await expect(cell(page, 5, 5)).toHaveAttribute('aria-pressed', 'true')
  await expect(liveCells(page)).toHaveText('Cellules vivantes 1')

  await cell(page, 5, 5).click()

  await expect(cell(page, 5, 5)).toHaveAttribute('aria-pressed', 'false')
  await expect(liveCells(page)).toHaveText('Cellules vivantes 0')
})

test('fait évoluer un blinker avec le bouton Étape', async ({ page }) => {
  await cell(page, 2, 1).click()
  await cell(page, 2, 2).click()
  await cell(page, 2, 3).click()
  await expect(liveCells(page)).toHaveText('Cellules vivantes 3')

  await page.getByRole('button', { name: 'Étape' }).click()

  await expect(generation(page)).toHaveText('Génération 1')
  await expect(liveCells(page)).toHaveText('Cellules vivantes 3')
  // Le blinker horizontal devient vertical
  await expect(cell(page, 1, 2)).toHaveAttribute('aria-pressed', 'true')
  await expect(cell(page, 2, 2)).toHaveAttribute('aria-pressed', 'true')
  await expect(cell(page, 3, 2)).toHaveAttribute('aria-pressed', 'true')
  await expect(cell(page, 2, 1)).toHaveAttribute('aria-pressed', 'false')
  await expect(cell(page, 2, 3)).toHaveAttribute('aria-pressed', 'false')
})

test('démarre puis met en pause la simulation', async ({ page }) => {
  await cell(page, 2, 1).click()
  await cell(page, 2, 2).click()
  await cell(page, 2, 3).click()

  await page.getByRole('button', { name: 'Démarrer' }).click()

  const pauseButton = page.getByRole('button', { name: 'Pause' })
  await expect(pauseButton).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('button', { name: 'Étape' })).toBeDisabled()
  await expect(generation(page)).toHaveText(/Génération [1-9]\d*/)

  await pauseButton.click()

  await expect(page.getByRole('button', { name: 'Démarrer' })).toBeVisible()
  const frozenGeneration = await generation(page).textContent()
  await page.waitForTimeout(700)
  await expect(generation(page)).toHaveText(frozenGeneration ?? '')
})

test('réinitialise la grille et arrête la simulation', async ({ page }) => {
  await cell(page, 2, 1).click()
  await cell(page, 2, 2).click()
  await cell(page, 2, 3).click()
  await page.getByRole('button', { name: 'Démarrer' }).click()
  await expect(generation(page)).toHaveText(/Génération [1-9]\d*/)

  await page.getByRole('button', { name: 'Réinitialiser' }).click()

  await expect(generation(page)).toHaveText('Génération 0')
  await expect(liveCells(page)).toHaveText('Cellules vivantes 0')
  await expect(page.getByRole('button', { name: 'Démarrer' })).toBeVisible()
})

test('remplit la grille aléatoirement et remet la génération à zéro', async ({
  page,
}) => {
  await page.getByRole('button', { name: 'Étape' }).click()
  await expect(generation(page)).toHaveText('Génération 1')

  await page.getByRole('button', { name: 'Aléatoire' }).click()

  await expect(generation(page)).toHaveText('Génération 0')
  await expect(liveCells(page)).not.toHaveText('Cellules vivantes 0')
  await expect(page.getByRole('button', { name: 'Démarrer' })).toBeVisible()
})
