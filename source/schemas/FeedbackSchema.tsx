import Realm from "realm";

export class Feedback extends Realm.Object<Feedback> {
  _id!: Realm.BSON.ObjectId;
  feedback?: string;
  rating?: string;

  static schema: Realm.ObjectSchema = {
    name: 'Feedback',
  properties: {
    _id: 'objectId',
    feedback: 'string?',
    rating: 'string?',
   
  },
  primaryKey: '_id',
}
};

