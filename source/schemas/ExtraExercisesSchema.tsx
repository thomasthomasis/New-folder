import Realm from "realm";

export class ExtraExercises extends Realm.Object<ExtraExercises> {
    _id!: Realm.BSON.ObjectId;
    name?: string;
    type?: string;
    userId?: string;

  static schema: Realm.ObjectSchema = {
    name: 'ExtraExercises',
    properties: {
        _id: 'objectId',
        name: 'string?',
        type: 'string?',
        userId: 'string?',
    },
  primaryKey: '_id',
}
};

