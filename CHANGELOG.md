# Changelog

## Unreleased

### Added
- Automatic Playwright browser caching between runs
- Smart cache key generation based on Playwright version, OS, architecture, and browser selection
- Automatic cache restoration and saving with fallback to fresh installation

### Changed
- Browser installation is now handled by a dedicated caching module
- Improved error handling and logging for browser setup

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
