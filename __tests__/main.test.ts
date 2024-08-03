/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as main from '../src/main';

// Mock the action's main function
const runMock = jest.spyOn(main, 'run');

// Mock the GitHub Actions core library
let debugMock: jest.SpiedFunction<typeof core.debug>;
let getInputMock: jest.SpiedFunction<typeof core.getInput>;
let getBooleanInputMock: jest.SpiedFunction<typeof core.getBooleanInput>;
let setFailedMock: jest.SpiedFunction<typeof core.setFailed>;
let setOutputMock: jest.SpiedFunction<typeof core.setOutput>;

// Mock the exec function
let execMock: jest.SpiedFunction<typeof exec.exec>;

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    debugMock = jest.spyOn(core, 'debug').mockImplementation();
    getInputMock = jest.spyOn(core, 'getInput').mockImplementation();
    getBooleanInputMock = jest
      .spyOn(core, 'getBooleanInput')
      .mockImplementation();
    setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation();
    setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation();
    execMock = jest.spyOn(exec, 'exec').mockImplementation();
  });

  it('executing multiple times', async () => {
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'backend':
          return 'command';
        case 'script':
          return `
            add name 12.3
            show
            `;
        case 'continueOnError':
          return 'false';
        default:
          return '';
      }
    });
    execMock.mockImplementation((command, args, opts) => {
      if (
        !command ||
        !args ||
        !opts ||
        !opts.listeners?.stdout ||
        !opts.listeners?.stderr
      )
        throw new Error('missing parameter');
      if (args[0] === 'add') {
        return Promise.resolve(0);
      }
      if (args[0] === 'show') {
        opts.listeners.stdout(Buffer.from('some output', 'utf8'));
        opts.listeners.stderr(Buffer.from('some error', 'utf8'));
        return Promise.resolve(0);
      }
      throw new Error('unexpected command ' + JSON.stringify(args));
    });

    await main.run();
    expect(runMock).toHaveReturned();

    expect(debugMock).toHaveBeenCalled();
    expect(getInputMock).toHaveBeenCalledWith('script', { required: true });
    expect(getInputMock).toHaveBeenCalledWith('backend', { required: false });
    expect(getBooleanInputMock).toHaveBeenCalledWith('continueOnError', {
      required: false,
    });
    expect(setFailedMock).not.toHaveBeenCalled();
    expect(execMock).toHaveBeenCalledTimes(2);
    expect(setOutputMock).toHaveBeenCalledWith(
      'result',
      '[{"command":"add name 12.3","code":0,"stdout":"","stderr":""},{"command":"show","code":0,"stdout":"some output","stderr":"some error"}]',
    );
  });

  it('executing with sync', async () => {
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'backend':
          return 'command';
        case 'script':
          return `
              add name 12.3
              show
              `;
        case 'continueOnError':
          return 'false';
        default:
          return '';
      }
    });
    getBooleanInputMock.mockImplementation(name => ['sync'].includes(name));
    execMock.mockImplementation((command, args, opts) => {
      if (
        !command ||
        !args ||
        !opts ||
        !opts.listeners?.stdout ||
        !opts.listeners?.stderr
      )
        throw new Error('missing parameter');
      if (['add', 'pull', 'push'].includes(args[0])) {
        return Promise.resolve(0);
      }
      if (args[0] === 'show') {
        opts.listeners.stdout(Buffer.from('some output', 'utf8'));
        opts.listeners.stderr(Buffer.from('some error', 'utf8'));
        return Promise.resolve(0);
      }
      throw new Error('unexpected command ' + JSON.stringify(args));
    });

    await main.run();
    expect(runMock).toHaveReturned();

    expect(debugMock).toHaveBeenCalled();
    expect(getInputMock).toHaveBeenCalledWith('script', { required: true });
    expect(getInputMock).toHaveBeenCalledWith('backend', { required: false });
    expect(getBooleanInputMock).toHaveBeenCalledWith('continueOnError', {
      required: false,
    });
    expect(getBooleanInputMock).toHaveBeenCalledWith('sync', {
      required: false,
    });
    expect(setFailedMock).not.toHaveBeenCalled();
    expect(execMock).toHaveBeenCalledTimes(4);
    expect(setOutputMock).toHaveBeenCalledWith(
      'result',
      '[{"command":"pull","code":0,"stdout":"","stderr":""},{"command":"add name 12.3","code":0,"stdout":"","stderr":""},{"command":"show","code":0,"stdout":"some output","stderr":"some error"},{"command":"push","code":0,"stdout":"","stderr":""}]',
    );
  });

  it('executing with pull', async () => {
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'backend':
          return 'command';
        case 'script':
          return `
                  add name 12.3
                  show
                  `;
        case 'continueOnError':
          return 'false';
        default:
          return '';
      }
    });
    getBooleanInputMock.mockImplementation(name => ['pull'].includes(name));
    execMock.mockImplementation((command, args, opts) => {
      if (
        !command ||
        !args ||
        !opts ||
        !opts.listeners?.stdout ||
        !opts.listeners?.stderr
      )
        throw new Error('missing parameter');
      if (['add', 'pull', 'push'].includes(args[0])) {
        return Promise.resolve(0);
      }
      if (args[0] === 'show') {
        opts.listeners.stdout(Buffer.from('some output', 'utf8'));
        opts.listeners.stderr(Buffer.from('some error', 'utf8'));
        return Promise.resolve(0);
      }
      throw new Error('unexpected command ' + JSON.stringify(args));
    });

    await main.run();
    expect(runMock).toHaveReturned();

    expect(debugMock).toHaveBeenCalled();
    expect(getInputMock).toHaveBeenCalledWith('script', { required: true });
    expect(getInputMock).toHaveBeenCalledWith('backend', { required: false });
    expect(getBooleanInputMock).toHaveBeenCalledWith('continueOnError', {
      required: false,
    });
    expect(getBooleanInputMock).toHaveBeenCalledWith('sync', {
      required: false,
    });
    expect(setFailedMock).not.toHaveBeenCalled();
    expect(execMock).toHaveBeenCalledTimes(3);
    expect(setOutputMock).toHaveBeenCalledWith(
      'result',
      '[{"command":"pull","code":0,"stdout":"","stderr":""},{"command":"add name 12.3","code":0,"stdout":"","stderr":""},{"command":"show","code":0,"stdout":"some output","stderr":"some error"}]',
    );
  });

  it('executing with push', async () => {
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'backend':
          return 'command';
        case 'script':
          return `
                  add name 12.3
                  show
                  `;
        case 'continueOnError':
          return 'false';
        default:
          return '';
      }
    });
    getBooleanInputMock.mockImplementation(name => ['push'].includes(name));
    execMock.mockImplementation((command, args, opts) => {
      if (
        !command ||
        !args ||
        !opts ||
        !opts.listeners?.stdout ||
        !opts.listeners?.stderr
      )
        throw new Error('missing parameter');
      if (['add', 'pull', 'push'].includes(args[0])) {
        return Promise.resolve(0);
      }
      if (args[0] === 'show') {
        opts.listeners.stdout(Buffer.from('some output', 'utf8'));
        opts.listeners.stderr(Buffer.from('some error', 'utf8'));
        return Promise.resolve(0);
      }
      throw new Error('unexpected command ' + JSON.stringify(args));
    });

    await main.run();
    expect(runMock).toHaveReturned();

    expect(debugMock).toHaveBeenCalled();
    expect(getInputMock).toHaveBeenCalledWith('script', { required: true });
    expect(getInputMock).toHaveBeenCalledWith('backend', { required: false });
    expect(getBooleanInputMock).toHaveBeenCalledWith('continueOnError', {
      required: false,
    });
    expect(getBooleanInputMock).toHaveBeenCalledWith('sync', {
      required: false,
    });
    expect(setFailedMock).not.toHaveBeenCalled();
    expect(execMock).toHaveBeenCalledTimes(3);
    expect(setOutputMock).toHaveBeenCalledWith(
      'result',
      '[{"command":"add name 12.3","code":0,"stdout":"","stderr":""},{"command":"show","code":0,"stdout":"some output","stderr":"some error"},{"command":"push","code":0,"stdout":"","stderr":""}]',
    );
  });

  it('with a failure', async () => {
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'backend':
          return 'command';
        case 'script':
          return `
          add name 12.3
          show
          add other 23.4
          `;
        default:
          throw new Error('unexpected input ' + name);
      }
    });
    execMock.mockImplementation((command, args, opts) => {
      if (
        !command ||
        !args ||
        !opts ||
        !opts.listeners?.stdout ||
        !opts.listeners?.stderr
      )
        throw new Error('missing parameter');
      if (args[0] === 'add') {
        return Promise.resolve(0);
      }
      if (args[0] === 'show') {
        opts.listeners.stderr(Buffer.from('some error', 'utf8'));
        return Promise.resolve(1);
      }
      throw new Error('unexpected command ' + JSON.stringify(args));
    });

    await main.run();
    expect(runMock).toHaveReturned();

    expect(debugMock).toHaveBeenCalled();
    expect(getInputMock).toHaveBeenCalledWith('script', { required: true });
    expect(getInputMock).toHaveBeenCalledWith('backend', { required: false });
    expect(getBooleanInputMock).toHaveBeenCalledWith('continueOnError', {
      required: false,
    });
    expect(setFailedMock).toHaveBeenCalledWith(
      'command show failed with exit code 1',
    );
    expect(execMock).toHaveBeenCalledTimes(2);
    expect(setOutputMock).not.toHaveBeenCalled();
  });

  it('should work with continueOnError', async () => {
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'backend':
          return 'command';
        case 'script':
          return `
                add name 12.3
                show
                `;
        case 'continueOnError':
          return 'true';
        default:
          return '';
      }
    });
    getBooleanInputMock.mockImplementation(name => {
      switch (name) {
        case 'pull':
        case 'push':
        case 'sync':
          return false;
        case 'continueOnError':
          return true;
        default:
          throw new Error('unexpected call with ' + name);
      }
    });
    execMock.mockImplementation((command, args, opts) => {
      if (
        !command ||
        !args ||
        !opts ||
        !opts.listeners?.stdout ||
        !opts.listeners?.stderr
      )
        throw new Error('missing parameter');
      if (args[0] === 'add') {
        opts.listeners.stderr(Buffer.from('something wrong', 'utf8'));
        return Promise.resolve(42);
      }
      if (args[0] === 'show') {
        return Promise.resolve(0);
      }
      throw new Error('unexpected command ' + JSON.stringify(args));
    });

    await main.run();
    expect(runMock).toHaveReturned();

    expect(debugMock).toHaveBeenCalled();
    expect(getInputMock).toHaveBeenCalledWith('script', { required: true });
    expect(getInputMock).toHaveBeenCalledWith('backend', { required: false });
    expect(getBooleanInputMock).toHaveBeenCalledWith('continueOnError', {
      required: false,
    });
    expect(setFailedMock).not.toHaveBeenCalled();
    expect(execMock).toHaveBeenCalledTimes(2);
    expect(setOutputMock).toHaveBeenCalledWith(
      'result',
      '[{"command":"add name 12.3","code":42,"stdout":"","stderr":"something wrong"},{"command":"show","code":0,"stdout":"","stderr":""}]',
    );
  });

  it('should handle errors', async () => {
    getInputMock.mockImplementation(name => {
      throw new Error(`something went wrong with ${name}`);
    });

    await main.run();
    expect(runMock).toHaveReturned();

    expect(getInputMock).toHaveBeenCalledWith('script', { required: true });
    expect(setFailedMock).toHaveBeenCalledWith(
      'something went wrong with script',
    );
    expect(execMock).not.toHaveBeenCalled();
    expect(setOutputMock).not.toHaveBeenCalled();
  });
});
