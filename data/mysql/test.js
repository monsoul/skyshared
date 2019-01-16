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
	tableName: 'glp_company',
	columns: {
		id: {
			name: 'id',
			dataType: 'varchar',
			isPrimary: true
		},
		companyName: {
			name: 'companyName',
			dataType: 'varchar',
			isPrimary: false
		},
		organizationCode: {
			name: 'organizationCode',
			dataType: 'varchar',
			isPrimary: false
		},
		companyUrl: {
			name: 'companyUrl',
			dataType: 'varchar',
			isPrimary: false
		},
		contactInformation: {
			name: 'contactInformation',
			dataType: 'varchar',
			isPrimary: false
		},
		companyAddress: {
			name: 'companyAddress',
			dataType: 'varchar',
			isPrimary: false
		},
		industry: {
			name: 'industry',
			dataType: 'varchar',
			isPrimary: false
		},
		institutionName: {
			name: 'institutionName',
			dataType: 'varchar',
			isPrimary: false
		},
		institutionType: {
			name: 'institutionType',
			dataType: 'varchar',
			isPrimary: false
		},
		updateAdminUserId: {
			name: 'updateAdminUserId',
			dataType: 'varchar',
			isPrimary: false
		}
	},
	columnNames: ['id', 'companyName', 'organizationCode', 'companyUrl', 'contactInformation', 'companyAddress', 'industry', 'institutionName', 'institutionType', 'updateAdminUserId']
};

const _dal = db.define('glp_company', {
	id: {
		type: Sequelize.STRING,
		primaryKey: true,
		field: 'id'
	},
	companyName: {
		type: Sequelize.STRING,
		field: 'company_name'
	},
	organizationCode: {
		type: Sequelize.STRING,
		field: 'organization_code'
	},
	companyUrl: {
		type: Sequelize.STRING,
		field: 'company_url'
	},
	contactInformation: {
		type: Sequelize.STRING,
		field: 'contact_information'
	},
	companyAddress: {
		type: Sequelize.STRING,
		field: 'company_address'
	},
	industry: {
		type: Sequelize.STRING,
		field: 'industry'
	},
	institutionName: {
		type: Sequelize.STRING,
		field: 'institution_name'
	},
	institutionType: {
		type: Sequelize.STRING,
		field: 'institution_type'
	},
	updateAdminUserId: {
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

const operators = require('../constant').operators;
const uuidUtil = require('../../util/uuidUtil');




/*
Promise.all([query({
	id: '76561aa2-c33d-4ca4-a98e-5d54d39e813f'
})]).then((value)=>{
	console.log(value[0])
	process.exit();
});


Promise.all([pageQuery({
	companyName: 'test 1'
}, {index: 0, size: 4}, ['companyName', {
	column: 'organizationCode'
}, {
	column: 'id',
	isDesc: true
}])]).then((value)=>{
	console.log(value[0])
	process.exit();
});

Promise.all([load('76561aa2-c33d-4ca4-a98e-5d54d39e813f')]).then((value)=>{
	console.log(value[0].id)
	process.exit();
});


Promise.all([
	add({
		id: uuidUtil.uuid(),
		companyName: 'test 4',
		companyUrl: 'http://www.baidu.com',
		updateAdminUserId: 'f06807c3-e847-4f19-a427-8ee7fdfb340b'
	})
]).then((value)=>{
	console.log(value[0].id)
	process.exit();
});

Promise.all([
	update({
		id: '9651a67b-e860-4139-9601-f6a26fe41a6f',
		companyUrl: 'http://www.google.com'
	}, ['companyUrl', 'companyName'])
]).then((value)=>{
	console.log(value)
	process.exit();
});


Promise.all([
	batchUpdate({
		id: '9651a67b-e860-4139-9601-f6a26fe41a6f',
		companyUrl: 'http://www.baidu.com',
		dafdsa: '122'
	}, {
		companyName: ['test 1', 'test 2']
	})
]).then((value)=>{
	console.log(value)
	process.exit();
});
*/