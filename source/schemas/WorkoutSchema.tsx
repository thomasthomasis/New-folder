import Realm, {BSON} from 'realm';

export class Workouts extends Realm.Object<Workouts> {
  _id!: Realm.BSON.ObjectId;
  dateCreated?: Date;
  userId!: string;
  workoutId!: Realm.BSON.ObjectId;
  workoutType?: string;

  static schema: Realm.ObjectSchema = {
    name: 'Workouts',
    properties: {
      _id: 'objectId',
      dateCreated: 'date?',
      userId: 'string',
      workoutId: 'objectId',
      workoutType: 'string?',
    },
    primaryKey: '_id',
  };
}
