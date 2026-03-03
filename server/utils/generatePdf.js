import puppeteer from 'puppeteer'

export const generatePdfBuffer = async (htmlContent) => {
  const browser = await puppeteer.launch({
    headless: 'new',
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
