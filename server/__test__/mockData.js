import  faker from 'faker';

const mockData = {
  role: {
    title: faker.lorem.words(2),
    status: 'enable',
    description: faker.lorem.sentences()
  },
  accessRight: {
    title: faker.lorem.words(2),
    status: 'enable',
    description: faker.lorem.sentences()
  },
  user: {
    fname: faker.name.firstName(),
    lname: faker.name.lastName(),
    mname: faker.name.firstName(),
    password: faker.name.lastName(),
    email: faker.internet.email()
  },
  UserWithoutFirstname: {
    fname: null,
    lname: faker.name.lastName(),
    mname: faker.name.firstName(),
    password: faker.name.lastName(),
    email: faker.internet.email(),
    roleId: 3
  },
 UserWithoutlastname: {
    fname: faker.name.lastName(),
    lname: null,
    mname: faker.name.firstName(),
    password: faker.name.lastName(),
    email: faker.internet.email(),
    roleId: 3
  },
  UserWithoutPassword: {
    fname: faker.name.lastName(),
    lname: faker.name.lastName(),
    mname: faker.name.firstName(),
    password: null,
    email: faker.internet.email(),
    roleId: 3
  },
  UserWithoutEmail: {
    fname: faker.name.lastName(),
    lname: faker.name.lastName(),
    mname: faker.name.firstName(),
    password: faker.name.lastName(),
    email: '',
    roleId: 3
  },
  UserWithInvalidEmail: {
    fname: faker.name.lastName(),
    lname: faker.name.lastName(),
    mname: faker.name.firstName(),
    password: faker.name.lastName(),
    email: faker.name.lastName(),
    roleId: 3
  },
   UserWithInvalidName: {
    fname: faker.name.lastName(2),
    lname: faker.name.lastName(2),
    mname: faker.name.firstName(),
    password: faker.name.lastName(),
    email: faker.name.lastName(),
    roleId: 3
  },
  document: {
    title: faker.lorem.words(2), 
    synopsis: faker.lorem.sentences(),
    body: faker.lorem.sentences(),
    owner: 1,
    accessRight: 1
  },
  DocumentWithoutTitle:{
    title: null, 
    synopsis: faker.lorem.sentences(),
    body: faker.lorem.sentences(),
    owner: 1,
    accessRight: 1
  },
  DocumentWithoutBody: {
    title: faker.lorem.words(2), 
    synopsis: faker.lorem.sentences(),
    body: null,
    owner: 1,
    accessRight: 1
  },
  DocumentWithInvalidTitleBody : {
    title: faker.name.lastName(2), 
    synopsis: faker.lorem.sentences(),
    body: faker.name.lastName(2),
    owner: 1,
    accessRight: 1
  }

};

export default mockData;