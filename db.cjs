const fs = require('fs.js');
const {faker} = require('@faker-js/faker');

const users = Array.from({length: 1_000_000}, () => ({
    personal_number: faker.number.int({
        min: 10000000000,
        max: 99999999999
    }).toString(),
    name: faker.person.firstName(),
    surname: faker.person.lastName(),
    status: faker.helpers.arrayElement(['მოქმედი', 'უარყოფილი', 'გამოყენებული', 'ვადაგასული', 'გაუქმებული', 'დახურული'])
}));

fs.writeFileSync('db.json', JSON.stringify({users}, null, 2));