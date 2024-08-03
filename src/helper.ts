import { parse } from 'shell-quote';
import type { ParseEntry } from 'shell-quote';

/**
 * Converts a command into an array of arg
 * @param command The command to pass to git-metrics.
 * @returns {string[]} The unescaped list of arg.
 */
export function intoArgs(command: string): string[] {
  return parse(command).filter(
    (input: ParseEntry) => typeof input === 'string',
  ) as string[];
}

export function intoCommands(script: string): string[] {
  return script
    .split('\n')
    .map(input => input.trim())
    .filter(input => input.length > 0);
}
