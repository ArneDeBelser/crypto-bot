import fs from 'fs';
import path from 'path';

const logToFile = (data) => {
    const logMessage = JSON.stringify(data);

    // Log to a file
    const filePath = path.join(getCurrentDirectory(), 'logs.txt');
    fs.appendFile(filePath, logMessage + '\n', (err) => {
        if (err) {
            console.error('Failed to write to log file:', err);
        }
    });
};

const getCurrentDirectory = () => {
    // Replace 'logs' with the actual directory where you want to store the log file
    return 'logs';
};

export { logToFile };
