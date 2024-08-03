# GitHub Action to install git-metrics

[![GitHub Super-Linter](https://github.com/jdrouet/action-install-git-metrics/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/actions/typescript-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/jdrouet/action-install-git-metrics/actions/workflows/check-dist.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/jdrouet/action-install-git-metrics/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

This action allows to install
[git-metrics](https://github.com/jdrouet/git-metrics) with a simple GitHub
Action.

## Usage

With this action, you can install any available version with the following
template

```yaml
name: using git-metrics

on:
  pull_request:
  push:
    branches:
      - main

jobs:
  run-on-linux-x64:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: jdrouet/action-git-metrics@install
      - name: execute git-metrics
        run: git-metrics add my-metric 12.34
```
