import { test, expect } from '@playwright/test'

test('fill in insuralink code and persist when I leave and come back', async ({
  page,
}) => {
  // start from start your switch page 1
  await page.goto('/start-your-switch')
  // fill in input
  await page.type('input', '123456789')
  //next button should be visible
  await expect(page.getByText('Next')).toBeVisible()
  //go to next
  await page.click('text=Next')

  await expect(
    page.getByRole('heading', {
      name: 'Who is your current insurance provider that you would like to cancel with?',
    })
  ).toBeVisible()

  //go back
  await page.locator('#backArrow').click()
  //after the going back, input should still be filled
  await expect(page.locator('input[type=text]')).toHaveValue('123456789')
})

test('fill in current insuranace provider and persist when I leave and come back', async ({
  page,
}) => {
  await page.goto('/start-your-switch/current-insurance')

  await page.click('text=State Farm')

  await expect(page.getByText('Next')).toBeVisible()

  await page.click('text=Next')

  await expect(
    page.getByRole('heading', {
      name: 'What is your current insurance policy number?',
    })
  ).toBeVisible()

  await page.locator('#backArrow').click()

  await page.type('input', 'Nationwide')

  await expect(page.getByText('Next')).toBeVisible()

  await page.click('text=Next')

  await expect(
    page.getByRole('heading', {
      name: 'What is your current insurance policy number?',
    })
  ).toBeVisible()

  await page.locator('#backArrow').click()

  await expect(page.locator('input[type=text]')).toHaveValue('Nationwide')
})

test('fill in insurance number and persist when I leave and come back', async ({
  page,
}) => {
  await page.goto('/start-your-switch/current-number')

  await page.type('input', '78243543')

  await expect(page.getByText('Next')).toBeVisible()

  await page.click('text=Next')

  await expect(
    page.getByRole('heading', {
      name: 'When would you like this insurance policy to be cancelled?',
    })
  ).toBeVisible()

  await page.locator('#backArrow').click()

  await expect(page.locator('input[type=text]')).toHaveValue('78243543')
})

test('fill in date and persist when I leave and come back', async ({
  page,
}) => {
  await page.goto('/start-your-switch/date')

  await page.click('text=24')

  await expect(page.getByText('You picked May 24, 2023')).toBeVisible()

  await page.click('text=Next')

  await expect(
    page.getByRole('heading', {
      name: 'Identification Card',
    })
  ).toBeVisible()

  await page.locator('#backArrow').click()

  await expect(page.getByText('You picked May 24, 2023')).toBeVisible()
})

test('upload id card and persist when I leave and come back', async ({
  page,
}) => {
  await page.goto('/start-your-switch/id-card')

  await page.getByLabel('Upload').setInputFiles('./e2e/fixtures/id-card.png')

  await expect(page.locator('#awsImg')).toBeVisible()

  await expect(page.getByText('Next')).toBeVisible()

  await page.click('text=Next')
})

test('fill in new insurance provider and persist when I leave and come back', async ({
  page,
}) => {
  await page.goto('/start-your-switch/new-insurance')

  await page.locator('#agentName').fill('Caleb Martin')
  await page.locator('#agentCompany').fill('State Farm')
  await page.locator('#agentEmail').fill('cmartin@statefarm.com')

  await expect(page.getByText('Next')).toBeVisible()
  await page.click('text=Next')

  await expect(
    page.getByRole('heading', {
      name: 'What is your new insurance policy number?',
    })
  ).toBeVisible()

  await page.locator('#backArrow').click()

  await expect(page.locator('#agentCompany')).toHaveValue('State Farm')
})
