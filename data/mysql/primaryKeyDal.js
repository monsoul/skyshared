const Sequelize = require('sequelize');
const sequelize = require('../').get('schema');

const dal = sequelize.define('KEY_COLUMN_USAGE', {
    table_schema: {
        primaryKey: true,
        type: Sequelize.STRING,
        field: 'TABLE_SCHEMA'
    },
    constraint_name: {
        type: Sequelize.STRING,
        field: 'CONSTRAINT_NAME'
    },
    column_name: {
        type: Sequelize.STRING,
        field: 'COLUMN_NAME'
    }
}, {
    timestamps: false,
    tableName: 'KEY_COLUMN_USAGE'
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