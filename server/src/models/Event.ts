import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database/connection';

interface EventAttributes {
  id: string;
  title: string;
  description: string;
  eventDate: Date;
  startTime: string;
  endTime: string;
  venueName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  totalCapacity: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  imageUrl?: string;
  artistId: string;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface EventCreationAttributes extends Optional<EventAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Event extends Model<EventAttributes, EventCreationAttributes> implements EventAttributes {
  public id!: string;
  public title!: string;
  public description!: string;
  public eventDate!: Date;
  public startTime!: string;
  public endTime!: string;
  public venueName!: string;
  public address!: string;
  public city!: string;
  public state!: string;
  public zipCode!: string;
  public country!: string;
  public totalCapacity!: number;
  public status!: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  public imageUrl?: string;
  public artistId!: string;
  public createdBy!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Event.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    eventDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    venueName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalCapacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'in-progress', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'scheduled',
    },
    imageUrl: {
      type: DataTypes.STRING,
    },
    artistId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'artists',
        key: 'id',
      },
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Event',
    tableName: 'events',
    indexes: [
      {
        name: 'idx_events_status',
        fields: ['status'],
      },
      {
        name: 'idx_events_date',
        fields: ['eventDate'],
      },
      {
        name: 'idx_events_artist',
        fields: ['artistId'],
      },
    ],
  }
);

export default Event;