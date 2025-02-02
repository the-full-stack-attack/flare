import { Model, DataTypes, Optional } from 'sequelize';
import database from '../index';
import User from './users';

// Define which attributes are optional during creation
interface Conversation_SessionAttributes {
  id: number;
  user_id: number;
  session_data: unknown;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Conversation_Session model interface that extends Sequelize's Model
interface Conversation_SessionCreationAttributes
  extends Optional<
    Conversation_SessionAttributes,
    'id' | 'createdAt' | 'updatedAt'
  > {}

// Define the Conversation_Session model interface that extends Sequelize's Model
interface Conversation_SessionModel
  extends Model<
      Conversation_SessionAttributes,
      Conversation_SessionCreationAttributes
    >,
    Conversation_SessionAttributes {}

// Create the model with Sequelize's define method
const Conversation_Session = database.define<Conversation_SessionModel>(
  'Conversation_Session',
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
    session_data: {
      type: DataTypes.JSON,
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
    tableName: 'Conversation_Sessions',
    timestamps: true,
  }
);

// Create associations: each conversation session belongs to a user
Conversation_Session.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Conversation_Session, { foreignKey: 'user_id' });

export default Conversation_Session;
