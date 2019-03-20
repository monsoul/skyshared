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

const generator = require('./generator')('simulator');
Promise.all([generator.dal('simulator', 'Users')]).then((value)=>{
	process.exit();
});

/*
const primaryKeyDal = require('./primaryKeyDal')('management');

Promise.all([primaryKeyDal.findByTable('category_item')]).then((value)=>{
	console.log(value[0])
	process.exit();
});

const columnDal = require('./columnDal')('management');

Promise.all([columnDal.findByTable('category_item')]).then((value)=>{
	console.log(value[0])
	process.exit();
});

const tableDal = require('./tableDal')('management');

Promise.all([tableDal.findByName('category_item')]).then((value)=>{
	console.log(value[0])
	process.exit();
});
*/
