function camelize(str) {
    return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
}

const columns = [
    'Identifier',
    'Alert Type',
    'Date',
    'Broker',
    'Ticker',
    'Book',
    'Quantity',
    'Client',
    'Escalation',
    'Assigned',
    'Status'
];

const data = [{
    id: 1,
    identifier: 'MUA312',
    alertType: 'Insider Trading',
    date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
    broker: 'Peter Davidson',
    ticker: 'BP',
    book: 'Book 1',
    quantity: 12,
    client: 'Client 1',
    escalation: 'Base',
    assigned: 'Mark Thomson',
    status: 'Open',
    detail: '/alert/MUA312'
},
{
    id: 2,
    identifier: 'MUA313',
    alertType: 'Insider Trading',
    date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
    broker: 'Peter Davidson',
    ticker: 'BP',
    book: 'Book 2',
    quantity: 11,
    client: 'Client 1',
    escalation: 'CO',
    assigned: 'Mark Thomson',
    status: 'In Review',
    detail: '/alert/MUA312'
},
{
    id: 3,
    identifier: 'MUA314',
    alertType: 'Insider Trading',
    date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
    broker: 'Peter Davidson',
    ticker: 'BP',
    book: 'Book 2',
    quantity: 89,
    client: 'Client 1',
    escalation: 'CO',
    assigned: 'Mark Thomson',
    status: 'Resolved',
    detail: '/alert/MUA312'
},
{
    id: 4,
    identifier: 'MUA315',
    alertType: 'Insider Trading',
    date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
    broker: 'Peter Davidson',
    ticker: 'BP',
    book: 'Book 2',
    quantity: 93,
    client: 'Client 1',
    escalation: 'Manager',
    assigned: 'Mark Thomson',
    status: 'In Review',
    detail: '/alert/MUA312'
},
{
    id: 5,
    identifier: 'MUA316',
    alertType: 'Insider Trading',
    date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
    broker: 'Jeff Smith',
    ticker: 'OCDO',
    book: 'Book 3',
    quantity: 89,
    client: 'Client 3',
    escalation: 'Manager',
    assigned: 'Mark Thomson',
    status: 'Resolved',
    detail: '/alert/MUA312'
},
{
    id: 6,
    identifier: 'MUA317',
    alertType: 'Insider Trading',
    date: new Date(new Date(2021, 4, 7).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 7).getTime())),
    broker: 'Paul Herbert',
    ticker: 'BP',
    book: 'Book 4',
    quantity: 89,
    client: 'Client 2',
    escalation: 'Base',
    assigned: 'Mark Thomson',
    status: 'Archived',
    detail: '/alert/MUA312'
}];

const filterColumns = {};

columns.forEach(col => {
    const camelizedColumn = camelize(col);
    const excludedKeys = ['date', 'quantity'];
    const initialValue = !excludedKeys.includes(camelizedColumn) ? ['Select All'] : [];

    filterColumns[camelizedColumn] = initialValue;

    data.map(record => {
        const value = record[camelizedColumn];

        if (!filterColumns[camelizedColumn].includes(value) && !excludedKeys.includes(camelizedColumn)) filterColumns[camelizedColumn].push(record[camelizedColumn]);
    });
});

console.log(filterColumns);
