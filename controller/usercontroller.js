import dotenv from "dotenv";
dotenv.config();
import APP_STATUS from '../constants/constants.js';
import UserModel from "../model/User.js";
import PDFDocument from 'pdfkit';
import fs from 'fs';
import xlsx from 'xlsx'
import ExcelJS from "exceljs"


export const importUser = async (req, resp) => {
  try {
    let userData = []
    if (!req.file) {
      return resp.status(400).send({ status: 400, msg: "Upload file required" });
    }
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];

    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    for (let x = 0; x < sheetData.length; x++) {
      userData.push({
        first_name: sheetData[x].first_name,
        last_name: sheetData[x].last_name,
        email: sheetData[x].email,
        gender: sheetData[x].gender,
      });
    }
    await UserModel.insertMany(userData);
    resp.send({ status: 200, Success: "SUCCESS", msg: "Excel data imported" });

  } catch (error) {
    resp.send({ status: 500, msg: "Internal Server Error", Error: error })
  }
}

export const GenerateExcel = async (req, resp) => {
  try {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("User")

    worksheet.columns = [
      { header: "FirstName", key: "first_name", width: 10 },
      { header: "LastName", key: "last_name", width: 30 },
      { header: "Email", key: "email", width: 30 },
      { header: "Gender", key: "gender", width: 30 },
    ]

    const userData = await UserModel.find({})
    userData.forEach((user) => {
      worksheet.addRow(user)
    })

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true }
    })

    resp.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    resp.setHeader(
      "Content-Disposition",
      "attachment; filename=users.xlsx"
    );

    return workbook.xlsx.write(resp).then(() => {
      resp.status(200)
      resp.end()
    })
  } catch (error) {
    console.log(error);
  }
}

export const DataMongoDb = async (req, resp) => {
  try {
    const data = await UserModel.find({});

    resp.render('index', { data });
  } catch (error) {
    console.error('Error fetching data:', error);
    resp.status(500).send('Error fetching data');
  }
};
export const GeneratePdf = async(req , resp)=>{
    try {
        const users = await UserModel.find({});
        const doc = new PDFDocument();

        resp.setHeader('Content-Type', 'application/pdf');
        resp.setHeader('Content-Disposition', 'attachment; filename=users.pdf');
    
        doc.pipe(resp);
    
        doc.fontSize(16).text('User Data', { align: 'center' });
    
        users.forEach(user => {
          doc.text(`id: ${user._id}`);
          doc.text(`First_Name: ${user.first_name}`);
          doc.text(`Last_Name: ${user.last_name}`);
          doc.text(`Email: ${user.email}`);
          doc.text(`Gender: ${user.gender}`);
          doc.moveDown();
        });
        doc.end();
      } catch (error) {
        console.error('Error exporting user data to PDF:', error);
        resp.status(500).json({
          status: 'failed',
          data: null,
          error: error.message,
        });
      }
}