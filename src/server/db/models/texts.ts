import Sequelize from 'sequelize';
import database from '../index';
import User from './users';

const Text = database.define('Text', {
    content: { type: Sequelize.STRING},
    isEmail: { type: Sequelize.BOOLEAN, defaultValue: true, },
    user_id: { type: Sequelize.INTEGER, },
    created_at: { type: Sequelize.DATE, },
});

Text.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Text, { foreignKey: 'user_id' });

export default Text;