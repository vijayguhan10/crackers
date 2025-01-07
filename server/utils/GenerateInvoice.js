const puppeteer = require('puppeteer');

const generatePDF = async (pdfParams) => {
  const company = pdfParams.companyDetails;
  const customer = pdfParams.customerDetails;
  const order = pdfParams.orderDetails;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  let s_no = 1;
  const itemsHTML = order.cartItems
    .map((item) => {
      let additionalProductsHTML = '';
      let itemtotal = item.total;

      if (item.additionalproducts && item.additionalproducts.length > 0) {
        additionalProductsHTML = item.additionalproducts
          .map((additional) => {
            itemtotal -= additional.total;
            s_no += 1;
            return `
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 10px; border: 1px solid #ccc;">${s_no}</td>
            <td style="padding: 10px; border: 1px solid #ccc;">${additional.quantity}</td>
            <td style="padding: 10px; border: 1px solid #ccc;">${additional.description} (Additional)</td>
            <td style="padding: 10px; border: 1px solid #ccc;">${additional.unitprice}</td>
            <td style="padding: 10px; border: 1px solid #ccc;">${additional.total}</td>
          </tr>
        `;
          })
          .join('');
      }
      s_no += 1;
      return `
      <tr>
        <td style="padding: 10px; border: 1px solid #ccc;">${
          s_no - item.additionalproducts.length - 1
        }</td>
        <td style="padding: 10px; border: 1px solid #ccc;">${item.quantity}</td>
        <td style="padding: 10px; border: 1px solid #ccc;">${
          item.description
        }</td>
        <td style="padding: 10px; border: 1px solid #ccc;">${
          item.unitprice
        }</td>
        <td style="padding: 10px; border: 1px solid #ccc;">${itemtotal}</td>
      </tr>
      ${additionalProductsHTML}
    `;
    })
    .join('');

  await page.setContent(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice</title>
    </head>
    <body style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 20px; line-height: 1.6;">

      <!-- Header Section -->
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; background-color: #000; color: #fff;">
        <div>
          <h1 style="margin: 0; font-size: 24px;">${company.companyname}</h1>
          <p style="margin: 0; font-size: 14px;">${company.companytagline}</p>
        </div>
        <div style="text-align: right;">
          <h3 style="margin: 0;">Invoice</h3>
          <p style="margin: 0; font-size: 14px;">${new Date(
            order.createdat
          ).toLocaleDateString()}</p>
        </div>
      </div>

      <!-- Customer Information Section -->
      <div style="margin-top: 20px; border-bottom: 2px solid #000; padding-bottom: 10px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="width: 20%; font-weight: bold;">TO</td>
            <td style="width: 30%;">${customer.name}</td>
            <td style="width: 20%; font-weight: bold;">CUSTOMER ID</td>
            <td style="width: 30%;">${customer._id}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">ADDRESS</td>
            <td>${customer.address}</td>
            <td style="font-weight: bold;">PHONE</td>
            <td>${customer.phone}</td>
          </tr>
        </table>
      </div>

      <!-- Job Details Section -->
      <div style="margin-top: 20px; border-bottom: 2px solid #000; padding-bottom: 10px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="width: 20%; font-weight: bold;">SALESPERSON</td>
            <td style="width: 30%;">${company.salesperson}</td>
            <td style="width: 20%; font-weight: bold;">JOB</td>
            <td style="width: 30%;">${company.jobdescription}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">PAYMENT TERMS</td>
            <td>${company.paymentterms}</td>
            <td style="font-weight: bold;">DUE DATE</td>
            <td>${new Date(order.createdat).toLocaleDateString()}</td>
          </tr>
        </table>
      </div>

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
        <p style="margin: 5px 0;"><strong>SUBTOTAL:</strong> RS.${
          order.overallsum
        }</p>
        <p style="margin: 5px 0;"><strong>SALES TAX:</strong> RS.${
          order.tax
        }</p>
        <p style="margin: 5px 0;"><strong>DISCOUNT:</strong> RS.${
          order.discount
        }</p>
        <p style="margin: 5px 0; font-size: 18px;"><strong>TOTAL:</strong> RS.${
          order.total
        }</p>
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
  `);

  await page.pdf({
    path: `invoice.pdf`,
    format: 'A4',
    printBackground: true,
    margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
  });

  console.log('PDF generated successfully!');

  await browser.close();
};

module.exports = { generatePDF };
