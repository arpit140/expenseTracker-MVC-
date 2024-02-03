const sequelize = require('../util/db');
const Sequelize = require('sequelize');
const uuid = require('uuid');

const forgotPasswordReq = sequelize.define(
    "forgotPasswordReq",{
        id:{
            type:Sequelize.UUID,
            primaryKey:true,
            defaultValue:uuid.v4(),
        },
        isactive: {
            type:Sequelize.BOOLEAN,
            defaultValue:true,
        }
    }
)

module.exports = forgotPasswordReq;