const express = require('express');
const PDFDocument = require("pdfkit-table");
const SVGtoPDF = require('svg-to-pdfkit')

const fs = require('fs')

const img = fs.readFileSync("./logo.svg").toString()

const reqData = {
  projectTitle: 'Test project',
  client: {
    name: 'Misha Sokil',
    email: 'm.sokil.dev@gmail.com'
  },
  date: 'May 5, 2022',
  usersTable: [
    {
      name: 'Misha Sokil',
      role: '',
      hours: '10'
    }, {
      name: 'Eli Bates',
      role: 'Front end',
      hours: '1'
    }
  ],
  sessions: [
    ['Wed, May 04, 2022', [{
      title: 'from unlisted to project',
      desc: 'LOrems dadsa dsad adsadka dia sndsaid nasud adsa da',
      start_time: '19:00',
      end_time: '22:00',
      total_time: '3.0',
      user: 'Misha Sokil'
    }]],
    ['Wed, May 05, 2022', [{
      title: 'Latest',
      start_time: '19:00',
      end_time: '22:00',
      total_time: '3.0',
      user: 'Misha Sokil'
    }]],
    ['Wed, May 05, 2022', [{
      title: 'Latest',
      start_time: '19:00',
      end_time: '22:00',
      total_time: '3.0',
      user: 'Misha Sokil'
    }]],
    ['Wed, May 05, 2022', [{
      title: 'Latest',
      start_time: '19:00',
      end_time: '22:00',
      total_time: '3.0',
      user: 'Misha Sokil'
    }]],
    ['Wed, May 05, 2022', [{
      title: 'Latest',
      start_time: '19:00',
      end_time: '22:00',
      total_time: '3.0',
      user: 'Misha Sokil'
    }]],
    ['Wed, May 05, 2022', [{
      title: 'Latest',
      start_time: '19:00',
      end_time: '22:00',
      total_time: '3.0',
      user: 'Misha Sokil'
    }]]
  ]
}

const generateUserTable = (procentW, data) => {  
  return {
    headers: [
      { label: "Name", property: 'name', headerColor: '#fff', width: procentW * 36.575},
      { label: "Role", property: 'role', headerColor: '#fff', width: procentW * 36.575},
      { label: "Total Hours", property: 'hours', headerColor: '#fff', width: procentW * 10, align: 'right'}
    ],
    datas: [...data],
  }
}

const generateSessionTable = (procentW, data) => {
  return {
    headers: [
      { label: "User name", property: 'user', headerColor: '#fff', width: procentW * 15},
      { label: "Title / Desc", property: 'title', headerColor: '#fff', width: procentW * 38},
      { label: "Start Time", property: 'start_time', headerColor: '#fff', align: 'center', width: procentW * 9},
      { label: "End Time", property: 'end_time', headerColor: '#fff', align: 'center', width: procentW * 9},
      { label: "Total Hours", property: 'total_time', headerColor: '#fff', align: 'right', width: procentW * 9}
    ],
    datas: data.map(el => ({...el, title: `${el.title}${el.desc ? '\n\n' + el.desc : ''}`})),
  }
}

const generateTableWithTitle = (doc, data, procentW) => {
  //title
  doc.fontSize(12)
  doc.fill('#000').stroke()
  doc.font('Helvetica-Bold').text('Sesion info', 50, doc.y + 10)
  doc.moveDown(0.6)

  for (let [date, sessions] of data) {    
    //move to new page
    if (doc.y > 700)
      doc.addPage();
    //date
    doc.fontSize(9)
    doc.font('Helvetica').text(date, 50)
    doc.moveDown(2)

    //separator
    doc.rect(60, doc.y - 13, doc.page.width - 120, 0.4).fill('#2C3C48')

    //table
    doc.table(generateSessionTable(procentW, sessions), {
      x: 60,
      columnSpacing: 10,
      divider: {
        header: { disabled: false, width: 0.4, opacity: 1 },
        horizontal: { disabled: false, width: 0.4, opacity: 1 }
      },
    })
    doc.moveDown(0.5)
  }
}

const router = express.Router();
router.get('/', (req, res, next) => {
  const doc = new PDFDocument({ bufferPages: true, size: 'A4', margin: 50});

  const procentW = doc.page.width / 100

  //icon bg
  doc.lineJoin('round').rect(61, 79, 22, 22).lineWidth(22).stroke('#2C3C48')
  SVGtoPDF(doc, img, 50 + (35/2/2), 68 + (35/2/2))

  //project info
  doc.fontSize(10)
  doc.font('Helvetica-Bold').text(reqData.projectTitle, 108, 70)
  doc.moveDown(0.2);
  doc.font('Helvetica').text(reqData.client.name)
  doc.moveDown(0.2);
  doc.text(reqData.client.email)

  //dates
  doc.fontSize(10)
  doc.font('Helvetica-Bold').text('Generated date', 108, 84, {width: doc.page.width - 108 - 50, align: 'right'})
  doc.moveDown(0.2);
  doc.font('Helvetica').text(reqData.date, {width: doc.page.width - 108 - 50, align: 'right'})

  //separator
  doc.rect(50, 133, doc.page.width - 100, 3).fill('#818A91')

  //title
  doc.fontSize(20)
  doc.fill('#000').stroke()
  doc.font('Helvetica-Bold').text('Work report', 50, 160)

  //table title
  doc.fontSize(12)
  doc.fill('#000').stroke()
  doc.text('Team info', 50, 200)
  doc.moveDown(1.5)

  doc.rect(50, 223, doc.page.width - 100, 0.4).fill('#2C3C48')

  //users table
  doc.table(generateUserTable(procentW, reqData.usersTable), {
    columnSpacing: 10,
    divider: {
      header: { disabled: false, width: 0.4, opacity: 1 },
      horizontal: { disabled: false, width: 0.4, opacity: 1 }
    }
  }); 

  generateTableWithTitle(doc, reqData.sessions, procentW)

  const range = doc.bufferedPageRange(); // => { start: 0, count: 2 }

  for (i = range.start, end = range.start + range.count, range.start <= end; i < end; i++) {
    doc.switchToPage(i);
    doc.text(`Page ${i + 1} of ${range.count}`, 50, doc.page.height - 60, {align: 'right', width: doc.page.width - 100});
  }

  doc.pipe(res)
  doc.end()
});

module.exports = router;
