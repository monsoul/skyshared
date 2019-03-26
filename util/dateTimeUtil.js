const util = require('util');
const typeUtil = require('./typeUtil');

const weekDay = [
    "周日",
    "周一",
    "周二",
    "周三",
    "周四",
    "周五",
    "周六"
];


function _formatLength(value) {
    value = value + '';
    return value.padStart(2, '0');
}


function unixTime(dateTime, onlyDate) {
    dateTime = dateTime || new Date();

    if (onlyDate) {
        dateTime = new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate());
    }

    return Math.floor(dateTime.getTime() / 1000);
}

function exactUnixTime(dateTime) {
    dateTime = dateTime || new Date();
    return dateTime.getTime();
}

function parseUnixTime(unixTime) {
    return new Date(unixTime * 1000);
}

function addMonths(dateTime, months) {
    if (!typeUtil.isDate(dateTime)) {
        months = dateTime;
        dateTime = new Date();
    }

    dateTime.setMonth(dateTime.getMonth() + months);
    return dateTime;
}

function addDays(dateTime, days) {
    if (!typeUtil.isDate(dateTime)) {
        days = dateTime;
        dateTime = new Date();
    }

    dateTime.setDate(dateTime.getDate() + days);

    return dateTime;
}

function addHours(dateTime, hours) {
    if (!typeUtil.isDate(dateTime)) {
        hours = dateTime;
        dateTime = new Date();
    }

    dateTime.setHours(dateTime.getHours() + hours);

    return dateTime;
}

function addMinutes(dateTime, minutes) {
    if (!typeUtil.isDate(dateTime)) {
        minutes = dateTime;
        dateTime = new Date();
    }

    dateTime.setMinutes(dateTime.getMinutes() + minutes);

    return dateTime;
}

function addSeconds(dateTime, seconds) {
    if (!typeUtil.isDate(dateTime)) {
        seconds = dateTime;
        dateTime = new Date();
    }

    dateTime.setSeconds(dateTime.getSeconds() + seconds);

    return dateTime;
}

function getWeekName(dateTime) {
    dateTime = dateTime || new Date();
    return weekDay[dateTime.getDay()];
}

function format(dateTime, includeTime, splitChar) {
    if (typeUtil.isBool(dateTime)) {
        includeTime = dateTime;
        dateTime = new Date();
    } else if (typeUtil.isString(dateTime)) {
        try {
            dateTime = new Date(dateTime);
        }
        catch (e) {
            dateTime = new Date();
        }
    }

    if (typeUtil.isString(includeTime)) {
        splitChar = includeTime;
        includeTime = false;
    }

    includeTime = includeTime || false;

    splitChar = splitChar || '-';
    const template = '%s' + splitChar + '%s' + splitChar + '%s';

    dateTime = dateTime || new Date();

    const year = dateTime.getFullYear();
    const month = dateTime.getMonth() + 1;
    const day = dateTime.getDate();

    let result = util.format(template, year, _formatLength(month), _formatLength(day));

    if (includeTime) {
        const hour = dateTime.getHours();
        const minute = dateTime.getMinutes();
        const second = dateTime.getSeconds();

        let timePart = util.format('%s:%s:%s', _formatLength(hour), _formatLength(minute), _formatLength(second));

        result = util.format('%s %s', result, timePart);
    }

    return result;
}

function isoFormat(dateTime) {
    dateTime = dateTime || new Date();
    dateTime = new Date(dateTime.getTime() + dateTime.getTimezoneOffset() * 60 * 1000)

    return util.format('%s-%s-%sT%s:%s:%sZ',
        dateTime.getFullYear(),
        _formatLength(dateTime.getMonth() + 1),
        _formatLength(dateTime.getDate()),
        _formatLength(dateTime.getHours()),
        _formatLength(dateTime.getMinutes()),
        _formatLength(dateTime.getSeconds())
    );
}

module.exports = {
    unixTime,
    exactUnixTime,
    parseUnixTime,
    addDays,
    addHours,
    addMinutes,
    addSeconds,
    getWeekName,
    format,
    isoFormat
};