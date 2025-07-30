import sql from './db.js'

//test db connection

async function testConnection() {
  try {
    const result = await sql`SELECT 1 as connected`
    if (result && result[0] && result[0].connected === 1) {
      console.log('Database connection successful!')
    } else {
      console.log('Database connection failed!')
    }
  } catch (err) {
    console.error('Database connection error:', err)
  } finally {
    await sql.end({ timeout: 5 })
  }
}

testConnection()