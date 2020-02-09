import Color from "color";

export default class TextService {
  public static textColorClass(color: string) {
    return Color(color).isLight() ? "black--text" : "white--text";
  }
}
