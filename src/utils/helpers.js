// @flow
import namor from 'namor';
import moment from 'moment';
import _ from 'underscore';

/**
 * Capitalize a string
 * @param {String} str
 * @returns {String}
 */
export function capitalize(str: string): string {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

export function camelize(str: string): string {
    return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
}

export function kFormatter(value: integer): string {
    if (!value) return 0;

    const COUNT_FORMATS =
    [
        { // 0 - 999
            letter: '',
            limit: 1e3
        },
        { // 1,000 - 999,999
            letter: 'K',
            limit: 1e6
        },
        { // 1,000,000 - 999,999,999
            letter: 'M',
            limit: 1e9
        },
        { // 1,000,000,000 - 999,999,999,999
            letter: 'B',
            limit: 1e12
        },
        { // 1,000,000,000,000 - 999,999,999,999,999
            letter: 'T',
            limit: 1e15
        }
    ];

    const format = COUNT_FORMATS.find(format => (value < format.limit));

    value = (1000 * value / format.limit);
    value = Math.round(value * 10) / 10; // keep one decimal number, only if needed

    return (value + format.letter).toString();
}

export const isValidEmail = (str: string): boolean => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(str);

const range = len => {
    const arr = [];

    for (let i = 0; i < len; i++) {
        arr.push(i);
    }

    return arr;
};

export const getTextColor = text => {
    let color = '';

    switch (text.toLowerCase()) {
        case 'base':
            color = 'color-badge-green';
            break;
        case 'manager':
            color = 'color-badge-orange';
            break;
        case 'co':
            color = 'text-danger';
            break;
        default:
            color = 'text-dark';
            break;
    }

    return <span className={color}>{text}</span>;
};

export const blockInvalidChar = e => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();

const newRecord = () => {
    return {
        identifier: namor.generate({ words: 1, numbers: 1 }),
        alertType: namor.generate({ words: 2, numbers: 0 }),
        date: new Date(new Date(2012, 0, 1).getTime() + Math.random() * (new Date().getTime() - new Date(2012, 0, 1).getTime())),
        broker: namor.generate({ words: 2, numbers: 0 }),
        ticker: namor.generate({ words: 1, numbers: 0 }),
        quantity: Math.floor(Math.random() * 100),
        client: namor.generate({ words: 1, numbers: 1 }),
        escalation: namor.generate({ words: 1, numbers: 0 }),
        assigned: namor.generate({ words: 2, numbers: 0 }),
        status: namor.generate({ words: 2, numbers: 0 })
    };
};

export function makeData(...lens) {
    const makeDataLevel = (depth = 0) => {
        const len = lens[depth];

        return range(len).map(d => {
            return {
                ...newRecord(),
                subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined
            };
        });
    };

    return makeDataLevel();
}

export const UTCTOUK_DATE = date => {
    return moment
        .utc(date, 'YYYY-MM-DDTHH:mm:ss')
        .clone()
        .tz('Europe/London')
        .format('YYYY-MM-DDTHH:mm:ss');
};

export const UTCTOUK_TIME = time => {
    return moment
        .utc(
        `${moment(new Date()).format('YYYY-MM-DD')}T${time}`,
        'YYYY-MM-DDTHH:mm:ss'
        )
        .clone()
        .tz('Europe/London')
        .format('YYYY-MM-DDTHH:mm:ss');
};

export const DATE_TO_UTC = (date, format = 'YYYY-MM-DDTHH:mm:ss') => {
    return moment.tz(date, 'Europe/London').utc().format(format);
};

export const REMOVE_UTC_CHAR = date => {
    const char = 'T';

    return date.replace(char, ' ');
};

export const pluralIdentifier = num => {
    return parseInt(num) > 1 ? 's' : '';
};

export const percentageCalculator = (num, outOff) => {
    if (outOff > 0) return (parseInt(num) * 100) / parseInt(outOff);

    return 0;
};

export const roundPercentages = (numArr, target) => {
    const off = target - _.reduce(numArr, function(acc, x) { return acc + Math.round(x); }, 0);

    return _.chain(numArr)
        .sortBy(function(x) { return Math.round(x) - x; })
        .map(function(x, i) { return Math.round(x) + (off > i) - (i >= (numArr.length + off)); })
        .value();
};

export const getDatesBetweenDates = (startDate, endDate) => {
    const now = startDate.clone();
    const dates = [];

    while (now.isSameOrBefore(endDate)) {
        dates.push(now.format('MM-DD-YYYY'));
        now.add(1, 'days');
    }

    return dates;
};

export const setDateRangeLocal = (dateFrom, dateTo, key) => {
    localStorage.setItem(key, JSON.stringify({
        from: dateFrom,
        to: dateTo
    }));
};

export const getDateRangeLocal = (key) => {
    return JSON.parse(localStorage.getItem(key));
};

export const numberWithCommas = (value) => {
    return value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : value;
};

export const truncateText = (str, n) => {
    return (str.length > n) ? str.substr(0, n - 1) + '...' : str;
};
