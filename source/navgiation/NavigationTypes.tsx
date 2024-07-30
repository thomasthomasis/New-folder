export type RootStackParamList = {
    ProfileScreen: { restrictedView: boolean, userId: string }; // Example parameter for Profile screen
    Account: undefined;
    Home: undefined;
    AddExercise: undefined;
    LogWorkout: undefined;
    LogWorkoutCardio: { continuingWorkout:boolean, navigationScreen:string };
    LogWorkoutResistance: { continuingWorkout:boolean, navigationScreen:string };
    SubmitCompletion: {  levelUp:boolean, gainedXp:number, navigationScreen:string };
    SocialScreen: undefined;
    CreateGroup: { isClub:boolean };
    JoinGroup: undefined;
    GroupMembersSettings: { group:string };
    GroupSettings: { group:string };
    Group: { group:string };
    WorkoutDisplay: { specificWorkoutId:any, workoutType:string, generalWorkoutId:string };
    History: { group:string };
    AppSettings: undefined;
    ProfileSettings: undefined;
    AccountSettings: undefined;
    Feedback: undefined;
    EditResistanceExercise: { exercise:string };
    EditCardioExercise: { exercise:string };
    GroupEvents: { group:string };
    GroupEvent: { event:string };
    CreateGroupEvent: { group:string };
    EditGroupEvent: { eventId:string };
    PrivacyPolicy: undefined;
    TermsOfService: undefined;
    Subscription: undefined;
    Preferences: undefined;
    Statistics: { userId:string };
    ResistanceStats: { userId:string };
    CardioStats: { userId:string };
    ResistanceExerciseStats: { userId:string, exerciseId:string };
    CardioExerciseStats: { userId:string, exerciseId:string };
    // Add more screens as needed
  };