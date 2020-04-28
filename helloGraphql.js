const express = require('express');
const { buildSchema } = require('graphql');
const graphqlHttp = require('express-graphql');


// String
// Int [Int]
// Float
// Boolean
// ID
const schema = buildSchema(`
  type Student {
    name: String
    age: Int
    adress: String
    sno: String
    classNo: Int
    guote(q : String): String
  }
  type Query {
    hello: String
    getStudent(sno: String!): Student
    queryStudent: [Student]
  }
`)

const dbData = {
  student: [
    {
      name: 'Leslie',
      age: 18,
      sno: '201310119000',
      adress: 'hubei',
      classNo: 11,
      guote ({ q }) {
        return `${this.classNo} class quote: ${q}`
      }
    },
    {
      name: 'Leo',
      age: 20,
      sno: '201310119001',
      adress: 'hongkong',
      classNo: 11
    }
  ]
}

const rootValue = {
  hello () {
    return 'hello world!'
  },
  getStudent ({ sno }) {
    return dbData.student.find(it => it.sno === sno)
  },
  queryStudent () {
    return dbData.student
  }
}

const app = express()

app.use('/graphql', graphqlHttp({
  schema,
  rootValue,
  graphiql: true
}))

app.listen(3000)
