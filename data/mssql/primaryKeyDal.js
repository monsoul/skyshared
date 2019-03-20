const Sequelize = require('sequelize');
const dbFactory = require('../dbFactory');

class PrimaryKeyDal {
	constructor(dbKey){
		this._dbKey = dbKey;
		this.init(this._dbKey);
	}

	init(dbKey){
        this._sequelize = dbFactory.getSequelize(dbKey);
	}

	async findByTable(tableName){
		let data = await this._sequelize.query(
			`SELECT  
				a.TABLE_NAME AS table_name, b.COLUMN_NAME AS column_name
			FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS a
				INNER JOIN INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE b ON a.TABLE_NAME=b.TABLE_NAME AND a.CONSTRAINT_NAME=b.CONSTRAINT_NAME
			WHERE a.TABLE_NAME = ? and a.CONSTRAINT_TYPE='PRIMARY KEY'`,
            {
                replacements: [tableName],
                type: Sequelize.QueryTypes.SELECT
            }
		);
		
        return data;
	}
}

const _dals = {};

module.exports = function(dbKey) {
    if (!_dals[dbKey]) {
        _dals[dbKey] = new PrimaryKeyDal(dbKey);
    }
    return _dals[dbKey];
};