// @flow
import namor from 'namor';

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
