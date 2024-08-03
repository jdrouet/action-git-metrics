import * as core from '@actions/core';
import * as exec from '@actions/exec';
import type { ExecOptions } from '@actions/exec';
import { intoCommands, intoArgs } from './helper';

export type Execution = {
  command: string;
  code: number;
  stdout: string;
  stderr: string;
};

class Executor {
  backend: string = 'command';
  continueOnError: boolean = false;
  output: Execution[] = [];

  constructor(backend: string, continueOnError: boolean) {
    this.backend = backend;
    this.continueOnError = continueOnError;
  }

  executeCommand = async (command: string) => {
    core.debug(`executing command ${command}`);
    let stdout = '';
    let stderr = '';

    const options: ExecOptions = {
      env: {
        GIT_BACKEND: this.backend,
        VERBOSITY: '5',
      },
      ignoreReturnCode: true,
      listeners: {
        stdout: (data: Buffer) => {
          stdout += data.toString();
        },
        stderr: (data: Buffer) => {
          stderr += data.toString();
        },
      },
    };

    const code = await exec.exec('git-metrics', intoArgs(command), options);
    core.debug(`exit code ${code}`);

    this.output.push({
      command,
      code,
      stdout,
      stderr,
    });

    if (code !== 0 && !this.continueOnError) {
      core.setFailed(`command ${command} failed with exit code ${code}`);
      throw new Error('command failed');
    }
  };
}

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const script = core.getInput('script', { required: true });
    const backend = core.getInput('backend', { required: false });
    const sync = core.getBooleanInput('sync', { required: false });
    const pull = core.getBooleanInput('pull', { required: false });
    const push = core.getBooleanInput('push', { required: false });
    const continueOnError = core.getBooleanInput('continueOnError', {
      required: false,
    });

    const executor = new Executor(backend, continueOnError);

    if (sync || pull) {
      await executor.executeCommand('pull');
    }
    for (const command of intoCommands(script)) {
      await executor.executeCommand(command);
    }
    if (sync || push) {
      await executor.executeCommand('push');
    }

    core.setOutput('result', JSON.stringify(executor.output));
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}
