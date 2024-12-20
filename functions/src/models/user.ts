export class User {
  id: string;
  displayName: string;
  email: string;
  password: string;
  phone: string;
  constructor(id:string, displayName: string, email: string, password: string, phone: string) {
    this.id = id;
    this.displayName = displayName;
    this.email = email;
    this.password = password;
    this.phone = phone;
  }
}