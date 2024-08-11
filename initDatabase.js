const { sequelize, AuthCode } = require('./database');

const initializeDatabase = async () => {
    try {
        await sequelize.sync({ force: true }); // Drop and recreate tables
        
        // Insert initial data with new fields
        await AuthCode.create({
            code: process.env.INITIAL_CODE || '123456',
            used: false,
            used_date: null, // Set as null initially
            created_date: new Date() // Set current date and time
        });
        
        console.log('Database initialized with test code');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

module.exports = { initializeDatabase };
