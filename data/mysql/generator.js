/*
require('../').init({
    schema: {
        database: 'information_schema',
        userName: 'root',
        password: '77777qa',
        options: {
            host: '10.20.30.9',
			dialect: 'mysql',
			logging: false,
			operatorsAliases: false
        }
    }
});
*/

const fs = require('fs');
const path = require('path');
const toClipboard = require('to-clipboard');
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
			const fieldName = formatName(item.column_name);
            let column = primaryFieldContent.replace(/{{field}}/g, fieldName);
            column = column.replace(/{{field_type}}/g, COLUMN_TYPE_MAP[item.data_type] || COLUMN_TYPE_MAP.varchar);
			column = column.replace(/{{column_name}}/g, item.column_name);

            template += column + ',' + '\n';
        }
    });

    columns.forEach(item => {
        if (!primaryFields[item.column_name] && !EXCEPT_COLUMN[item.column_name]) {
			const fieldName = formatName(item.column_name);
            let column = fieldContent.replace(/{{field}}/g, fieldName);
            column = column.replace(/{{field_type}}/g, COLUMN_TYPE_MAP[item.data_type] || COLUMN_TYPE_MAP.varchar);
			column = column.replace(/{{column_name}}/g, item.column_name);
			
            template += column + ',' + '\n';
        }
    });

    return template.substr(0, template.length - 2);
}

function generateSchema(primaryColumns, columns) {
    primaryColumns = primaryColumns || [];
    const primaryFields = {};
    primaryColumns.forEach(item => {
        primaryFields[item.column_name] = item;
    });

    const template = readFile('column.txt');

    let content = '';
    columns.forEach(item => {
        if (EXCEPT_COLUMN[item.column_name]) {
            return;
        }

        content += template.replace(/{{field}}/g, formatName(item.column_name))
            .replace(/{{data_type}}/g, item.data_type)
            .replace(/{{is_primary}}/g, !!primaryFields[item.column_name]);
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

function generateColumns(columns) {
    let content = '';
    columns.forEach(item => {
        if (EXCEPT_COLUMN[item.column_name]) {
            return;
        }

        content += '\'' + formatName(item.column_name) + '\', '
    });

    return content.substr(0, content.length - 2);
}

async function dal(schema, tableName) {
    const tableInfo = await loadSchema(schema, tableName);

    const fieldContent = generateFields(tableInfo.primaryColumns, tableInfo.columns);
    const schemaContent = generateSchema(tableInfo.primaryColumns, tableInfo.columns);
    const columnContent = generateColumns(tableInfo.columns);

    let requireContent = readFile('require.txt');
    requireContent = requireContent.replace('{{connection}}', schema);

    let tableContent = readFile('table.txt');
    let content = tableContent.replace(/{{require}}/g, requireContent);
    content = content.replace(/{{table_name}}/g, tableName);
    content = content.replace(/{{fields}}/g, fieldContent);
    content = content.replace(/{{column_names}}/g, columnContent);
    content = content.replace(/{{columns}}/g, schemaContent);
    content = content.replace(/{{primary_key}}/g, generatePrimaryKey(tableInfo.primaryColumns));

    toClipboard.sync(content);

    process.exit();
}


function formatName(name) {
    const parts = name.split('_');

    parts.forEach((part, i) => {
        if (i === 0) {
            return;
        }

        let first = part.substr(0, 1).toUpperCase();
        parts[i] = first + part.substr(1, part.length - 1);
    });

    return parts.join('');
}

async function mapper(schema, tableName) {
    const tableInfo = await loadSchema(schema, tableName);

    const mapperFieldContent = readFile('mapperField.txt');
    const mapperReverseFieldContent = readFile('mapperReverseField.txt');

    let mapperFields = '';
    let mapperReverseFields = '';
    tableInfo.columns.forEach(column => {
        if (EXCEPT_COLUMN[column.column_name]) {
            return;
        }
        const fieldName = formatName(column.column_name);

        mapperFields += mapperFieldContent.replace(/{{column_name}}/g, column.column_name).replace(/{{field_name}}/g, fieldName) + ',\n';
        mapperReverseFields += mapperReverseFieldContent.replace(/{{column_name}}/g, column.column_name).replace(/{{field_name}}/g, fieldName) + ',\n';
    });

    mapperFields = mapperFields.substr(0, mapperFields.length - 2);
    mapperReverseFields = mapperReverseFields.substr(0, mapperReverseFields.length - 2);

    const mapperContent = readFile('mapper.txt');
    let content = mapperContent.replace(/{{mapper_fields}}/g, mapperFields).replace(/{{mapper_reverse_fields}}/g, mapperReverseFields);

    toClipboard.sync(content);

    process.exit();
}

module.exports = {
    dal,
    mapper
};

//dal('glp', 'glp_company');
//mapper('glp', 'glp_company');