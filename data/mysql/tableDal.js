const Sequelize = require('sequelize');
const sequelize = require('../').get('schema');

const dal = sequelize.define('TABLES', {
    table_schema: {
        primaryKey: true,
        type: Sequelize.STRING,
        field: 'TABLE_SCHEMA'
    },
    table_name: {
        type: Sequelize.STRING,
        field: 'TABLE_NAME'
    },
    table_type: {
        type: Sequelize.STRING,
        field: 'TABLE_TYPE'
    },
    table_comment: {
        type: Sequelize.STRING,
        field: 'TABLE_COMMENT'
    }
}, {
    timestamps: false,
    tableName: 'TABLES'
});

async function findByName(tableName, schema){
	schema = schema || 'glp';
    let data = await dal.findOne({
        where: {
			table_schema: schema,
            table_name: tableName
        }
    });

    return data;
}

module.exports = {
    findByName
}