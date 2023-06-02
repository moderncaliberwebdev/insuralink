import { test, expect } from '@playwright/test'

test('login', async ({ page }) => {
  // start from start your switch page 1
  await page.goto('/sign-in')
  // fill in input
  await page.locator('#email').fill('cmartin@moderncaliber.com')
  await page.locator('#password').fill('123456')
  //next button should be visible
  //go to next
  await page.click('text=Sign In')

  await expect(
    page.getByRole('heading', {
      name: 'Company Dashboard',
    })
  ).toBeVisible()
})
