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
	nvarchar: 'Sequelize.STRING',
    int: 'Sequelize.INTEGER',
    timestamp: 'Sequelize.DATE',
    decimal: 'Sequelize.DECIMAL',
    bigint: 'Sequelize.BIGINT'
}

class Generator{

	constructor(dbKey){
		this._dbKey = dbKey;
		this._tableDal = tableDal(this._dbKey);
		this._columnDal = columnDal(this._dbKey);
		this._primaryKeyDal = primaryKeyDal(this._dbKey);
	}

	readFile(filePath) {
		filePath = path.join(__dirname, 'template', filePath);
		const file = fs.readFileSync(filePath, 'utf-8');
	
		return file;
	}
	
	async loadTable(tableName) {
		const table = await this._tableDal.findByName(tableName);
		return table;
	}
	
	async loadSchema(schema, tableName) {
		const table = await this._tableDal.findByName(tableName, schema);
		if (!table) {
			return;
		}
	
		const columns = await this._columnDal.findByTable(tableName, schema);
	
		const primaryColumns = await this._primaryKeyDal.findByTable(tableName, schema) || [];
	
		return {
			table,
			columns,
			primaryColumns
		};
	}
	
	generateFields(primaryColumns, columns) {
		primaryColumns = primaryColumns || [];
		const primaryFields = {};
		primaryColumns.forEach(item => {
			primaryFields[item.column_name] = item;
		});
	
		const fieldContent = this.readFile('field.txt');
		const primaryFieldContent = this.readFile('primaryField.txt');
	
		let template = '';
		columns.forEach(item => {
			if (primaryFields[item.column_name]) {
				const fieldName = this.formatName(item.column_name);
				let column = primaryFieldContent.replace(/{{field}}/g, fieldName);
				column = column.replace(/{{field_type}}/g, COLUMN_TYPE_MAP[item.data_type] || COLUMN_TYPE_MAP.varchar);
				column = column.replace(/{{column_name}}/g, item.column_name);
	
				template += column + ',' + '\n';
			}
		});
	
		columns.forEach(item => {
			if (!primaryFields[item.column_name] && !EXCEPT_COLUMN[item.column_name]) {
				const fieldName = this.formatName(item.column_name);
				let column = fieldContent.replace(/{{field}}/g, fieldName);
				column = column.replace(/{{field_type}}/g, COLUMN_TYPE_MAP[item.data_type] || COLUMN_TYPE_MAP.varchar);
				column = column.replace(/{{column_name}}/g, item.column_name);
				
				template += column + ',' + '\n';
			}
		});
	
		return template.substr(0, template.length - 2);
	}
	
	generateSchema(primaryColumns, columns) {
		primaryColumns = primaryColumns || [];
		const primaryFields = {};
		primaryColumns.forEach(item => {
			primaryFields[item.column_name] = item;
		});
	
		const template = this.readFile('column.txt');
	
		let content = '';
		columns.forEach(item => {
			if (EXCEPT_COLUMN[item.column_name]) {
				return;
			}
	
			content += template.replace(/{{field}}/g, this.formatName(item.column_name))
				.replace(/{{data_type}}/g, item.data_type)
				.replace(/{{is_primary}}/g, !!primaryFields[item.column_name]);
			content += ',\n';
		});
	
		return content.substr(0, content.length - 2);
	}
	
	generatePrimaryKey(primaryColumns) {
		let template = '';
		primaryColumns.forEach(item => {
			template += item.column_name + ', ';
		});
	
		return template ? template.substr(0, template.length - 2) : '';
	}
	
	generateColumns(columns) {
		let content = '';
		columns.forEach(item => {
			if (EXCEPT_COLUMN[item.column_name]) {
				return;
			}
	
			content += '\'' + this.formatName(item.column_name) + '\', '
		});
	
		return content.substr(0, content.length - 2);
	}
	
	async dal(schema, tableName) {
		const tableInfo = await this.loadSchema(schema, tableName);
	
		const fieldContent = this.generateFields(tableInfo.primaryColumns, tableInfo.columns);
		const schemaContent = this.generateSchema(tableInfo.primaryColumns, tableInfo.columns);
		const columnContent = this.generateColumns(tableInfo.columns);
	
		let requireContent = this.readFile('require.txt');
		requireContent = requireContent.replace('{{connection}}', schema);
	
		let tableContent = this.readFile('table.txt');
		let content = tableContent.replace(/{{require}}/g, requireContent);
		content = content.replace(/{{table_name}}/g, tableName);
		content = content.replace(/{{fields}}/g, fieldContent);
		content = content.replace(/{{column_names}}/g, columnContent);
		content = content.replace(/{{columns}}/g, schemaContent);
		content = content.replace(/{{primary_key}}/g, this.generatePrimaryKey(tableInfo.primaryColumns));
	
		toClipboard.sync(content);
	
		process.exit();
	}
	
	
	formatName(name) {
		const parts = name.split('_');
	
		parts.forEach((part, i) => {
			let first
			if (i === 0) {
				first = part.substr(0, 1).toLowerCase();
				parts[i] = first + part.substr(1, part.length - 1);
				return;
			}
	
			first = part.substr(0, 1).toUpperCase();
			parts[i] = first + part.substr(1, part.length - 1);
		});
	
		return parts.join('');
	}
	
	async mapper(schema, tableName) {
		const tableInfo = await this.loadSchema(schema, tableName);
	
		const mapperFieldContent = this.readFile('mapperField.txt');
		const mapperReverseFieldContent = this.readFile('mapperReverseField.txt');
	
		let mapperFields = '';
		let mapperReverseFields = '';
		tableInfo.columns.forEach(column => {
			if (EXCEPT_COLUMN[column.column_name]) {
				return;
			}
			const fieldName = this.formatName(column.column_name);
	
			mapperFields += mapperFieldContent.replace(/{{column_name}}/g, column.column_name).replace(/{{field_name}}/g, fieldName) + ',\n';
			mapperReverseFields += mapperReverseFieldContent.replace(/{{column_name}}/g, column.column_name).replace(/{{field_name}}/g, fieldName) + ',\n';
		});
	
		mapperFields = mapperFields.substr(0, mapperFields.length - 2);
		mapperReverseFields = mapperReverseFields.substr(0, mapperReverseFields.length - 2);
	
		const mapperContent = this.readFile('mapper.txt');
		let content = mapperContent.replace(/{{mapper_fields}}/g, mapperFields).replace(/{{mapper_reverse_fields}}/g, mapperReverseFields);
	
		toClipboard.sync(content);
	
		process.exit();
	}
}

module.exports = function(dbKey){
	return new Generator(dbKey);
};

//dal('glp', 'glp_company');
//mapper('glp', 'glp_company');