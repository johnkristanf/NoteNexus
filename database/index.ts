import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const client = postgres(process.env.DATABASE_URL!, {
    // optional config
    max: 1, // good default for serverless
})

// Pass the client to drizzle
export const db = drizzle(client)

// ONLY USE THIS FOR SEEDING
async function main() {}

main()
