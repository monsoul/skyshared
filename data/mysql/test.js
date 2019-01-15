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
	table_name: 'glp_course',
	columns: {
		id: {
			name: 'id',
			data_type: 'varchar'
		},
		company_id: {
			name: 'company_id',
			data_type: 'varchar'
		},
		company_user_id: {
			name: 'company_user_id',
			data_type: 'varchar'
		},
		course_name: {
			name: 'course_name',
			data_type: 'varchar'
		},
		course_type: {
			name: 'course_type',
			data_type: 'int'
		},
		game_id: {
			name: 'game_id',
			data_type: 'varchar'
		},
		course_lecturer_name: {
			name: 'course_lecturer_name',
			data_type: 'varchar'
		},
		early_enter_time: {
			name: 'early_enter_time',
			data_type: 'int'
		},
		start_time: {
			name: 'start_time',
			data_type: 'timestamp'
		},
		end_time: {
			name: 'end_time',
			data_type: 'timestamp'
		},
		apply_start_time: {
			name: 'apply_start_time',
			data_type: 'timestamp'
		},
		apply_end_time: {
			name: 'apply_end_time',
			data_type: 'timestamp'
		},
		round_number: {
			name: 'round_number',
			data_type: 'int'
		},
		team_number: {
			name: 'team_number',
			data_type: 'int'
		},
		auto_run_flag: {
			name: 'auto_run_flag',
			data_type: 'int'
		},
		auto_run_time: {
			name: 'auto_run_time',
			data_type: 'int'
		},
		course_status: {
			name: 'course_status',
			data_type: 'int'
		},
		description: {
			name: 'description',
			data_type: 'varchar'
		}
	}
};

const _dal = db.define('glp_course', {
	id: {
		type: Sequelize.STRING,
		primaryKey: true,
		field: 'id'
	},
	company_id: {
		type: Sequelize.STRING,
		field: 'company_id'
	},
	company_user_id: {
		type: Sequelize.STRING,
		field: 'company_user_id'
	},
	course_name: {
		type: Sequelize.STRING,
		field: 'course_name'
	},
	course_type: {
		type: Sequelize.INTEGER,
		field: 'course_type'
	},
	game_id: {
		type: Sequelize.STRING,
		field: 'game_id'
	},
	course_lecturer_name: {
		type: Sequelize.STRING,
		field: 'course_lecturer_name'
	},
	early_enter_time: {
		type: Sequelize.INTEGER,
		field: 'early_enter_time'
	},
	start_time: {
		type: Sequelize.DATE,
		field: 'start_time'
	},
	end_time: {
		type: Sequelize.DATE,
		field: 'end_time'
	},
	apply_start_time: {
		type: Sequelize.DATE,
		field: 'apply_start_time'
	},
	apply_end_time: {
		type: Sequelize.DATE,
		field: 'apply_end_time'
	},
	round_number: {
		type: Sequelize.INTEGER,
		field: 'round_number'
	},
	team_number: {
		type: Sequelize.INTEGER,
		field: 'team_number'
	},
	auto_run_flag: {
		type: Sequelize.INTEGER,
		field: 'auto_run_flag'
	},
	auto_run_time: {
		type: Sequelize.INTEGER,
		field: 'auto_run_time'
	},
	course_status: {
		type: Sequelize.INTEGER,
		field: 'course_status'
	},
	description: {
		type: Sequelize.STRING,
		field: 'description'
	}
}, {
    timestamps: false,
    tableName: 'glp_course'
});

async function load(id){
	if(!arguments || arguments.length === 0){
		return;
	}

	return await _dal.findById(id);
}

async function query(criteria, orderFields, columns){
	const where = dbUtil.buildWhere(_schema, criteria);
	const options = {
		where
	};

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
	options.where = where;

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



const operators = require('../constant').operators;
/*
Promise.all([query({
}, ['company_id', {
	column: 'course_name'
}, {
	column: 'apply_start_time',
	isDesc: true
}], ['company_id'])]).then((value)=>{
	console.log(value[0][0].company_id)
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
});*/

Promise.all([load('d735186e-4e0a-4263-9c2b-ac77187e7e17')]).then((value)=>{
	console.log(value[0].id)
	process.exit();
});
