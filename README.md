# GitHub Action to report git-metrics diff

This action will take out the result of `git-metrics diff origin/$GITHUB_BASE_REF..HEAD` and add it to a comment in the pull request.
This allows to track changes between the main branch and the latest commit of the current branch and make sure the defined rules are satisfied.


## Usage

```yaml
steps:
  - name: Checkout
    id: checkout
    uses: actions/checkout@v4

  - name: Set git identity
    uses: jdrouet/action-git-identity@main

  - name: Install git-metrics
    uses: jdrouet/action-git-metrics@install

  - name: Execute git-metrics
    uses: jdrouet/action-git-metrics@execute
    with:
      pull: 'true'
      script: 'add my-metric --tag "foo: bar" 12.34'

  - name: Comment git-metrics diff
    uses: jdrouet/action-git-metrics@diff
```
