import { Model, DataTypes } from "sequelize";
import { sequelize } from './sequelize.js';


class Drugs911 extends Model {}
Drugs911.init({
    drug_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    drug_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    drug_producer: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    price: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    pharmacy_name: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false
    },
    availability_status: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false
    }
}, {
    freezeTableName: false,
    timestamps: true,
    modelName: 'drugs911',
    sequelize
});

const createNewDrug = async (drugData) => {
    let res;
    try {
        res = await Drugs911.create({ ...drugData });
        res = res.dataValues;
    } catch (err) {
        console.error(`Impossible to create drug: ${err}`);
    }
    return res;
};


const updateDrugById = async (id, price) => {
    const res = await Drugs911.update({ price } , { where: { id } });
    if (res[0]) {
        return res[0];
    } 
    return undefined;
};

const findDrugById = async (drug_id) => {
    const res = await Drugs911.findOne({ where: { drug_id }});
    if (res) return res.dataValues;
    return;
}


const findALLDrugs = async () => {
    const res = await Drugs911.findAll({ where: {  } });
    if (res.length > 0) return res.map(el => el.dataValues);
    return;
};

export {
    Drugs911,
    createNewDrug,
    findALLDrugs,
    updateDrugById,
    findDrugById
};   