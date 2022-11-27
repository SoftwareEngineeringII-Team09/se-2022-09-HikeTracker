"user strict";

class User {
  static tableName = "User";

  constructor(userId, email, salt, password, verificationCode, firstname, lastname, mobile, role, active) {
    this.userId = userId;
    this.email = email;
    this.salt = salt;
    this.password = password;
    this.verificationCode = verificationCode;
    this.firstname = firstname;
    this.lastname = lastname;
    this.mobile = mobile;
    this.role = role;
    this.active = active;
  }
}

module.exports = User;