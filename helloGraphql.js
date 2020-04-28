const express = require('express');
const { buildSchema } = require('graphql');
const graphqlHttp = require('express-graphql');
const mysql = require('mysql');


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'my_db'
})

// String
// Int [Int]
// Float
// Boolean
// ID
const schema = buildSchema(`
  type Student {
    name: String
    age: Int
    address: String
    sno: String
    classNo: Int
    guote(q : String): String
  }
  input StudentInput {
    name: String
    age: Int
    address: String
    sno: String
    classNo: Int
  }
  type Mutation {
    createStudent(input: StudentInput): Student
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
      address: 'hubei',
      classNo: 11,
      guote ({ q }) {
        return `${this.classNo} class quote: ${q}`
      }
    },
    {
      name: 'Leo',
      age: 20,
      sno: '201310119001',
      address: 'hongkong',
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
  },
  createStudent ({ input }) {
    // sql
    // return new Promise((resolve, reject) => {
    //   pool.query('insert into Student set ?', input, (err) => {
    //     if (err) {
    //       return
    //     }
    //     resolve(input)
    //   })
    // })
    dbData.student.push(input)
    return input
  }
}

const middleWare = (rep, res, next) => {
  // rep.headers.cooke.indexOf('auth') === -1
  if (rep.url.indexOf('/graphql') === -1) {
    return res.send(JSON.stringify({
      error: '403!'
    }))
  }
  next()
}

const app = express()

app.use(middleWare)

app.use('/graphql', graphqlHttp({
  schema,
  rootValue,
  graphiql: true
}))

app.use(express.static('public'))

app.listen(3000)
