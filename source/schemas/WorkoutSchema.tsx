import Realm, {BSON} from 'realm';

export class Workouts extends Realm.Object<Workouts> {
  _id!: Realm.BSON.ObjectId;
  dateCreated?: Date;
  userId!: string;
  userStatus?: string;
  workoutId!: Realm.BSON.ObjectId;
  workoutType?: string;

  static schema: Realm.ObjectSchema = {
    name: 'Workouts',
    properties: {
      _id: 'objectId',
      dateCreated: 'date?',
      userId: 'string',
      userStatus: 'string?',
      workoutId: 'objectId',
      workoutType: 'string?',
    },
    primaryKey: '_id',
  };
}
