require('../').init({
    schema: {
        database: 'information_schema',
        userName: 'root',
        password: '77777qa',
        options: {
            host: '10.20.30.9',
            dialect: 'mysql'
        }
    }
});

const fs = require('fs');
const path = require('path');
const tableDal = require('./tableDal');
const columnDal = require('./columnDal');
const primaryKeyDal = require('./primaryKeyDal');

const EXCEPT_COLUMN = {
    data_status: 'data_status',
    data_create_time: 'data_create_time',
    data_update_time: 'data_update_time'
};

const COLUMN_TYPE_MAP = {
    varchar: 'Sequelize.STRING',
    int: 'Sequelize.INTEGER',
    timestamp: 'Sequelize.DATE',
    decimal: 'Sequelize.DECIMAL',
    bigint: 'Sequelize.BIGINT'
}

function readFile(filePath) {
    filePath = path.join(__dirname, 'template', filePath);
    const file = fs.readFileSync(filePath, 'utf-8');

    return file;
}

async function loadTable(tableName) {
    const table = await tableDal.findByName(tableName);
    return table;
}

async function loadSchema(schema, tableName) {
    const table = await tableDal.findByName(tableName, schema);
    if (!table) {
        return;
    }

    const columns = await columnDal.findByTable(tableName, schema);

    const primaryColumns = await primaryKeyDal.findByTable(tableName, schema) || [];

    return {
        table,
        columns,
        primaryColumns
    };
}

function generateFields(primaryColumns, columns) {
    primaryColumns = primaryColumns || [];
    const primaryFields = {};
    primaryColumns.forEach(item => {
        primaryFields[item.column_name] = item;
    });

    const fieldContent = readFile('field.txt');
    const primaryFieldContent = readFile('primaryField.txt');

    let template = '';
    columns.forEach(item => {
        if (primaryFields[item.column_name]) {
            let column = primaryFieldContent.replace(/{{field}}/g, item.column_name);
            column = column.replace(/{{field_type}}/g, COLUMN_TYPE_MAP[item.data_type] || COLUMN_TYPE_MAP.varchar);

            template += column + ',' + '\n';
        }
    });

    columns.forEach(item => {
        if (!primaryFields[item.column_name] && !EXCEPT_COLUMN[item.column_name]) {
            let column = fieldContent.replace(/{{field}}/g, item.column_name);
            column = column.replace(/{{field_type}}/g, COLUMN_TYPE_MAP[item.data_type] || COLUMN_TYPE_MAP.varchar);

            template += column + ',' + '\n';
        }
    });

    return template.substr(0, template.length - 2);
}

function generateSchema(columns) {
    const template = readFile('column.txt');

    let content = '';
    columns.forEach(item => {
        if (EXCEPT_COLUMN[item.column_name]) {
            return;
        }

        content += template.replace(/{{column_name}}/g, item.column_name).replace(/{{data_type}}/g, item.data_type);
        content += ',\n';
    });

    return content.substr(0, content.length - 2);
}

function generatePrimaryKey(primaryColumns) {
    let template = '';
    primaryColumns.forEach(item => {
		template += item.column_name + ', ';
	});
	
	return template ? template.substr(0, template.length - 2) : '';
}

async function generate(schema, tableName) {
	
    const tableInfo = await loadSchema(schema, tableName);

    const fieldContent = generateFields(tableInfo.primaryColumns, tableInfo.columns);
    const schemaContent = generateSchema(tableInfo.columns);

    let requireContent = readFile('require.txt');
    requireContent = requireContent.replace('{{connection}}', schema);

    let tableContent = readFile('table.txt');
    let content = tableContent.replace(/{{require}}/g, requireContent);
    content = content.replace(/{{table_name}}/g, tableName);
    content = content.replace(/{{fields}}/g, fieldContent);
	content = content.replace(/{{columns}}/g, schemaContent);
	content = content.replace(/{{primary_key}}/g, generatePrimaryKey(tableInfo.primaryColumns))

    console.log(content);
}


generate('glp', 'glp_course')