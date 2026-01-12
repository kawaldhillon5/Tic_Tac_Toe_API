import cron from 'node-cron';
import * as DbService from '../services/dbService.js';

cron.schedule('0 0 * * *', async () => {
    console.log('Running database cleanup...');
    const deletedCount = await DbService.deleteOldGames(24);
    console.log(`Cleanup complete. Removed ${deletedCount} old games.`);
});