import 'dotenv/config'
import postgres from 'postgres'

// Database connection config
const connectionString = process.env.DATABASE_URL
const sql = postgres(connectionString, {
 
  onnotice: () => {}, 
  debug: false // Disable debug messages
})

export default sql