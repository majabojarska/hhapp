import { User, UserDecorated } from "../types";
import Color from "color";
import TextService from "@/common/services/TextService";
export default class UserService {
  static getInitials(user?: User) {
    if (user) {
      return user.firstname[0] + user.surname[0];
    } else return "AA";
  }

  static getDecorated(user: User): UserDecorated {
    const userDecorated: UserDecorated = {
      ...user,
      fullname: user.firstname + " " + user.surname,
      initials: UserService.getInitials(user),
      textColorClass: TextService.textColorClass(user.color)
    };
    return userDecorated;
  }
}
