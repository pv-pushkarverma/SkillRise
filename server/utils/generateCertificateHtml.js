export const generateCertificateHtml = ({
  studentName,
  courseTitle,
  certificateId,
  issuedAt,
  verificationUrl,
  qrDataUrl,
}) => {
  const safe = (value) =>
    String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')

  const logoSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 60" width="250" height="60" aria-label="SkillRise logo">
      <g>
        <g transform="translate(5, 14)">
          <rect width="32" height="32" fill="#09090b" rx="4" />
          <rect x="5" y="19" width="6" height="6" rx="1" fill="#2dd4bf" />
          <rect x="13" y="13" width="6" height="12" rx="1" fill="#2dd4bf" opacity="0.85" />
          <rect x="21" y="7" width="6" height="18" rx="1" fill="#2dd4bf" opacity="0.7" />
          <defs>
            <linearGradient id="logo-shine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:white;stop-opacity:0.1" />
              <stop offset="100%" style="stop-color:white;stop-opacity:0" />
            </linearGradient>
          </defs>
          <rect width="32" height="32" fill="url(#logo-shine)" rx="4" />
        </g>
        <g transform="translate(47, 0)">
          <text x="0" y="36" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700" fill="#000000">
            Skill<tspan fill="#2dd4bf">Rise</tspan>
          </text>
        </g>
      </g>
    </svg>
  `

  const verifyTarget =
    verificationUrl || `https://skillrise.app/verify/${encodeURIComponent(certificateId)}`
  const qrSrc = qrDataUrl

  return `
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          @page {
            size: A4 landscape;
            margin: 0;
          }

          html,
          body {
            width: 297mm;
            height: 210mm;
            margin: 0;
            padding: 0;
            background: #f5f7fb;
            color: #0f172a;
            font-family: Arial, Helvetica, sans-serif;
          }

          .sheet {
            width: 297mm;
            height: 210mm;
            padding: 10mm;
            box-sizing: border-box;
          }

          .certificate {
            position: relative;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 6px solid #0f766e;
            background: #ffffff;
            overflow: hidden;
          }

          .inner {
            position: relative;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 2px solid #9ce7dc;
            padding: 12mm 14mm;
            display: flex;
            flex-direction: column;
            background:
              radial-gradient(circle at 12% 18%, rgba(45, 212, 191, 0.06), transparent 180px),
              radial-gradient(circle at 88% 82%, rgba(20, 184, 166, 0.06), transparent 180px),
              linear-gradient(to bottom, #ffffff, #f9fffd);
          }

          .corner {
            position: absolute;
            width: 58px;
            height: 58px;
          }
          .corner.tl { left: 8px; top: 8px; border-left: 4px solid #2dd4bf; border-top: 4px solid #2dd4bf; }
          .corner.tr { right: 8px; top: 8px; border-right: 4px solid #2dd4bf; border-top: 4px solid #2dd4bf; }
          .corner.bl { left: 8px; bottom: 8px; border-left: 4px solid #2dd4bf; border-bottom: 4px solid #2dd4bf; }
          .corner.br { right: 8px; bottom: 8px; border-right: 4px solid #2dd4bf; border-bottom: 4px solid #2dd4bf; }

          .header {
            text-align: center;
          }

          .logo {
            display: flex;
            justify-content: center;
            margin-bottom: 3mm;
            transform: translateX(34px);
          }

          .title-rule {
            width: 70mm;
            height: 2px;
            margin: 0 auto 2.5mm;
            background: linear-gradient(90deg, transparent, #14b8a6, transparent);
          }

          .subtitle {
            margin: 0;
            font-size: 14px;
            letter-spacing: 0.35em;
            color: #334e68;
            text-transform: uppercase;
          }

          .center {
            text-align: center;
            margin: 3.5mm 0 0;
          }

          .kicker {
            margin: 0 0 2.5mm;
            font-size: 15px;
            font-style: italic;
            color: #3f5673;
          }

          .student {
            margin: 0 auto 2.5mm;
            max-width: 92%;
            display: inline-block;
            font-family: Georgia, "Times New Roman", serif;
            font-size: 56px;
            line-height: 1.05;
            color: #0f766e;
            border-bottom: 3px solid #2dd4bf;
            padding: 0 18px 8px;
            word-break: break-word;
          }

          .course {
            margin: 0 auto 2mm;
            max-width: 92%;
            display: inline-block;
            font-family: Georgia, "Times New Roman", serif;
            font-size: 40px;
            line-height: 1.1;
            color: #0f766e;
            border-bottom: 3px solid #5eead4;
            padding: 0 18px 8px;
            word-break: break-word;
          }

          .note {
            margin: 2.5mm auto 0;
            max-width: 200mm;
            font-size: 15px;
            line-height: 1.45;
            color: #3f5673;
          }

          .verify-panel {
            margin: 5mm auto 0;
            width: 100%;
            max-width: 240mm;
            border: 1px dashed #9ddfd5;
            border-radius: 8px;
            padding: 3.5mm 4.5mm;
            box-sizing: border-box;
            display: grid;
            grid-template-columns: 1fr auto;
            align-items: center;
            gap: 5mm;
            background: rgba(243, 253, 250, 0.72);
          }

          .verify-title {
            margin: 0 0 0.8mm;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.16em;
            color: #0f766e;
            font-weight: 700;
          }

          .verify-text {
            margin: 0;
            font-size: 12px;
            line-height: 1.45;
            color: #3f5673;
          }

          .verify-url {
            margin: 1.5mm 0 0;
            font-size: 10px;
            color: #0f766e;
            font-family: "Courier New", Courier, monospace;
            word-break: break-all;
          }

          .qr-wrap {
            text-align: center;
          }

          .qr {
            width: 25mm;
            height: 25mm;
            border: 1px solid #c9ece6;
            border-radius: 4px;
            background: #fff;
            padding: 1.2mm;
            box-sizing: border-box;
          }

          .qr-caption {
            margin: 1.2mm 0 0;
            font-size: 9px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: #64748b;
          }

          .footer {
            position: relative;
            margin-top: 3mm;
            padding-top: 5mm;
            border-top: 1px solid #9ce7dc;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            align-items: end;
            column-gap: 8mm;
          }

          .foot-title {
            margin: 0 0 1.5mm;
            font-size: 11px;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: #64748b;
          }

          .foot-value {
            margin: 0;
            font-size: 18px;
            font-weight: 700;
            color: #0f766e;
            font-family: "Courier New", Courier, monospace;
            word-break: break-all;
          }

          .sign {
            text-align: center;
          }

          .sign-seal {
            width: 42px;
            height: 42px;
            border-radius: 999px;
            border: 2px solid #ffffff;
            background: linear-gradient(135deg, #14b8a6, #0f766e);
            color: #ffffff;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 18px rgba(15, 118, 110, 0.34);
            margin: 0 auto 2.2mm;
          }

          .sign-line {
            width: 56mm;
            border-top: 2px solid #334155;
            margin: 0 auto 2mm;
          }

          .stars {
            position: absolute;
            inset: 0;
            pointer-events: none;
            opacity: 0.08;
            color: #0f766e;
            font-size: 32px;
          }

          .stars span {
            position: absolute;
          }
        </style>
      </head>
      <body>
        <div class="sheet">
          <div class="certificate">
            <div class="corner tl"></div>
            <div class="corner tr"></div>
            <div class="corner bl"></div>
            <div class="corner br"></div>

            <div class="inner">
              <div>
                <div class="header">
                  <div class="logo">${logoSvg}</div>
                  <div class="title-rule"></div>
                  <p class="subtitle">Certificate of Completion</p>
                </div>

                <div class="center">
                  <p class="kicker">This certifies that</p>
                  <div class="student">${safe(studentName)}</div>
                  <p class="kicker">has successfully completed the course</p>
                  <div class="course">${safe(courseTitle)}</div>
                  <p class="note">
                    Awarded in recognition of outstanding achievement and commitment to excellence.
                  </p>
                </div>

                <div class="verify-panel">
                  <div>
                    <p class="verify-title">Certificate Authenticity</p>
                    <p class="verify-text">
                      Scan QR to verify this certificate. If QR is unavailable, use this URL:
                    </p>
                    <p class="verify-url">${safe(verifyTarget)}</p>
                  </div>
                  <div class="qr-wrap">
                    <img class="qr" src="${qrSrc}" alt="Certificate verification QR" />
                    <p class="qr-caption">Scan to verify</p>
                  </div>
                </div>
              </div>

              <div class="footer">
                <div>
                  <p class="foot-title">Certificate ID</p>
                  <p class="foot-value">${safe(certificateId)}</p>
                </div>

                <div class="sign">
                  <div class="sign-seal">★</div>
                  <div class="sign-line"></div>
                  <p class="foot-title">Authorized Signature</p>
                </div>

                <div style="text-align:right;">
                  <p class="foot-title">Date of Completion</p>
                  <p class="foot-value">${safe(issuedAt)}</p>
                </div>
              </div>
            </div>

            <div class="stars">
              <span style="top: 22px; left: 24px;">✦</span>
              <span style="top: 38px; right: 40px;">✦</span>
              <span style="bottom: 58px; left: 50px;">✦</span>
              <span style="bottom: 32px; right: 26px;">✦</span>
            </div>
          </div>
        </div>
      </body>
    </html>
  `
}
