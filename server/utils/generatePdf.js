import { getBrowser } from './browser.js'

export const generatePdfBuffer = async (htmlContent) => {
  const browser = await getBrowser()

  const page = await browser.newPage()

  try {
    await page.setContent(htmlContent, {
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
    await page.close()
  }
}
