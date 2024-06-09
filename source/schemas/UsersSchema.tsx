import Realm from "realm";

export class Users extends Realm.Object<Users> {
  _id!: Realm.BSON.ObjectId;
  dateCreated?: Date;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  selectedTitle?: string;
  titles!: Realm.List<string>;
  userId!: string;
  username?: string;

  static schema: Realm.ObjectSchema = {
    name: 'Users',
  properties: {
    _id: 'objectId',
    dateCreated: 'date?',
    firstName: 'string?',
    lastName: 'string?',
    profilePicture: 'string?',
    selectedTitle: 'string?',
    titles: 'string[]',
    userId: 'string',
    username: 'string?',
  },
  primaryKey: '_id',
}
};

