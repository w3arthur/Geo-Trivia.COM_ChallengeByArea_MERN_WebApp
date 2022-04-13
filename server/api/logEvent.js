
const { format } = require('date-fns');
const { v4: uuid } = require('uuid');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logsPath = path.join(__dirname, '..', 'logs');
const dateTime = `${format(new Date(), 'yyyy/MM/dd HH:mm:ss')}`;

const logEvents = async (message, logName) => {
    try {
        const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
        if (!fs.existsSync( logsPath ))  await fsPromises.mkdir( logsPath );
        await fsPromises.appendFile(path.join(logsPath, logName), logItem);
    } catch (err) { console.log('file error' + err); }
}

module.exports = {logEvents, dateTime};