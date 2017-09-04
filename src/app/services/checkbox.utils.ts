export class CheckboxUtils {

  static toFormFormat<T>(availableValues: T[], currentValues: T[]) {
    return availableValues.map(c => currentValues ? currentValues.includes(c) : false)
  }

  static fromFormFormat<T>(availableValues: T[], currentValues: boolean[]) {
    return currentValues
      .map((checked, i) => ([checked, i]))
      .filter(([checked, i]: [boolean, number]) => checked)
      .map(([checked, i]: [boolean, number]) => availableValues[i])
  }

}
