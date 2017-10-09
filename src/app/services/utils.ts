export class Utils {

  static checkboxToFormFormat<T>(availableValues: T[], currentValues: T[]) {
    return availableValues.map(c => currentValues ? currentValues.includes(c) : false)
  }

  static checkboxFromFormFormat<T>(availableValues: T[], currentValues: boolean[]) {
    return currentValues
      .map((checked, i) => ([checked, i]))
      .filter(([checked, i]: [boolean, number]) => checked)
      .map(([checked, i]: [boolean, number]) => availableValues[i])
  }

  static getYearRange() {
    const startYear = new Date().getFullYear();
    return '' + startYear + ':' + (startYear + 10);
  }

}
