import { Drugs911, createNewDrug } from '../models/drugs911.js';

const DEBUG = true;

const main = async () => {
    try {
        const syncState = await Promise.all([
            Drugs911.sync(),
        ]);
        
        
        if (DEBUG && syncState) {
            const drugData = {
                drug_id: 23,
                drug_name: 'лалалал',
                drug_producer: 'lalla',
                price: 12,
            };

            createNewDrug(drugData);
        }

    } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
    }
};

main();
