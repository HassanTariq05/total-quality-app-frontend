import { faker } from '@faker-js/faker'

// Set a fixed seed for consistent data generation
faker.seed(67890)

export const organizations = Array.from({ length: 500 }, () => {
  const name = faker.person.fullName()
  return {
    id: faker.string.uuid(),
    name,
    email: faker.internet.email({}).toLocaleLowerCase(),
    phoneNumber: faker.phone.number({ style: 'international' }),
    status: faker.helpers.arrayElement([
      'active',
      'inactive',
      'invited',
      'suspended',
    ]),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }
})
