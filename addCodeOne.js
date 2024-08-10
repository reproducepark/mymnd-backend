const readline = require('readline');
const { sequelize, AuthCode } = require('./database');

// Create an interface for reading input from the console
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const addCodeToDatabase = async (code) => {
    try {
        await sequelize.sync();
        // Add new record to the AuthCode table
        await AuthCode.create({
            code: code,
            // used field will use its default value (false)
            used_date: null, // Optionally set to null initially
            created_date: new Date() // Set current date and time
        });
        console.log('Code added to the database');
    } catch (error) {
        console.error('Error adding code to database:', error);
    }
};

// Prompt user for input
const promptUser = () => {
    rl.question('Enter the code: ', async (code) => {
        await addCodeToDatabase(code);
        rl.close(); // Close the readline interface
    });
};

promptUser();