import {ICollectionNames} from "../../interfaces/Accounts";

/**
 @link https://github.com/asifmai/bot-nike-register-phone-verification/blob/master/bot.js
 @link https://github.com/JaveedYara72/Sneaker-Bot/blob/main/gmail.js
 **/

export default class Account {
    readonly username: string;
    readonly password: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly gender: string;
    readonly birthday: {
        day: string;
        month: string;
        year: string;
    };

    constructor(account: ICollectionNames, gender: string ) {
        // var username = user_data.emailVal1.slice(0,-10) + '691253';
        this.username = `${account.firstName}${account.lastName}2021`.toLocaleLowerCase();
        this.password = account.password;
        this.firstName = account.firstName;
        this.lastName = account.lastName;
        this.gender = gender;
        this.birthday = {
            day: '5',
            month: '6',
            year: '1983'
        }
    }

    public toJSON() {
        return {
            username: this.username,
            password: this.password,
            firstName: this.firstName,
            lastName: this.lastName,
            gender: this.gender,
            birthday: this.birthday
        }
    }
}
