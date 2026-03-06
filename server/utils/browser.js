import puppeteer from 'puppeteer-core'

let browserInstance = null

export const getBrowser = async () => {
  if (browserInstance) return browserInstance

  browserInstance = await puppeteer.launch({
    headless: 'new',
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  })

  browserInstance.on('disconnected', () => {
    browserInstance = null
  })

  return browserInstance
}
