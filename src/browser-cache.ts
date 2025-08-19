import { promises as fs } from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import * as cache from '@actions/cache';
import * as exec from '@actions/exec';
import { logger } from './logger';

interface CacheResult {
  cacheHit: boolean;
  browsersInstalled: boolean;
}

/**
 * Get the Playwright version from the bundled package
 */
async function getPlaywrightVersion(): Promise<string> {
  try {
    // Use require.resolve to get the exact path to the bundled playwright
    const playwrightPath = require.resolve('playwright/package.json');
    const playwrightPkg = require(playwrightPath);
    return playwrightPkg.version;
  } catch {
    // Fallback - this should match the version in our package.json
    return '1.54.2';
  }
}

/**
 * Get the Playwright cache directory based on the OS
 */
function getPlaywrightCacheDir(): string {
  const platform = os.platform();

  if (platform === 'win32') {
    return path.join(os.homedir(), 'AppData', 'Local', 'ms-playwright');
  } else {
    return path.join(os.homedir(), '.cache', 'ms-playwright');
  }
}

/**
 * Check if browsers are already installed by looking for browser executables
 */
async function checkBrowsersInstalled(browsers: string[]): Promise<boolean> {
  const cacheDir = getPlaywrightCacheDir();

  try {
    await fs.access(cacheDir);

    // Check if any browser directories exist
    const entries = await fs.readdir(cacheDir);
    const hasChromium = browsers.includes('chromium')
      ? entries.some((entry) => entry.includes('chromium'))
      : true;
    const hasFirefox = browsers.includes('firefox')
      ? entries.some((entry) => entry.includes('firefox'))
      : true;
    const hasWebkit = browsers.includes('webkit')
      ? entries.some((entry) => entry.includes('webkit'))
      : true;

    return hasChromium && hasFirefox && hasWebkit;
  } catch {
    return false;
  }
}

/**
 * Generate cache key for Playwright browsers
 */
async function generateCacheKey(browsers: string[]): Promise<string> {
  const playwrightVersion = await getPlaywrightVersion();
  const platform = os.platform();
  const arch = os.arch();
  const browsersKey = browsers.sort().join('-');

  return `playwright-browsers-${platform}-${arch}-${playwrightVersion}-${browsersKey}`;
}

/**
 * Restore Playwright browsers from cache
 */
async function restoreFromCache(browsers: string[]): Promise<CacheResult> {
  if (!process.env.GITHUB_ACTIONS) {
    // Not in GitHub Actions, skip caching
    return { cacheHit: false, browsersInstalled: false };
  }

  const cacheDir = getPlaywrightCacheDir();
  const cacheKey = await generateCacheKey(browsers);
  const restoreKeys = [
    `playwright-browsers-${os.platform()}-${os.arch()}-`,
    `playwright-browsers-${os.platform()}-`,
  ];

  logger.info(`🔍 Looking for cached browsers with key: ${cacheKey}`);

  try {
    const cacheHit = await cache.restoreCache([cacheDir], cacheKey, restoreKeys);

    if (cacheHit) {
      logger.success(`✅ Cache hit! Restored browsers from cache: ${cacheHit}`);

      // Verify browsers are actually installed
      const browsersInstalled = await checkBrowsersInstalled(browsers);
      if (browsersInstalled) {
        return { cacheHit: true, browsersInstalled: true };
      } else {
        logger.warn('⚠️  Cache hit but browsers not properly installed, will reinstall');
        return { cacheHit: true, browsersInstalled: false };
      }
    } else {
      logger.info('📦 No cache hit, will install browsers');
      return { cacheHit: false, browsersInstalled: false };
    }
  } catch (error) {
    logger.warn(
      `⚠️  Cache restore failed: ${error instanceof Error ? error.message : String(error)}`,
    );
    return { cacheHit: false, browsersInstalled: false };
  }
}

/**
 * Install Playwright browsers
 */
async function installBrowsers(browsers: string[]): Promise<void> {
  logger.info(`🎭 Installing Playwright browsers: ${browsers.join(', ')}`);

  try {
    // Use npx playwright (official recommendation) - automatically uses package.json version
    const args = ['playwright', 'install', '--with-deps', ...browsers];
    await exec.exec('npx', args);

    logger.success(`✅ Successfully installed browsers: ${browsers.join(', ')}`);
  } catch (error) {
    throw new Error(
      `Failed to install Playwright browsers: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Install only OS dependencies (when browsers are cached)
 */
async function installDependencies(): Promise<void> {
  logger.info('🔧 Installing Playwright system dependencies...');

  try {
    // Use npx playwright (official recommendation) - automatically uses package.json version
    await exec.exec('npx', ['playwright', 'install-deps']);
    logger.success('✅ Successfully installed system dependencies');
  } catch (error) {
    logger.warn(
      `⚠️  Failed to install system dependencies: ${error instanceof Error ? error.message : String(error)}`,
    );
    // Don't throw here as the browsers might still work without explicit deps
  }
}

/**
 * Save browsers to cache
 */
async function saveToCache(browsers: string[]): Promise<void> {
  if (!process.env.GITHUB_ACTIONS) {
    // Not in GitHub Actions, skip caching
    return;
  }

  const cacheDir = getPlaywrightCacheDir();
  const cacheKey = await generateCacheKey(browsers);

  logger.info(`💾 Saving browsers to cache with key: ${cacheKey}`);

  try {
    await cache.saveCache([cacheDir], cacheKey);
    logger.success('✅ Successfully cached browsers for future runs');
  } catch (error) {
    // Don't fail the action if caching fails
    logger.warn(
      `⚠️  Failed to save cache: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Ensure Playwright browsers are installed, using cache when possible
 */
export async function ensureBrowsersInstalled(browsersInput: string): Promise<void> {
  const browsers = browsersInput
    .split(',')
    .map((b) => b.trim())
    .filter(Boolean);

  if (browsers.length === 0) {
    throw new Error('No browsers specified');
  }

  logger.info(`🚀 Ensuring browsers are available: ${browsers.join(', ')}`);

  // Try to restore from cache
  const cacheResult = await restoreFromCache(browsers);

  if (cacheResult.cacheHit && cacheResult.browsersInstalled) {
    // Browsers are cached and verified, just install OS dependencies
    await installDependencies();
    logger.success('⚡ Using cached browsers, ready to capture screenshots!');
    return;
  }

  // Need to install browsers
  await installBrowsers(browsers);

  // Save to cache for future runs
  await saveToCache(browsers);

  logger.success('🎉 Browsers installed and cached, ready to capture screenshots!');
}
