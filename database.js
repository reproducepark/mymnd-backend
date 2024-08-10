// database.js
const { DataTypes, Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database/database.sqlite',
});

// Define the AuthCode model
const AuthCode = sequelize.define(
    'AuthCode',
    {
        code: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        used: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        used_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        created_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW, // Automatically set to the current date/time when created
        }
    },
    {
        tableName: 'AuthCodes',
        timestamps: false, // Disable automatic timestamp fields like `createdAt` and `updatedAt`
    }
);

module.exports = { sequelize, AuthCode };