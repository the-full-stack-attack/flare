import { Model, DataTypes, Optional } from 'sequelize';
import database from '../index';
import User from './users';

// Attributes interface - what the model has
interface ConversationAttributes {
  id: number;
  user_id: number;
  prompt: string;
  response: string;
  createdAt: Date;
  updatedAt: Date;
}

// Creation attributes - what we need to create a new conversation
// The Optional utility type makes certain attributes optional for creation
interface ConversationCreationAttributes
  extends Optional<ConversationAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Model interface
interface ConversationModel
  extends Model<ConversationAttributes, ConversationCreationAttributes>,
    ConversationAttributes {}

const Conversation = database.define<ConversationModel>(
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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
    tableName: 'Conversations',
  }
);

Conversation.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Conversation, { foreignKey: 'user_id' });

export default Conversation;
