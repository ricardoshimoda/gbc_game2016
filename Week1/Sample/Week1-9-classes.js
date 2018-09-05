"use strict"
class User {
    constructor(username, email, password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    register() {
        console.log(this.username + ' is now registered');
    }

    static countUser() {
        console.log('there are 2 users');
    }
}


class Member extends User {
    constructor(username, email, password, member, memberPackage) {
        super(username, email, password);
        this.package = memberPackage
    }

    getPackage() {
        console.log(this.username + " is subscribed to " + this.memberPackage);
    }

}

let bob = new User('bob', 'bob@hotmail.com', '12345');
bob.register();
User.countUser();

let mike = new Member('mike', 'bob@hotmail.com', '12345', 'standard');
mike.register();
mike.getPackage();
