import bcrypt from "bcryptjs";

export class AuthService {
  static async hashPassword(password) {
    return bcrypt.hash(password, 12);
  }
  static async comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }
}
