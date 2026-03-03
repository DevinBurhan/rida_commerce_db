import Decimal from "decimal.js";

/**
 * Use Decimal.js for all monetary calculations; convert to number only when storing/returning.
 */
export function add(...values: (number | string)[]): number {
  return values.reduce<Decimal>((acc, v) => acc.plus(v), new Decimal(0)).toNumber();
}

export function sub(a: number | string, b: number | string): number {
  return new Decimal(a).minus(b).toNumber();
}

export function isZero(value: number | string): boolean {
  return new Decimal(value).isZero();
}

export function eq(a: number | string, b: number | string): boolean {
  return new Decimal(a).eq(b);
}

export function sumNumbers(values: number[]): number {
  return values.reduce<Decimal>((acc, v) => acc.plus(v), new Decimal(0)).toNumber();
}
