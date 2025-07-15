import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

export const db = drizzle(process.env.DATABASE_URL!)

// ONLY USE THIS FOR SEEDING
async function main() {}

main()
