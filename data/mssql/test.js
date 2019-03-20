require('..').init({
    simulator: {
        database: 'simulator',
        userName: 'sa',
        password: 'HCDhcd@123',
        options: {
            host: '10.20.32.95',
            dialect: 'mssql',
            dialectOptions: {
                instanceName: 'SQLEXPRESS'
            }
        }
    },
    management: {
        database: 'cm.management',
        userName: 'sa',
        password: 'HCDhcd@123',
        options: {
            host: '10.20.32.95',
            dialect: 'mssql',
            dialectOptions: {
                instanceName: 'SQLEXPRESS'
            }
        }
    }
});

const Sequelize = require('sequelize');
//const db = require('skyshared').data.get('glp');
//const dbUtil = require('skyshared').data.dbUtil;
//const typeUtil = require('skyshared').util.typeUtil;

const db = require('../index').get('simulator');
const dbUtil = require('../dbUtil');
const typeUtil = require('../../util/typeUtil');


const _schema = {
	tableName: 'Users',
	columns: {
		Id: {
			name: 'Id',
			dataType: 'uniqueidentifier',
			isPrimary: true
		},
		Version: {
			name: 'Version',
			dataType: 'int',
			isPrimary: false
		},
		Name: {
			name: 'Name',
			dataType: 'nvarchar',
			isPrimary: false
		},
		Username: {
			name: 'Username',
			dataType: 'nvarchar',
			isPrimary: false
		},
		Password: {
			name: 'Password',
			dataType: 'nvarchar',
			isPrimary: false
		},
		IsTester: {
			name: 'IsTester',
			dataType: 'bit',
			isPrimary: false
		},
		IsAdmin: {
			name: 'IsAdmin',
			dataType: 'bit',
			isPrimary: false
		},
		LastLogin: {
			name: 'LastLogin',
			dataType: 'datetime',
			isPrimary: false
		}
	},
	columnNames: ['Id', 'Version', 'Name', 'Username', 'Password', 'IsTester', 'IsAdmin', 'LastLogin']
};

const _dal = db.define('Users', {
	Id: {
		type: Sequelize.STRING,
		primaryKey: true,
		field: 'Id'
	},
	Version: {
		type: Sequelize.INTEGER,
		field: 'Version'
	},
	Name: {
		type: Sequelize.STRING,
		field: 'Name'
	},
	Username: {
		type: Sequelize.STRING,
		field: 'Username'
	},
	Password: {
		type: Sequelize.STRING,
		field: 'Password'
	},
	IsTester: {
		type: Sequelize.STRING,
		field: 'IsTester'
	},
	IsAdmin: {
		type: Sequelize.STRING,
		field: 'IsAdmin'
	},
	LastLogin: {
		type: Sequelize.STRING,
		field: 'LastLogin'
	}
}, {
    timestamps: false,
    tableName: 'Users'
});

async function load(Id){
	if(!arguments || arguments.length === 0){
		return;
	}

	return await _dal.findById(Id);
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

const operators = require('../constant').operators;
const uuidUtil = require('../../util/uuidUtil');

Promise.all([
    load('9B8585A1-D19D-46B0-B2EC-0031D6BB0012')
]).then(value => {
    console.log(value[0]);
    process.exit();
});

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
