const Sequelize = require('sequelize');
const sequelize = require('../util/db');

const expanse = sequelize.define("expanse",{
    name:{
        type: Sequelize.STRING,
        allowNull:false
    },
    quantity:{
        type: Sequelize.INTEGER,
        allowNull:false,
    },
    amount:{
        type:Sequelize.INTEGER,
        allowNull:false,
    },
    userId:{
        type: Sequelize.INTEGER,
        allowNull:false,
    }
})

module.exports = expanse;