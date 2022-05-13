const PDFDocument = require("pdfkit-table");
const axios = require('axios')
const SVGtoPDF = require('svg-to-pdfkit')

const fs = require('fs')

const img = fs.readFileSync("./logo.svg").toString()

const bgTitleHeigth = 120

async function fetchImage(src) {
  const image = await axios
      .get(src, {
          responseType: 'arraybuffer'
      })
  return image.data;
}

async function buildPDF(dataCallback, endCallback) {
  const doc = new PDFDocument({ bufferPages: true, size: 'A4', margin: 50 });

  const procentW = doc.page.width / 100

  const table = {
    headers: [
      {label: 'Bill To', property: 'first', headerColor: '#fff'},
      {label: 'Invoice Details', property: 'second', headerColor: '#fff'},
      {label: 'Payment', property: 'third', headerColor: '#fff'}
    ],
    // datas: [
    //   {
    //     options: { fontSize: 10 },
    //     first: 'Misha Sokil\nm.sokil.dev@gmail.com\n+380958553178',
    //     second: 'PDF created May 12, 2022\n$300',
    //     third: 'Due June 30 2022\n$30.00'
    //   }
    // ],
    rows: [
      ['Misha Sokil', 'PDF created May 12, 2022', 'Due June 30 2022'],
      ['m.sokil.dev@gmail.com', '$300', '$30.00'],
      ['+380958553178']
    ]
  };

  doc.on('data', dataCallback); 
  doc.on('end', endCallback);

  doc.lineJoin('round').rect(61, 79, 22, 22).lineWidth(22).stroke('#2C3C48')

  // doc.rect(50, 40, procentW * 26, 2).fill('#D5D9DC')
  // doc.rect(procentW*26 + 58, 40, procentW * 26, 2).fill('#D5D9DC')
  // doc.rect((procentW *26 )*2 + 66, 40, procentW * 26, 2).fill('#D5D9DC')

  // doc.table(table, {
  //   y: 0,
  //   x: 0,
  //   divider: {
  //     header: {disabled: true},
  //     horizontal: {disabled: true}
  //   },
  //   w: doc.page.width,
  // })

  doc.end();
}

module.exports = { buildPDF };
