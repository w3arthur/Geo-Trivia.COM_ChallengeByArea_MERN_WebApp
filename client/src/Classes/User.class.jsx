export default class User{
    name; email; role; accessToken; password;
    constructor (name, email, role, accessToken){
        console.log('::User ::Set\\Reset data');
        this.name = name;
        this.email = email;
        this.role = role;
        this.accessToken = accessToken;
    }
}

