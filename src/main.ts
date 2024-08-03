import * as core from '@actions/core';
import * as github from '@actions/github';
import * as io from '@actions/io';
import * as tc from '@actions/tool-cache';
import { env } from 'node:process';
import { chmod } from 'node:fs/promises';

async function checkAlreadyInstalled(): Promise<boolean> {
  try {
    await io.which('git-metrics', true);
    return true;
  } catch {
    return false;
  }
}

function getFilenameFromPlatform(): string | undefined {
  if (process.platform === 'linux' || process.platform === 'darwin') {
    if (process.arch === 'x64') {
      return `git-metrics_${process.platform}-x86_64`;
    }
    if (process.arch === 'arm64') {
      return `git-metrics_${process.platform}-aarch64`;
    }
    core.setFailed(
      `The architecture ${process.arch} is not supported for the platform ${process.platform}`,
    );
  } else {
    core.setFailed(`The platform ${process.platform} is not supported`);
  }
  return undefined;
}

const BIN_DIR = `${env.HOME}/.local/bin`;
const BIN_PATH = `${BIN_DIR}/git-metrics`;

async function getVersion(): Promise<string> {
  const inputVersion = core.getInput('version');
  if (inputVersion !== 'latest') {
    return inputVersion;
  }
  const token = core.getInput('GITHUB_TOKEN');
  const octokit = github.getOctokit(token);
  const latest = await octokit.rest.repos.getLatestRelease({
    owner: 'jdrouet',
    repo: 'git-metrics',
  });
  return latest.data.tag_name;
}

async function download(filename: string, version: string): Promise<void> {
  core.debug('creating bin directory and adding to path');
  await io.mkdirP(BIN_DIR);
  core.addPath(BIN_DIR);

  core.debug('removing existing file');
  await io.rmRF(BIN_PATH);
  core.info(`downloading ${filename} ${version}`);
  await tc.downloadTool(
    `https://github.com/jdrouet/git-metrics/releases/download/${version}/${filename}`,
    BIN_PATH,
  );
  core.debug('make binary executable');
  await chmod(BIN_PATH, '555');
}

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    if (await checkAlreadyInstalled()) {
      core.info('git-metrics already installed');
      core.setOutput('already-installed', 'true');
      if (core.getInput('force') === 'false') {
        core.setOutput('installed', 'false');
        core.debug('force is set to false, aborting installation');
        return;
      }
      core.debug('force is set to true, reinstalling');
    } else {
      core.setOutput('already-installed', 'false');
    }

    const filename = getFilenameFromPlatform();
    if (!filename) return;

    const version = await getVersion();
    await download(filename, version);
    core.setOutput('installed', 'true');
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}
