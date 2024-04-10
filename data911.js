import axios from 'axios';
import {  createNewDrug, updateDrugById,
  findDrugById } from './models/drugs911.js';
import { logger } from './logger/index.js';
import links from './linksDb.js';
import { JSDOM } from 'jsdom';


function processProductElements(htmlString) {
  const dom = new JSDOM(htmlString);
  const document = dom.window.document;

  const scriptElements = document.querySelectorAll('script[type="application/ld+json"]');
  
  for (const scriptElement of scriptElements) {
      const scriptText = scriptElement.textContent.trim();
      
      const jsonData = JSON.parse(scriptText);
      
      if (jsonData['@type'] === 'Product') {
          return {
              name: jsonData?.name,
              id: jsonData?.sku,
              producer: jsonData?.category?.manufacturer,
              price: jsonData?.offers?.price,
              pharmacy_name: jsonData?.offers?.seller?.name
          };
      }
  }
  return null;
}





const getProductData = async(productLink) => {
  try {
    const response = await axios.get(productLink);
    const result = processProductElements(response.data);
    console.log(result)
    return result;
  } catch (error) {
    console.error('Помилка при отриманні данних за посиланням:', productLink, error);
    throw error;
  }
}

export const run911 = async () => {

    for (let i = 0; i < links.length; i++) {
      const productLink = links[i];  
      if (i % 1000 === 0) {
        logger.info(`911 обробляє елемент ${i}`); 
      }
        try {
          const data = await getProductData(productLink);
            if (!data.price) return;
            const isCreated = await findDrugById(data.id);
            if (isCreated) {
              await updateDrugById(data.id, data.price)
            } else {
              await createNewDrug({
                drug_id: data.id,
                drug_name: data.name,
                drug_producer: data.producer,
                pharmacy_name: data.pharmacy_name,
                price: data.price,
                availability_status: 'Забронювати',   
              })
            }
  
        } catch (error) {
          logger.error(`911 error: ${error}`)
        }
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
}



