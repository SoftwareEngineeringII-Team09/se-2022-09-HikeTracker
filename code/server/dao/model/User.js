"user strict";

class User {
  static tableName = "User";

  constructor(userId, email, firstName, lastName, mobile, role, active) {
    this.user_id = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.mobile = mobile;
    this.role = role;
    this.active = active;
    this.email = email;
  }
}

module.exports = User;
