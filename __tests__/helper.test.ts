/**
 * Unit tests for src/wait.ts
 */

import { intoArgs } from '../src/helper';
import { expect } from '@jest/globals';

describe('helper.ts', () => {
  describe('intoArgs', () => {
    (
      [
        ['show', ['show']],
        ['add foo 12.3', ['add', 'foo', '12.3']],
        [
          'add name --tag "foo: bar" 12.3',
          ['add', 'name', '--tag', 'foo: bar', '12.3'],
        ],
      ] as [string, string[]][]
    ).forEach(([input, output]: [string, string[]]) => {
      it(`should parse command ${input}`, () => {
        const res = intoArgs(input);
        expect(res).toEqual(output);
      });
    });
  });
});
