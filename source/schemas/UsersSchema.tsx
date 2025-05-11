import Realm from 'realm';

export class Users extends Realm.Object<Users> {
  _id!: Realm.BSON.ObjectId;
  dateCreated?: Date;
  favouriteExercises?: Realm.List<string>;
  firstName?: string;
  lastName?: string;
  preferences?: Realm.List<string>;
  profilePicture?: string;
  selectedTitle?: string;
  status?: string;
  titles!: Realm.List<string>;
  userId!: string;
  username?: string;

  static schema: Realm.ObjectSchema = {
    name: 'Users',
    properties: {
      _id: 'objectId',
      dateCreated: 'date?',
      favouriteExercises: 'string[]',
      firstName: 'string?',
      lastName: 'string?',
      preferences: 'string[]',
      profilePicture: 'string?',
      selectedTitle: 'string?',
      status: 'string?',
      titles: 'string[]',
      userId: 'string',
      username: 'string?',
    },
    primaryKey: '_id',
  };
}
