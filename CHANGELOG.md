# Changelog

## Unreleased

### Added
- Automatic Playwright browser caching between runs
- Smart cache key generation based on Playwright version, OS, architecture, and browser selection
- Automatic cache restoration and saving with fallback to fresh installation

### Changed
- Browser installation is now handled by a dedicated caching module
- Improved error handling and logging for browser setup

## [1.3.0-beta](https://github.com/yoavf/auto-pr-screenshots-action/compare/v1.2.0-beta...v1.3.0-beta) (2025-08-19)


### Features

* add browser caching ([d288d18](https://github.com/yoavf/auto-pr-screenshots-action/commit/d288d1822a85f2e4f3881dbbcb72795cb9d9814f))
* add release-please workflow ([8826e1c](https://github.com/yoavf/auto-pr-screenshots-action/commit/8826e1c0fc6919d93850eb687fcf214dbec0f29c))


### Bug Fixes

* invalid yaml file for release-please workflow ([bed9ef2](https://github.com/yoavf/auto-pr-screenshots-action/commit/bed9ef2f91c5677d11a00ed0368e16645fb3ed4e))
* invalid yaml file for workflow ([0cf0c26](https://github.com/yoavf/auto-pr-screenshots-action/commit/0cf0c268050ae8611417e6be8cf1db20bdd1c6f2))

## 1.1.0

- Improve the layout of the comment posted on the PR

## 1.0.3

- Fix config file being ignored when URL input is also provided - #7

## 1.0.2

- Make attribution link opt-in
- Clarify docs

## 1.0.1

- Fix links to action repo

## 1.0.0

- Initial release
