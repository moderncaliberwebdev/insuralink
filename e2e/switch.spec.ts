// import { test, expect } from '@playwright/test'

// test('switch your insurance process', async ({ page }) => {
//   // start from start your switch page 1
//   await page.goto('/start-your-switch')
//   // fill in input
//   await page.type('input', 'OVN1GvDZi1OV7blEXyrDuZ57Oo1aqOHp')

//   await page.goto('/start-your-switch/current-insurance')

//   await expect(
//     page.getByRole('heading', {
//       name: 'Who is your current insurance provider that you would like to cancel with?',
//     })
//   ).toBeVisible()

//   //go back
//   await page.locator('#backArrow').click()
//   //after the going back, input should still be filled
//   await expect(page.locator('input[type=text]')).toHaveValue(
//     'OVN1GvDZi1OV7blEXyrDuZ57Oo1aqOHp'
//   )

//   await page.goto('/start-your-switch/current-insurance')

//   //insurance provider
//   await page.click('text=State Farm')

//   await page.goto('/start-your-switch/current-number')

//   //current policy number
//   await page.type('input', '78243543')

//   await page.goto('/start-your-switch/current-insurance-email')

//   //current agent email
//   await page.type('input', 'cmartin@moderncaliber.com')
//   await page.goto('/start-your-switch/your-email')

//   //your name and email
//   await page.locator('#nameInput').fill('Caleb Martin')
//   await page.locator('#emailInput').fill('caleb637@icloud.com')

//   await page.goto('/start-your-switch/date')

//   //fill in date
//   await page.click('text=15')

//   await expect(
//     page.getByText(
//       `You picked ${new Date().toLocaleString('en-US', {
//         month: 'short',
//       })} 15, ${new Date().getFullYear()}`
//     )
//   ).toBeVisible()
// })

// // test('fill in date and persist when I leave and come back', async ({
// //   page,
// // }) => {
// //   await page.goto('/start-your-switch/date')

// //   await page.click('text=24')

// //   await expect(page.getByText('You picked Jun 24, 2023')).toBeVisible()

// //   await page.click('text=Next')

// //   await expect(
// //     page.getByRole('heading', {
// //       name: 'Identification Card',
// //     })
// //   ).toBeVisible()

// //   await page.locator('#backArrow').click()

// //   await expect(page.getByText('You picked Jun 24, 2023')).toBeVisible()
// // })

// // test('upload id card and persist when I leave and come back', async ({
// //   page,
// // }) => {
// //   await page.goto('/start-your-switch/id-card')

// //   await page.getByLabel('Upload').setInputFiles('./e2e/fixtures/id-card.png')

// //   await expect(page.locator('#awsImg')).toBeVisible()

// //   await expect(page.getByText('Next')).toBeVisible()

// //   await page.click('text=Next')
// // })

// // test('fill in new insurance provider and persist when I leave and come back', async ({
// //   page,
// // }) => {
// //   await page.goto('/start-your-switch/new-insurance')

// //   await page.locator('#agentName').fill('Caleb Martin')
// //   await page.locator('#agentCompany').fill('State Farm')
// //   await page.locator('#agentEmail').fill('cmartin@statefarm.com')

// //   await expect(page.getByText('Next')).toBeVisible()
// //   await page.click('text=Next')

// //   await expect(
// //     page.getByRole('heading', {
// //       name: 'What is your new insurance policy number?',
// //     })
// //   ).toBeVisible()

// //   await page.locator('#backArrow').click()

// //   await expect(page.locator('#agentCompany')).toHaveValue('State Farm')
// // })
