import 'dotenv/config'
import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL
const sql = postgres(connectionString, {
  // Suppress PostgreSQL notices (like "relation already exists")
  onnotice: () => {}, // This will ignore all notices
  debug: false // Disable debug messages
})

export default sql