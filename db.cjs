const fs = require('fs');
const {faker} = require('@faker-js/faker');
const usedNumbers = new Set(); // To store unique personal and tax numbers

// Helper function to generate a unique number
function generateUniqueNumber() {
    let number;
    do {
        number = faker.number.int({
            min: 10000000000,
            max: 99999999999
        }).toString();
    } while (usedNumbers.has(number));
    usedNumbers.add(number); // Mark the number as used
    return number;
}

// Generating users with unique personal numbers
const users = Array.from({ length: 500_000 }, () => ({
    personalNumber: generateUniqueNumber(),
    name: faker.person.firstName(),
    surname: faker.person.lastName(),
    status: faker.helpers.arrayElement(['მოქმედი', 'უარყოფილი', 'გამოყენებული', 'ვადაგასული', 'გაუქმებული', 'დახურული']),
    phoneNumber: faker.phone.number()
}));

// Generating companies with unique tax numbers and legal person tax numbers
const companies = Array.from({ length: 500_000 }, () => ({
    clientName: faker.company.name(),
    taxNumber: generateUniqueNumber(),
    legPerson: faker.person.firstName() + " " + faker.person.firstName(),
    legPersonTax: generateUniqueNumber(),
    status: faker.helpers.arrayElement(['მოქმედი', 'უარყოფილი', 'გამოყენებული', 'ვადაგასული', 'გაუქმებული', 'დახურული']),
    phoneNumber: faker.phone.number()
}));

const sandro = {personal_number: 38001046165, name: "სანდრო", surname: 'ღუღუნიშვილი', status: "მოქმედი", phone_number: 598414141}
users.unshift(sandro)
const data = { users, companies };

fs.writeFileSync('db.json', JSON.stringify(data, null, 2), 'utf-8');
console.log("Data has been written to db.json");