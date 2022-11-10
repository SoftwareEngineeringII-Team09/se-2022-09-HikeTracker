"user strict";

class User {
  static tableName = "User";
  constructor(
    user_id,
    email,
    salt,
    password,
    firstname,
    lastname,
    mobile,
    role,
    active
  ) {
    this.user_id = user_id;
    this.email = email;
    this.salt = salt;
    this.password = password;
    this.firstname = firstname;
    this.lastname = lastname;
    this.mobile = mobile;
    this.role = role;
    this.active = active;
  }
}

module.exports = User;
