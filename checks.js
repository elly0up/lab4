const assert = require('assert');
const { query, select, filterIn } = require('./index.js');

const collection = [
    { name: 'Alice', age: 25, city: 'Kyiv' },
    { name: 'Bob', age: 30, city: 'Lviv' },
    { name: 'Charlie', age: 25, city: 'Kyiv' }
];

const copyResult = query(collection);
assert.deepStrictEqual(copyResult, collection);
assert.notStrictEqual(copyResult, collection);

const filteredByAge = query(
    collection,
    filterIn('age', [25])
);
assert.strictEqual(filteredByAge.length, 2);
assert.deepStrictEqual(
    filteredByAge,
    [
        { name: 'Alice', age: 25, city: 'Kyiv' },
        { name: 'Charlie', age: 25, city: 'Kyiv' }
    ]
);

const selectedNames = query(
    collection,
    select('name', 'country')
);
assert.deepStrictEqual(
    selectedNames,
    [
        { name: 'Alice' },
        { name: 'Bob' },
        { name: 'Charlie' }
    ]
);

const intersectSelect = query(
    collection,
    select('name', 'age'),
    select('age', 'city')
);
assert.deepStrictEqual(
    intersectSelect,
    [
        { age: 25 },
        { age: 30 },
        { age: 25 }
    ]
);

const intersectFilter = query(
    collection,
    filterIn('age', [25, 30]),
    filterIn('age', [25])
);
assert.deepStrictEqual(
    intersectFilter,
    [
        { name: 'Alice', age: 25, city: 'Kyiv' },
        { name: 'Charlie', age: 25, city: 'Kyiv' }
    ]
);

const filterThenSelect = query(
    collection,
    filterIn('city', ['Kyiv']),
    select('name', 'age')
);
assert.deepStrictEqual(
    filterThenSelect,
    [
        { name: 'Alice', age: 25 },
        { name: 'Charlie', age: 25 }
    ]
);

console.log('All tests passed!');
