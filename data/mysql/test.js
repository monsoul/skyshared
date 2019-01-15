require('..').init({
    glp: {
        database: 'glp',
        userName: 'root',
        password: '77777qa',
        options: {
            host: '10.20.30.9',
            dialect: 'mysql'
        }
    }
});

const Sequelize = require('sequelize');
//const db = require('skyshared').data.get('glp');
//const dbUtil = require('skyshared').data.dbUtil;
//const typeUtil = require('skyshared').util.typeUtil;

const db = require('../index').get('glp');
const dbUtil = require('../dbUtil');
const typeUtil = require('../../util/typeUtil');

const _schema = {
	table_name: 'glp_company',
	columns: {
		id: {
			name: 'id',
			data_type: 'varchar',
			is_primary: true
		},
		company_name: {
			name: 'company_name',
			data_type: 'varchar',
			is_primary: false
		},
		organization_code: {
			name: 'organization_code',
			data_type: 'varchar',
			is_primary: false
		},
		company_url: {
			name: 'company_url',
			data_type: 'varchar',
			is_primary: false
		},
		contact_information: {
			name: 'contact_information',
			data_type: 'varchar',
			is_primary: false
		},
		company_address: {
			name: 'company_address',
			data_type: 'varchar',
			is_primary: false
		},
		industry: {
			name: 'industry',
			data_type: 'varchar',
			is_primary: false
		},
		institution_name: {
			name: 'institution_name',
			data_type: 'varchar',
			is_primary: false
		},
		institution_type: {
			name: 'institution_type',
			data_type: 'varchar',
			is_primary: false
		},
		update_admin_user_id: {
			name: 'update_admin_user_id',
			data_type: 'varchar',
			is_primary: false
		}
	},
	column_names: ['id', 'company_name', 'organization_code', 'company_url', 'contact_information', 'company_address', 'industry', 'institution_name', 'institution_type', 'update_admin_user_id']
};

const _dal = db.define('glp_company', {
	id: {
		type: Sequelize.STRING,
		primaryKey: true,
		field: 'id'
	},
	company_name: {
		type: Sequelize.STRING,
		field: 'company_name'
	},
	organization_code: {
		type: Sequelize.STRING,
		field: 'organization_code'
	},
	company_url: {
		type: Sequelize.STRING,
		field: 'company_url'
	},
	contact_information: {
		type: Sequelize.STRING,
		field: 'contact_information'
	},
	company_address: {
		type: Sequelize.STRING,
		field: 'company_address'
	},
	industry: {
		type: Sequelize.STRING,
		field: 'industry'
	},
	institution_name: {
		type: Sequelize.STRING,
		field: 'institution_name'
	},
	institution_type: {
		type: Sequelize.STRING,
		field: 'institution_type'
	},
	update_admin_user_id: {
		type: Sequelize.STRING,
		field: 'update_admin_user_id'
	}
}, {
    timestamps: false,
    tableName: 'glp_company'
});

async function load(id){
	if(!arguments || arguments.length === 0){
		return;
	}

	return await _dal.findById(id);
}

async function query(criteria, orderFields, columns){
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

	let data = await _dal.findAll(options);

    return data;
}

async function pageQuery(criteria, page, orderFields, columns){
	const options = {}

	const where = dbUtil.buildWhere(_schema, criteria);
	options.where = where || {};

	page = page || {};
	page.index = page.index || 0;
	page.size = page.size || 1;
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
    columns = columns || _schema.column_names;

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
	columns = columns || _schema.column_names;

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
	columns = columns || _schema.column_names;

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

module.export = {
	_schema,
	_dal,
	load,
	query,
	pageQuery,
	add,
	update,
	batchUpdate
}

const operators = require('../constant').operators;
const uuidUtil = require('../../util/uuidUtil');

/*
Promise.all([query({
	id: '76561aa2-c33d-4ca4-a98e-5d54d39e813f'
})]).then((value)=>{
	console.log(value)
	process.exit();
});

Promise.all([pageQuery({
}, {index: 0, size: 4}, ['company_id', {
	column: 'course_name'
}, {
	column: 'id',
	isDesc: true
}])]).then((value)=>{
	console.log(value[0])
	process.exit();
});

Promise.all([load('d735186e-4e0a-4263-9c2b-ac77187e7e17')]).then((value)=>{
	console.log(value[0].id)
	process.exit();
});


Promise.all([
	add({
		id: uuidUtil.uuid(),
		company_name: 'test 3',
		company_url: 'http://www.sina.com',
		update_admin_user_id: 'f06807c3-e847-4f19-a427-8ee7fdfb340b'
	})
]).then((value)=>{
	console.log(value[0].id)
	process.exit();
});

Promise.all([
	update({
		id: '9651a67b-e860-4139-9601-f6a26fe41a6f',
		company_url: 'http://www.baidu.com'
	}, ['company_url', 'company_name'])
]).then((value)=>{
	console.log(value)
	process.exit();
});
*/


Promise.all([
	batchUpdate({
		id: '9651a67b-e860-4139-9601-f6a26fe41a6f',
		company_url: 'http://www.baidu.com',
		dafdsa: '122'
	}, {
		company_name: ['test 1', 'test 3']
	})
]).then((value)=>{
	console.log(value)
	process.exit();
});