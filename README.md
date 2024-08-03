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
