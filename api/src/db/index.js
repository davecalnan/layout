import { MongoClient } from 'mongodb'

const db = {
  connect: async () => {
    const client = new MongoClient(process.env.MONGO_URL, { useNewUrlParser: true })
    const connection = await client.connect()

    process.on('SIGINT', () => {
      connection.close(() => {
        console.log('\nMongoDB disconnected on app termination.')
        process.exit(0)
      })
    })

    return connection
  }
}

export default db
