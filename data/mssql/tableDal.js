const Sequelize = require('sequelize');
const dbFactory = require('../dbFactory');

class TableDal {
    constructor(dbKey) {
		this._dbKey = dbKey;
		this.init(this._dbKey);
    }

    init(dbKey) {
        this._sequelize = dbFactory.getSequelize(dbKey);
    }

    async findByName(tableName) {
        let data = await this._sequelize.query(
			`SELECT  
				[TABLE_CATALOG] AS [table_catalog], [TABLE_SCHEMA] AS [table_schema], [TABLE_NAME] AS [table_name], [TABLE_TYPE] AS [table_type]  
			FROM INFORMATION_SCHEMA.TABLES 
			WHERE TABLE_NAME = ?`,
            {
                replacements: [tableName],
                type: Sequelize.QueryTypes.SELECT
            }
		);

        return data && data.length > 0 ? data[0] : null;
    }
}

const _tableDals = {};

module.exports = function(dbKey) {
    if (!_tableDals[dbKey]) {
        _tableDals[dbKey] = new TableDal(dbKey);
    }
    return _tableDals[dbKey];
};
