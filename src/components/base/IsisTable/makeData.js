import namor from 'namor';

const range = len => {
    const arr = [];

    for (let i = 0; i < len; i++) {
        arr.push(i);
    }

    return arr;
};

const newAlert = () => {
    const randStatus = ['open', 'in_review', 'resolved', 'archived', 'n/a'];

    return {
        word: namor.generate({ words: 1 }),
        alertID: `Alert ${Math.floor(Math.random() * 10)}`,
        status: randStatus[Math.floor(Math.random() * randStatus.length)]
    };
};

export default function makeData(...lens) {
    const makeDataLevel = (depth = 0) => {
        const len = lens[depth];

        return range(len).map(() => newAlert());
    };

    return makeDataLevel();
}
