/*
 * User Object
 */

export interface IUser {
	id: number;
	username: string;
	firstname: string;
	lastname: string;
	token: string;
	auth: boolean;
}

export class User implements IUser {

	constructor(public id: number,
				public username: string,
				public firstname: string,
				public lastname: string,
				public token: string,
				public auth: boolean) {

	}

}
