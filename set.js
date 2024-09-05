const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiMEFpZXVtSWpuOUw2aXhQNVg2aDZMbUkwSjN6c1FpbGY3dFRwM1h5SVEwZz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoicUJESVZ1YWxhT3RQb1daTWgrNmh2QktvQStZQW4yNkFralU1Q3ZBa0FSQT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIrRWFidlpheTQ1cVRoYkd2eFBHTklSSXREbjI2UksvRTRBVitIQ3lqR0ZBPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJwU0N2SVlUZWlQOC9WYlh6ZHYrYUo1TWE4b09qMFphc21WbGlEaWRaZ1hZPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InlJWm16VnZLRk9zTHVCZzFBZ2c5Yi94aDY4YzdxSzlqWFgxc2pESDlZVjA9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImMwSTJBYi9CWmlpMk9idVYzZ04zRDliRVA3WGsyV2pJUjdXMHFCczA3em89In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoieUsrS1BTUTVXTEg2dVIyRFJIZGlORG40T3h4NHFXY2JlcUVzNGJ3QUdFcz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoicVB2MDZ4c2dOUlJ5TFNXVzFURjFCQlA4WVRZZmhoU1dYb1M2TzYvbXcyMD0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InNRYkJTY3RoZjIzWGljLzBWM05pYlhzSGduZEdBTWQzTGZvNXFKS2NlWElhN3IxSkU1MDkvcGVFYzRCOVhPWUlYYitLQk1BMUNPWEpNNVNrVHZUbER3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6NjEsImFkdlNlY3JldEtleSI6ImtCc2JiUitUTEpQN0RDOStNbjF4NWhRWXZ0NUx6QVoxNUJVSTVUV3FGbFU9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbXSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjAsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJkZXZpY2VJZCI6Imc0LWRHcUlWVEt5LUtvY0tncHladnciLCJwaG9uZUlkIjoiMDNmYzEwM2EtZmFlNC00MGY0LWIxMjUtZmJiNjEyMjQxNDU4IiwiaWRlbnRpdHlJZCI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InpGL2pkL0FDRWwzenVUODNSZmtVeU03SWlqWT0ifSwicmVnaXN0ZXJlZCI6dHJ1ZSwiYmFja3VwVG9rZW4iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI1dldYSXVBVi9zbjEwOEtvc2tUMlVOUUJjVjQ9In0sInJlZ2lzdHJhdGlvbiI6e30sInBhaXJpbmdDb2RlIjoiVFJLVk1SRDciLCJtZSI6eyJpZCI6IjI2Mzc3MTM1NjA2NzozOEBzLndoYXRzYXBwLm5ldCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDSTZ3bXBFQ0VKZk81cllHR0FFZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5Ijoid0xJT0xXY2w4M3NwaEtuOFEzUHVteHFveEp6eFFRNFVhS1FtQ29sd2Vucz0iLCJhY2NvdW50U2lnbmF0dXJlIjoiTWFTLzBEL2hHVE0rbWdtTmtQc2lXaGNHNkYvMXFJQ3dvKytUSEtMLzF1dThPdXRCVUgwREFpaVdhRFo1S2ZNak4wWGZTeE03K05ZalBGN3dhOFhKRFE9PSIsImRldmljZVNpZ25hdHVyZSI6InA3TEl0Ym9rd0RyYnIvTUNtdXhnVGozZFVIUTBqbFFnSU9qK2xoamFkK0d1WVQ2czdPeVlVektBTmRPYi92cU9IaXdhSDVhVC8wVXQ5aFkrdzVGc0RnPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjYzNzcxMzU2MDY3OjM4QHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQmNDeURpMW5KZk43S1lTcC9FTno3cHNhcU1TYzhVRU9GR2lrSmdxSmNIcDcifX1dLCJwbGF0Zm9ybSI6ImFuZHJvaWQiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3MjU1NDAxMzJ9',
    PREFIXE: process.env.PREFIX || ".",
    OWNER_NAME: process.env.OWNER_NAME || "keithkeizzah",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "263771356067",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    BOT : process.env.BOT_NAME || '𝐀𝐋𝐏𝐇𝐀-𝐌𝐃',
    URL : process.env.BOT_MENU_LINKS || 'https://telegra.ph/file/0c351a67f1dffd1f34cf5.jpg',
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'yes',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '',
    CHATBOT : process.env.PM_CHATBOT || 'no',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'no',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway" : "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway",
   
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
