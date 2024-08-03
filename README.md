# git-metrics scripts for GitHub actions

This repository is a set actions hidden behind branches.

## Installing git-metrics

This action is located on this repository, in the `install` branch.

```yaml
- name: install git-metrics
  uses: jdrouet/action-git-metrics@install
  with:
    # if you want to overwrite an existing binary
    force: "true"
    # the version to install
    version: "latest"
```

Available [here](https://github.com/jdrouet/action-git-metrics/tree/install).

## Executing a set of commands

This is an action to execute a set of git-metrics commands

```yaml
- name: execute git-metrics
  uses: jdrouet/action-git-metrics@execute
  with:
    pull: 'true'
    # set that to true when not a pull request
    push: ${{ github.event_name != 'pull_request' }}
    script: |
      add binary-size --tag "platform: linux" 1024
```

Available [here](https://github.com/jdrouet/action-git-metrics/tree/execute).

## Reporting metrics diffs and checks

This will execute the diff or check command and push the result to a comment (if done in a pull request) and in the summary.

```yaml
- name: execute git-metrics diff
  uses: jdrouet/action-git-metrics@diff
- name: execute git-metrics check
  uses: jdrouet/action-git-metrics@check
```

Available [here](https://github.com/jdrouet/action-git-metrics/tree/diff) and [here](https://github.com/jdrouet/action-git-metrics/tree/check).
