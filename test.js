import axios from 'axios';
import { JSDOM } from 'jsdom';
import parseJsonSafely from './plugins/fixjson.js'

function processProductElements(htmlString, productLink) {
    const dom = new JSDOM(htmlString);
    const document = dom.window.document;
  
    const scriptElements = document.querySelectorAll('script[type="application/ld+json"]');
    
    for (const scriptElement of scriptElements) {
        const scriptText = scriptElement.textContent.trim();
        const jsonData = parseJsonSafely(scriptText);
        if (jsonData['@type'] === 'Product') {
    
            return {
                name: jsonData?.name,
                id: jsonData?.sku,
                producer: jsonData?.category?.manufacturer,
                price: jsonData?.offers?.price,
                pharmacy_name: jsonData?.offers?.seller?.name,
                link: productLink,
                availability_status: jsonData?.offers?.availability === "http://schema.org/InStock" ? "inStock" : "OutOfStock",
            };
        }
    }
    return null;
  }
  
let lvivReg = 443;
let dolynaReg = 246

const getProductData = async(productLink, region) => {
    try {
      const response = await axios.get(productLink, 
        {
            headers: {
                "Cookie": `wucmf_region=${region}`,
            }
        });
      const result = processProductElements(response.data, productLink);
      console.log(result);
      return result;
    } catch (error) {
      console.error('Помилка при отриманні данних за посиланням:', productLink, error);
      throw error;
    }
  }


getProductData('https://apteka911.ua/ua/shop/bufomiks-iziheyler-por-d-ing-320mkg-9mkg-doza-ingal-60doz-p250576', dolynaReg)