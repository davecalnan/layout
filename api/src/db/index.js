import { MongoClient } from 'mongodb'

const url = 'mongodb://localhost:27017'

const db = {
  connect: async () => {
    const client = new MongoClient(url, { useNewUrlParser: true })
    const connection = await client.connect()

    process.on('SIGINT', () => {
      connection.close(() => {
        console.log('MongoDB disconnected on app termination.')
        process.exit(0)
      })
    })

    return connection
  }
}

export default db
