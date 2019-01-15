const Sequelize = require('sequelize');
const sequelize = require('../dbFactory').getSequelize('schema');

const dal = sequelize.define('COLUMNS', {
    table_schema: {
        primaryKey: true,
        type: Sequelize.STRING,
        field: 'TABLE_SCHEMA'
    },
    table_name: {
        type: Sequelize.STRING,
        field: 'TABLE_NAME'
    },
    column_name: {
        type: Sequelize.STRING,
        field: 'COLUMN_NAME'
    },
    data_type: {
        type: Sequelize.STRING,
        field: 'DATA_TYPE'
    }
}, {
    timestamps: false,
    tableName: 'COLUMNS'
});

async function findByTable(tableName, schema){
	schema = schema || 'glp';
    let data = await dal.findAll({
        where: {
			table_schema: schema,
            table_name: tableName
        }
    });

    return data;
}

module.exports = {
    findByTable
}