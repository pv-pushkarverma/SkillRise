import puppeteer from 'puppeteer'
import fs from 'fs'

export const generatePdfBuffer = async (htmlContent) => {
  const configuredPath = process.env.PUPPETEER_EXECUTABLE_PATH
  const chromiumPath = configuredPath
    ? configuredPath
    : fs.existsSync('/usr/bin/chromium-browser')
      ? '/usr/bin/chromium-browser'
      : fs.existsSync('/usr/bin/chromium')
        ? '/usr/bin/chromium'
        : undefined

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: chromiumPath,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  })

  try {
    const page = await browser.newPage()
    await page.setContent(htmlContent, {
      // Do not block certificate generation on external QR image/network calls.
      waitUntil: 'domcontentloaded',
      timeout: 15000,
    })

    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true,
      preferCSSPageSize: true,
    })

    return pdfBuffer
  } finally {
    await browser.close()
  }
}
