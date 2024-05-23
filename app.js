import XLSX from 'xlsx';
import { sequelize } from './models/sequelize.js';
import { findALLDrugs } from './models/drugs911.js';
import { run911 } from './data911.js';
import { logger } from './logger/index.js';
import fs from 'fs';

const sharedFolderPath = '../price/SynologyDrive/';
let old911;

const main = async () => {
  const models = {
      list:  [
          'drugs911s'
      ]
  };
  // DB
  const configTables = models.list;
  const dbInterface = sequelize.getQueryInterface();
  try {
    const checks = await Promise.all(configTables.map(configTable => {
        return dbInterface.tableExists(configTable);
    }));
    const result = checks.every(el => el === true);
    if (!result) {
        // eslint-disable-next-line no-console
        console.error(`🚩 Failed to check DB tables`);
        throw (`Some DB tables are missing`);
    }
  } catch (error) {
    console.error(`🚩 egfrsgs ${error}` );

  }
  

}; 

main();

const writeArrayToXLSX = (arrayData, xlsxFilePath) => {

  const worksheet = XLSX.utils.aoa_to_sheet(arrayData);
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  XLSX.writeFile(workbook, sharedFolderPath + xlsxFilePath);

  logger.info(`Записано ${arrayData.length} элементів в price911`);
  
  console.log("Масив записано в XLSX");
}
async function run() {
  
  try {
    await run911();
    let csvData = [[
      'id',
      'drug_id',
      'drug_name',
      'drug_producer',
      'pharmacy_name',
      'price',
      'availability_status',
      'updated_at',
    ]];    
    let dataArray = await findALLDrugs();
    for (const el of dataArray) {
      csvData.push([
        el.id,
        el.drug_id,
        el.drug_name,
        el.drug_producer,
        el.pharmacy_name,
        el.price,
        el.availability_status,
        el.updatedAt
      ])
    }

    if(old911) {
      try {
        fs.unlink(sharedFolderPath + old911);
      } catch (e) {
        logger.error(911 + e);
      }
    } 

    const date = new Date();
    const filename = date.toISOString().replace(/T/g, "_").replace(/:/g, "-");
    writeArrayToXLSX(csvData, `price911${filename}.xlsx`);

    old911 = `price911${filename}.xlsx`;

    await new Promise(resolve => setTimeout(resolve, 10000));
    dataArray = []
  } catch (error) {
    console.error('Помилка 911: ', error);
  }
  run();
};

run();