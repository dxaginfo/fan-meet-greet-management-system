import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database/connection';

interface MeetGreetBookingAttributes {
  id: string;
  eventId: string;
  fanId: string;
  bookingDate: Date;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  specialRequests?: string;
  checkInTime?: Date;
  checkOutTime?: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface MeetGreetBookingCreationAttributes extends Optional<MeetGreetBookingAttributes, 'id' | 'bookingDate' | 'createdAt' | 'updatedAt'> {}

class MeetGreetBooking extends Model<MeetGreetBookingAttributes, MeetGreetBookingCreationAttributes> implements MeetGreetBookingAttributes {
  public id!: string;
  public eventId!: string;
  public fanId!: string;
  public bookingDate!: Date;
  public status!: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  public specialRequests?: string;
  public checkInTime?: Date;
  public checkOutTime?: Date;
  public notes?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MeetGreetBooking.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    eventId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'events',
        key: 'id',
      },
    },
    fanId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    bookingDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
      allowNull: false,
      defaultValue: 'pending',
    },
    specialRequests: {
      type: DataTypes.TEXT,
    },
    checkInTime: {
      type: DataTypes.DATE,
    },
    checkOutTime: {
      type: DataTypes.DATE,
    },
    notes: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: 'MeetGreetBooking',
    tableName: 'meet_greet_bookings',
    indexes: [
      {
        name: 'idx_booking_event',
        fields: ['eventId'],
      },
      {
        name: 'idx_booking_fan',
        fields: ['fanId'],
      },
      {
        name: 'idx_booking_status',
        fields: ['status'],
      },
    ],
  }
);

export default MeetGreetBooking;