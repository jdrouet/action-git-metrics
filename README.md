# GitHub Action to execute a set of git-metrics commands

[![GitHub Super-Linter](https://github.com/jdrouet/action-execute-git-metrics/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/jdrouet/action-execute-git-metrics/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/jdrouet/action-execute-git-metrics/actions/workflows/check-dist.yml/badge.svg)](https://github.com/jdrouet/action-execute-git-metrics/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/jdrouet/action-execute-git-metrics/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/jdrouet/action-execute-git-metrics/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

This action should be used to use
[git-metrics](https://github.com/jdrouet/git-metrics) after installing it with
[action-install-git-metrics](https://github.com/jdrouet/action-install-git-metrics).

## Usage

```yaml
steps:
  - name: Checkout
    id: checkout
    uses: actions/checkout@v4

  - name: Install git-metrics
    uses: jdrouet/action-install-git-metrics@main

  - name: Execute git-metrics
    uses: jdrouet/action-execute-git-metrics@main # or with a specific version
    with:
      pull: 'false' # Shortcut to pull before executing the script
      push: 'false' # Shortcut to push after executing the script
      sync: 'false' # Shortcut to pull before and push after executing the script
      script: |
        pull
        add my-metric --tag "foo: bar" 12.34
        push
      continueOnError: 'false'
```
