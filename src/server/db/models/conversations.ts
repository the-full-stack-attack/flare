import { DataTypes } from 'sequelize';
import { database } from '../index';
import { User } from './users';

const Conversation = database.define(
  'Conversation',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    prompt: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    response: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tablename: 'Conversations',
  }
);

Conversation.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Conversation, { foreignKey: 'user_id' });
