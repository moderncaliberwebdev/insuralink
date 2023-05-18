import { test, expect } from '@playwright/test'

test('should navigate to our service', async ({ page }) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto('/')
  // Find an element with the text 'Discover More' and click on it
  await page.click('text=Discover More')
  // The new url should be "/about" (baseURL is used there)
  await expect(page).toHaveURL('/our-service')
  // The new page should contain an h1 with "About Page"
  await expect(page.locator('h1')).toContainText('Our Service')
})

test('should send message', async ({ page }) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto('/contact-us')
  // Text input
  await page.getByPlaceholder('Type your full name').fill('John Doe')
  // Email input
  await page.getByPlaceholder('example@gmail.com').fill('caleb637@icloud.com')
  // Text input
  await page.getByPlaceholder('717-777-7777').fill('717-777-7777')
  // Text input
  await page.getByPlaceholder('Type your inquiry').fill('Playwright testing')
  // Find an element with the text 'Send Message' and click on it
  await page.click('text=Send Message')
  //after the form submits, the response should say "Message Sent"
  await expect(page.getByText('Message Sent')).toBeVisible()
})
