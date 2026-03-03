export const generateCertificateHtml = ({ studentName, courseTitle, certificateId, issuedAt }) => {
  return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 50px;
          }
          .container {
            border: 8px solid #2c3e50;
            padding: 40px;
          }
          h1 {
            font-size: 40px;
          }
          .name {
            font-size: 32px;
            font-weight: bold;
            margin: 20px 0;
          }
          .details {
            margin-top: 30px;
            font-size: 16px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Certificate of Completion</h1>
          <p>This is to certify that</p>
          <div class="name">${studentName}</div>
          <p>has successfully completed the course</p>
          <div class="name">${courseTitle}</div>
          <div class="details">
            Certificate ID: ${certificateId} <br/>
            Issued On: ${issuedAt}
          </div>
        </div>
      </body>
    </html>
  `
}
