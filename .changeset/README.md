# Changesets

Hello! This folder contains [Changesets](https://github.com/changesets/changesets) for this project.

## Adding a changeset

To generate a new changeset, run `pnpm changeset`. This will prompt you for details about the change, and create a markdown file in this directory.

## Consuming changesets

When a changeset is committed to the `main` branch, a "Release PR" will be automatically created by the changeset action. This PR will update the version in `package.json` and add entries to the `CHANGELOG.md`.

## Releasing

When the "Release PR" is merged, the changeset action will automatically publish the package to npm.