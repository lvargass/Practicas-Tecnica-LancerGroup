export interface IUser {
    // location: {};
    userData: {
        token: string;
        User: {
            custumerName: string,
            profilePic: string,
            userEmail: string,
            phoneNumber: string,
            status: string
        }
    }
}
