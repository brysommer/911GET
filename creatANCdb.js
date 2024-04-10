import axios from 'axios';
import {createNewAncName} from './models/ancNomenclatura.js';

const getXMLPrice = async(city, products) => {
  try {
    const response = await axios.get(`https://anc.ua/productbrowser/v2/ua/products?city=${city}&products=${products}`);
    return response.data;
  } catch (error) {
    console.error('Помилка при отриманні XML: ', error);
    throw error;
  }
}


const generateNumbers = async () => {
  try {
    let numbers = [];
    for (let i = 6; i <= 60000; i++) {  //52000
      numbers.push(i);
      if (numbers.length >= 11) {
        console.log(numbers.join(","));
        const xml = await getXMLPrice(28, numbers.join(","));

        xml.forEach((item) => {
        createNewAncName({
            drug_name: item.name,
            drug_id: item.id
          })
        });

        numbers = [];
      }
    }
  
  } catch (error) {
    console.error('Помилка: ', error);
  }
}

generateNumbers();

