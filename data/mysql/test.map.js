const typeUtil = require('../../util/typeUtil');

const mapper = {
	id: 'id',
	company_name: 'companyName',
	organization_code: 'organizationCode',
	company_url: 'companyUrl',
	contact_information: 'contactInformation',
	company_address: 'companyAddress',
	industry: 'industry',
	institution_name: 'institutionName',
	institution_type: 'institutionType',
	update_admin_user_id: 'updateAdminUserId'
}

const reverseMapper = {
	id: 'id',
	companyName: 'company_name',
	organizationCode: 'organization_code',
	companyUrl: 'company_url',
	contactInformation: 'contact_information',
	companyAddress: 'company_address',
	industry: 'industry',
	institutionName: 'institution_name',
	institutionType: 'institution_type',
	updateAdminUserId: 'update_admin_user_id'
}

function mapObject(data) {
    let result = {};
    for (let key in data) {
        const field = mapper[key];
        if (field) {
            result[field] = data[key];
        }
    }

    return result;
}

function map(data) {
    if (typeUtil.isArray(data)) {
        return data.map(item => {
            return mapObject(item);
        });
    } else {
        return mapObject(data);
    }
}

function reserveMapObject(data) {
    let result = {};
    for (let key in data) {
        const column = reverseMapper[key];
        if (column) {
            result[column] = data[key];
        }
    }
    return result;
}

function reserveMap(data) {
    if (typeUtil.isArray(data)) {
        return data.map(item => {
            return reserveMapObject(item);
        });
    } else {
        return reserveMapObject(data);
    }
}

module.exports = {
	map,
	reserveMap
}



/*
console.log(map({
    id: '123',
    company_name: 'name',
    company_url: 'http://www.sina.com'
}))
*/
console.log(map([{
    id: '123',
    company_name: 'name',
    company_url: 'http://www.sina.com'
}, {
    id: '123',
    company_name: 'name',
    company_url: 'http://www.sina.com',
    company_address: 'address'
}]))


console.log(reserveMap({
    id: '123',
    companyName: 'name',
    companyUrl: 'http://www.sina.com'
}))