"user strict";

class User {
  static tableName = "User";
  
  constructor(userId, email, firstName, lastName, mobile, role, active) {
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.mobile = mobile;
    this.role = role;
    this.active = active;
  }
}

module.exports = User;
