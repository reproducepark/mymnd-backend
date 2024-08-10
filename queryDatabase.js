const { sequelize, AuthCode } = require('./database');

const queryDatabase = async () => {
    try {
        await sequelize.sync();
        // Fetch all records from the AuthCode table
        const codes = await AuthCode.findAll();
        
        // Log the results
        console.log('Stored codes:', codes.map(code => code.toJSON()));
    } catch (error) {
        console.error('Error querying database:', error);
    }
};

queryDatabase();
