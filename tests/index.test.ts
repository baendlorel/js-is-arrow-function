import { describe, expect, jest, test } from '@jest/globals';
import isArrowFunction from '../src';
import { green } from './color';

describe('EventBus class', () => {
  test(`false:function () {}`, () => expect(isArrowFunction(function () {})).toBe(false));

  test(`throw error:null`, () => expect(() => isArrowFunction(null)).toThrow('is not a function'));

  test(`true:(a, b) => a * b)`, () => expect(isArrowFunction((a, b) => a * b)).toBe(true));

  test(`true:() => 42`, () => expect(isArrowFunction(() => 42)).toBe(true));

  test(`true:(x) => x * x`, () => expect(isArrowFunction((x) => x * x)).toBe(true));

  test(`true:(x) => () => x * x`, () => expect(isArrowFunction((x) => () => x * x)).toBe(true));
});
