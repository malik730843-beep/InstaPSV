import { deleteCache, redis } from './src/lib/redis';
import fs from 'fs';
import path from 'path';

// Manual .env loading
try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
        let [key, ...valParts] = line.split('=');
        if (key && valParts.length > 0) {
            let value = valParts.join('=').trim();
            // Strip quotes
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            process.env[key.trim()] = value;
        }
    });
} catch (e) {
    console.error("Could not load .env.local", e);
}

// Re-import to ensure env vars are picked up by the redis module initialization?
// No, the 'redis' export is initialized at module load time.
// Since we import 'redis' at the top, it runs BEFORE we parse env. 
// THIS IS A PROBLEM.
// We need to move the import OR manual initialization.

async function run() {
    console.log("Loading Env and Clearing cache...");

    // We cannot use the exported 'redis' client because it was initialized before env vars were loaded.
    // We must instantiate a NEW client or rely on the global process.env being set if we were to delay import. 
    // But ES imports are hoisted.

    // Solution: Use dynamic import or just instantiate Redis here directly using the values we just read.
    const { Redis } = require('@upstash/redis');

    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    console.log("URL:", redisUrl ? redisUrl.substring(0, 10) + "..." : "MISSING");
    console.log("Token:", redisToken ? redisToken.substring(0, 5) + "..." : "MISSING");

    if (!redisUrl || !redisToken) {
        console.error("Missing Redis Env Vars!");
        process.exit(1);
    }

    const client = new Redis({ url: redisUrl, token: redisToken });

    const key = 'profile:sumaiyyabukhshofficial';
    console.log(`Deleting key: ${key}`);
    await client.del(key);

    console.log("Cache cleared!");
    process.exit(0);
}

run();
