const Sequelize = require('sezuelize');
const database = require('../index.ts');

const User_Event = database.define('User_Event', {
    user_attended: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    private_review: { type: Sequelize.STRING(250) },
    public_review: { type: Sequelize.STRING(250) },

    
})