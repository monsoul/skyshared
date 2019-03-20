const Sequelize = require('sequelize');
const db = require('skyshared').data.get('management');
const dbUtil = require('skyshared').data.dbUtil;
const typeUtil = require('skyshared').util.typeUtil;

const _schema = {
	tableName: 'category_item',
	columns: {
		categoryItemId: {
			name: 'categoryItemId',
			dataType: 'uniqueidentifier',
			isPrimary: true
		},
		categoryId: {
			name: 'categoryId',
			dataType: 'uniqueidentifier',
			isPrimary: false
		},
		name: {
			name: 'name',
			dataType: 'nvarchar',
			isPrimary: false
		},
		code: {
			name: 'code',
			dataType: 'varchar',
			isPrimary: false
		},
		value: {
			name: 'value',
			dataType: 'varchar',
			isPrimary: false
		},
		isActive: {
			name: 'isActive',
			dataType: 'bit',
			isPrimary: false
		},
		createdTime: {
			name: 'createdTime',
			dataType: 'datetime',
			isPrimary: false
		}
	},
	columnNames: ['categoryItemId', 'categoryId', 'name', 'code', 'value', 'isActive', 'createdTime']
};

const _dal = db.define('category_item', {
	categoryItemId: {
		type: Sequelize.STRING,
		primaryKey: true,
		field: 'category_item_id'
	},
	categoryId: {
		type: Sequelize.STRING,
		field: 'category_id'
	},
	name: {
		type: Sequelize.STRING,
		field: 'name'
	},
	code: {
		type: Sequelize.STRING,
		field: 'code'
	},
	value: {
		type: Sequelize.STRING,
		field: 'value'
	},
	isActive: {
		type: Sequelize.STRING,
		field: 'is_active'
	},
	createdTime: {
		type: Sequelize.STRING,
		field: 'created_time'
	}
}, {
    timestamps: false,
    tableName: 'category_item'
});

async function load(category_item_id){
	if(!arguments || arguments.length === 0){
		return;
	}

	return await _dal.findById(category_item_id);
}

async function query(criteria, orderFields, columns, limit){
	const options = {};
	const where = dbUtil.buildWhere(_schema, criteria);
	options.where = where || {};

	const order = dbUtil.buildOrder(_schema, orderFields);
	if(order){
		options.order = order;
	}
	
	if(columns && typeUtil.isArray(columns) && columns.length > 0){
		options.attributes = columns;
	}

	if(limit) {
		options.limit = limit;
	}

	let data = await _dal.findAll(options);

    return data;
}

async function pageQuery(criteria, page, orderFields, columns){
	const options = {}

	const where = dbUtil.buildWhere(_schema, criteria);
	options.where = where || {};

	page = page || {};
	page.index = page.index || 0;
	page.size = page.size || 10;

	if(page.index < 0){
		page.index = 0;
	}
	if(page.size < 0){
		page.size = 10;
	}


	options.limit = page.size;
	options.offset = page.index * page.size;

	const order = dbUtil.buildOrder(_schema, orderFields);
	if(order){
		options.order = order;
	}
	
	if(columns && typeUtil.isArray(columns) && columns.length > 0){
		options.attributes = columns;
	}

	let data = await _dal.findAndCountAll(options);

	const result = {
		data: data.rows,
		recordCount: data.count,
		pageCount: data.count % page.size === 0 ? data.count / page.size : Math.floor(data.count / page.size) + 1
	}

    return result;
}

async function add(criteria, columns) {
    columns = columns || _schema.columnNames;

	let data = dbUtil.buildAdd(_schema, criteria);
	if(!data){
		return;
	}

    const result = await _dal.create(data, {
        fields: columns
    });

    return result;
}

async function update(criteria, columns) {
	columns = columns || _schema.columnNames;

	const result = dbUtil.buildUpdate(_schema, criteria, true);
	if(!result.data){
		return;
	}
	if(!result.where){
		return;
	}

	const data = await _dal.update(result.data, {
		fields: columns,
		where: result.where
	});
	
	return data;
}

async function batchUpdate(data, criteria, columns){
	columns = columns || _schema.columnNames;

	data = dbUtil.buildUpdate(_schema, data);
	if(!data){
		return;
	}

	criteria = dbUtil.buildWhere(_schema, criteria);
	if(!criteria){
		return;
	}

	const result = await _dal.update(data, {
		fields: columns,
		where: criteria
	});
	
	return result;
}

module.exports = {
	_schema,
	_dal,
	load,
	query,
	pageQuery,
	add,
	update,
	batchUpdate
}