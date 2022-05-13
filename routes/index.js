const express = require('express');
const PDFDocument = require("pdfkit-table");
const SVGtoPDF = require('svg-to-pdfkit')
const pdfService = require('../service/pdf-service');

const fs = require('fs')

const generateUserTable = (procentW) => {  
  return {
    headers: [
      { label: "Name", property: 'name', headerColor: '#fff', width: procentW * 36.575},
      { label: "Role", property: 'role', headerColor: '#fff', width: procentW * 36.575},
      { label: "Total Hours", property: 'hours', headerColor: '#fff', width: procentW * 10, align: 'right'}
    ],
    datas: [
      {
        name: 'Misha Sokil',
        role: 'Front end dev',
        hours: '30.0'
      }
    ],
  }
}

const generateSessionTable = (procentW) => {
  return {
    headers: [
      { label: "Title", property: 'title', headerColor: '#fff', width: procentW * 28.075},
      { label: "Desc", property: 'desc', headerColor: '#fff', width: procentW * 28.075},
      { label: "Start Time", property: 'start_time', headerColor: '#fff', align: 'center', width: procentW * 9},
      { label: "End Time", property: 'end_time', headerColor: '#fff', align: 'center', width: procentW * 9},
      { label: "Total Hours", property: 'total_hours', headerColor: '#fff', align: 'right', width: procentW * 9}
    ],
    datas: [
      {
        title: 'Test title dsad sadasdsad sadsadad adsa',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc pellentesque erat neque, ac bibendum sem mollis et.',
        start_time: '10:20',
        end_time: '14:20',
        total_hours: '4'
      },
      {
        title: 'Test title dsad sadasdsad sadsadad adsa',
        desc: '',
        start_time: '10:20',
        end_time: '14:20',
        total_hours: '4'
      }
    ],
  }
}

const router = express.Router();
router.get('/', (req, res, next) => {
  const doc = new PDFDocument({ bufferPages: true, size: 'A4', margin: 50 });

  const procentW = doc.page.width / 100

  //icon bg
  doc.lineJoin('round').rect(61, 79, 22, 22).lineWidth(22).stroke('#2C3C48')

  //project info
  doc.fontSize(10)
  doc.font('Helvetica-Bold').text('Project title', 108, 70)
  doc.moveDown(0.2);
  doc.font('Helvetica').text('Client info')
  doc.moveDown(0.2);
  doc.text('Contact info')

  //dates
  doc.fontSize(10)
  doc.font('Helvetica-Bold').text('Generated date', 108, 84, {width: doc.page.width - 108 - 50, align: 'right'})
  doc.moveDown(0.2);
  doc.font('Helvetica').text('May 5, 2022', {width: doc.page.width - 108 - 50, align: 'right'})

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
  doc.table(generateUserTable(procentW), {
    columnSpacing: 10,
    divider: {
      header: { disabled: false, width: 0.4, opacity: 1 },
      horizontal: { disabled: false, width: 0.4, opacity: 1 }
    }
  }); 

  //sessions Title
  doc.fontSize(12)
  doc.fill('#000').stroke()
  doc.font('Helvetica-Bold').text('Sesion info', 50, doc.y + 10)

  doc.rect(50, doc.y + 10, doc.page.width - 100, 0.4).fill('#2C3C48')

  //session table
  doc.moveDown(1.5)
  doc.table(generateSessionTable(procentW), {
    columnSpacing: 10,
    // divider: {
    //   header: { disabled: false, width: 0.4, opacity: 1 },
    //   horizontal: { disabled: false, width: 0.4, opacity: 1 }
    // }
  }); 
  
  doc.pipe(res)
  doc.end()
});

module.exports = router;