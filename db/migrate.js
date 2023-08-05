import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { dbConnect } from './connect.js';


(async () => {

    try {

        const args = await migrate(dbConnect, { migrationsFolder: './drizzle' })

        console.log('DONE', JSON.stringify(args, null, 2))
    }
    catch (err) {

        console.error(err);
    }
})()
