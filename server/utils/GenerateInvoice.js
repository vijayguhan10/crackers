const puppeteer = require('puppeteer');

const generatePDF = async (pdfParams) => {
  try {
    const company = pdfParams.companyDetails;
    const customer = pdfParams.customerDetails;
    const order = pdfParams.orderDetails;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(generateHTML(company, customer, order), {
      waitUntil: 'networkidle0'
    });

    await page.pdf({
      path: `invoice.pdf`,
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
    });

    console.log('PDF generated successfully!');
    await browser.close();
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

const generateHTML = (company, customer, order) => {
  let s_no = 1;
  const itemsHTML = order.cartitems
    .map((item) => {
      return `
      <tr>
        <td style="padding: 10px; border: 1px solid #ccc;">${s_no++}</td>
        <td style="padding: 10px; border: 1px solid #ccc;">${item.quantity}</td>
        <td style="padding: 10px; border: 1px solid #ccc;">${item.name}</td>
        <td style="padding: 10px; border: 1px solid #ccc;">${
          item.unitprice
        }</td>
        <td style="padding: 10px; border: 1px solid #ccc;">${item.total}</td>
      </tr>
      `;
    })
    .join('');

  const totalsHTML =
    order.gst && order.gst.status
      ? `
          <p style="margin: 5px 0;"><strong>Total (Before GST):</strong> RS.${
            order.total
          }</p>

          <p style="margin: 5px 0;"><strong>Discount (${
            order.discount
          }%):</strong> RS.${
          Math.round(((order.discount * order.total) / 100) * 100) / 100
        }</p>

          <p style="margin: 5px 0;"><strong>GST (${
            order.gst.percentage
          }%):</strong> RS.${order.gst.amount}</p>
          <p style="margin: 5px 0; font-size: 18px;"><strong>Grand Total:</strong> RS.${
            order.grandtotal
          }</p>
        `
      : `
          <p style="margin: 5px 0;"><strong>Estimated Total:</strong> RS.${
            order.total
          }</p>
          <p style="margin: 5px 0;"><strong>Discount (${
            order.discount
          }%):</strong> RS.${
          Math.round(((order.discount * order.total) / 100) * 100) / 100
        }</p>
          <p style="margin: 5px 0; font-size: 18px;"><strong>Estimated Grand Total:</strong> RS.${
            order.grandtotal
          }</p>
        `;

  const EstimatedTotal =
    !order.gst || !order.gst.status
      ? `<div style="margin-top: 20px; font-size: 20px; font-weight: bold; text-align: center; background-color: #f8f8f8; padding: 10px; border-radius: 8px;">Estimated Total: RS.${order.grandtotal}</div>`
      : null;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice</title>
      <link
      href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&family=DM+Serif+Text:ital@0;1&family=Host+Grotesk:ital,wght@0,300..800;1,300..800&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Pacifico&family=Red+Hat+Display:ital,wght@0,300..900;1,300..900&family=Vibur&display=swap"
      rel="stylesheet"
    />
    <style>
      body {
        font-family: 'Comfortaa', sans-serif;
        color: #333;
        margin: 0;
        padding: 20px;
        line-height: 1.6;
      }
      h2 {
        font-family: 'Comfortaa', sans-serif;
        font-size: 20px;
      }
      .total-estimate {
        background-color: #f8f8f8;
        border-radius: 8px;
        padding: 10px;
        font-size: 20px;
        font-weight: bold;
        text-align: center;
      }
      /* Styling for customer details section */
      .customer-info td {
        padding: 8px;
        vertical-align: top;
      }
      .customer-info td:nth-child(1),
      .customer-info td:nth-child(3) {
        font-weight: bold;
      }
      .customer-info td:nth-child(2),
      .customer-info td:nth-child(4) {
        word-wrap: break-word;
        padding-left: 10px;
      }
    </style>
    </head>
    <body>

      <!-- Header Section -->
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; background-color: #000; color: #fff;">
        <div>
          <h1 style="margin: 0; font-size: 24px;">${company.companyname}</h1>
          <p style="margin: 0; font-size: 14px;">${company.companytagline}</p>
        </div>
        <div style="text-align: right;">
          <h3 style="margin: 0;">Invoice</h3>
          <p style="margin: 0; font-size: 14px;">
            ${new Date(order.createdat).toLocaleDateString('en-US')}
          </p>
        </div>
      </div>

      <!-- Customer Information Section -->
      <div style="margin-top: 20px; border-bottom: 2px solid #000; padding-bottom: 10px;">
        <table class="customer-info" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="width: 20%;">TO</td>
            <td style="width: 30%;">${customer.name}</td>
            <td style="width: 20%;">CUSTOMER ID</td>
            <td style="width: 30%;">${customer._id}</td>
          </tr>
          <tr>
            <td>ADDRESS</td>
            <td>${customer.address}</td>
            <td>PHONE</td>
            <td>${customer.phone}</td>
          </tr>
        </table>
      </div>

      ${EstimatedTotal}

      <!-- Invoice Items Section -->
      <div style="margin-top: 20px;">
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="background-color: #f0f0f0;">
              <th style="padding: 10px; border: 1px solid #ccc; font-weight: bold;">S.NO</th>
              <th style="padding: 10px; border: 1px solid #ccc; font-weight: bold;">QTY</th>
              <th style="padding: 10px; border: 1px solid #ccc; font-weight: bold;">DESCRIPTION</th>
              <th style="padding: 10px; border: 1px solid #ccc; font-weight: bold;">UNIT PRICE</th>
              <th style="padding: 10px; border: 1px solid #ccc; font-weight: bold;">LINE TOTAL</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>
      </div>

      <!-- Totals Section -->
      <div style="margin-top: 20px; text-align: right;">
        ${totalsHTML}
      </div>

      <!-- Footer Section -->
      <div style="margin-top: 30px; display: flex; justify-content: space-between; align-items: center; padding: 10px; background-color: #000; color: #fff;">
        <div>
          <p style="margin: 0;">${company.personcontact}</p>
          <p style="margin: 0;">${company.email}</p>
          <p style="margin: 0;">${company.shopaddress}</p>
        </div>
        <div>
          <h2 style="margin: 0;">THANK YOU</h2>
        </div>
      </div>

    </body>
    </html>
  `;
};

module.exports = { generatePDF };
