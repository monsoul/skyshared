const Sequelize = require('sequelize');
const dbFactory = require('../dbFactory');

class ColumnDal {
    constructor(dbKey) {
		this._dbKey = dbKey;
		this.init(this._dbKey);
    }

    init(dbKey) {
        this._sequelize = dbFactory.getSequelize(dbKey);
    }

    async findByTable(tableName) {
        let data = await this._sequelize.query(
			`SELECT  
				[TABLE_CATALOG] AS [table_catalog], [TABLE_SCHEMA] AS [table_schema], [TABLE_NAME] AS [table_name], 
				[COLUMN_NAME] AS [column_name],  [DATA_TYPE] AS [data_type]
			FROM INFORMATION_SCHEMA.COLUMNS 
			WHERE TABLE_NAME = ?`,
            {
                replacements: [tableName],
                type: Sequelize.QueryTypes.SELECT
            }
		);
		
        return data;
    }
}

const _columnDals = {};

module.exports = function(dbKey) {
    if (!_columnDals[dbKey]) {
        _columnDals[dbKey] = new ColumnDal(dbKey);
    }
    return _columnDals[dbKey];
};
