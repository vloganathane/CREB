import { test, expect, type Page } from '@playwright/test';
import './types.d.ts';

test.describe('CREB Visualization System', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    await page.goto('/test-visualization.html');
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
    
    // Wait for CREB to be available
    await page.waitForFunction(() => window.CREB !== undefined);
  });

  test.describe('Basic Functionality', () => {
    test('should load CREB library successfully', async () => {
      // Check if CREB is loaded
      const crebExists = await page.evaluate(() => typeof window.CREB !== 'undefined');
      expect(crebExists).toBe(true);

      // Check if main functions are available
      const balanceEquationExists = await page.evaluate(() => 
        typeof window.CREB?.balanceEquation === 'function'
      );
      expect(balanceEquationExists).toBe(true);
    });

    test('should have visualization container', async () => {
      const container = page.locator('#visualization-container');
      await expect(container).toBeVisible();
    });

    test('should display title correctly', async () => {
      await expect(page.locator('h1')).toHaveText('CREB Visualization Test Suite');
    });
  });

  test.describe('Chemical Equation Balancing', () => {
    test('should balance simple equation', async () => {
      // Click the balance button for the first equation
      await page.click('button:has-text("Balance Equation")');
      
      // Wait for result to appear
      await page.waitForSelector('.result', { state: 'visible' });
      
      // Check if balanced equation is displayed
      const result = await page.textContent('.result');
      expect(result).toContain('2 H2 + O2 = 2 H2O');
      expect(result).toContain('✅ Balanced');
    });

    test('should handle complex equation', async () => {
      // Test the glucose combustion equation
      const complexButton = page.locator('button:has-text("Balance Equation")').nth(1);
      await complexButton.click();
      
      await page.waitForSelector('.result', { state: 'visible' });
      
      const result = await page.textContent('.result');
      expect(result).toContain('C6H12O6 + 6 O2 = 6 CO2 + 6 H2O');
      expect(result).toContain('✅ Balanced');
    });

    test('should show thermodynamic data', async () => {
      // Click thermodynamics button
      await page.click('button:has-text("Calculate Thermodynamics")');
      
      await page.waitForSelector('.thermo-result', { state: 'visible' });
      
      const thermoResult = await page.textContent('.thermo-result');
      expect(thermoResult).toContain('ΔH');
      expect(thermoResult).toContain('kJ/mol');
    });
  });

  test.describe('Performance Metrics', () => {
    test('should display performance metrics', async () => {
      // Click performance test button
      await page.click('button:has-text("Run Performance Test")');
      
      await page.waitForSelector('.performance-metrics', { state: 'visible' });
      
      const metricsVisible = await page.isVisible('.performance-metrics');
      expect(metricsVisible).toBe(true);
      
      // Check if timing information is displayed
      const metrics = await page.textContent('.performance-metrics');
      expect(metrics).toContain('ms');
    });

    test('should handle multiple rapid calculations', async () => {
      // Rapid fire test - click balance button multiple times
      for (let i = 0; i < 5; i++) {
        await page.click('button:has-text("Balance Equation")');
        await page.waitForTimeout(100);
      }
      
      // Should not crash or hang
      const isResponsive = await page.evaluate(() => {
        return document.readyState === 'complete';
      });
      expect(isResponsive).toBe(true);
    });
  });

  test.describe('Data Validation', () => {
    test('should validate chemical formulas', async () => {
      // Click validation test
      await page.click('button:has-text("Test Data Validation")');
      
      await page.waitForSelector('.validation-result', { state: 'visible' });
      
      const validationResult = await page.textContent('.validation-result');
      expect(validationResult).toContain('Valid');
    });

    test('should handle invalid input gracefully', async () => {
      // Test with invalid equation using evaluate
      const errorHandled = await page.evaluate(() => {
        try {
          // @ts-ignore - Testing error handling
          const result = window.CREB.balanceEquation('invalid equation xyz 123');
          return result !== null;
        } catch (error) {
          return true; // Error was caught
        }
      });
      
      expect(errorHandled).toBe(true);
    });
  });

  test.describe('User Interface', () => {
    test('should be responsive on different screen sizes', async () => {
      // Test mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      const container = page.locator('#visualization-container');
      await expect(container).toBeVisible();
      
      // Test tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await expect(container).toBeVisible();
      
      // Test desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
      await expect(container).toBeVisible();
    });

    test('should handle keyboard navigation', async () => {
      // Focus first button and press Enter
      await page.focus('button:has-text("Balance Equation")');
      await page.keyboard.press('Enter');
      
      // Should trigger the same action as clicking
      await page.waitForSelector('.result', { state: 'visible' });
      const result = await page.textContent('.result');
      expect(result).toContain('Balanced');
    });

    test('should be accessible', async () => {
      // Check for proper heading structure
      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();
      
      // Check for proper button labels
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();
      expect(buttonCount).toBeGreaterThan(0);
      
      // Each button should have text content
      for (let i = 0; i < buttonCount; i++) {
        const buttonText = await buttons.nth(i).textContent();
        expect(buttonText).toBeTruthy();
      }
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async () => {
      // Simulate network issues by intercepting requests
      await page.route('**/*', route => {
        if (route.request().url().includes('fail-test')) {
          route.abort();
        } else {
          route.continue();
        }
      });
      
      // Application should still be functional
      const crebExists = await page.evaluate(() => typeof window.CREB !== 'undefined');
      expect(crebExists).toBe(true);
    });

    test('should recover from JavaScript errors', async () => {
      // Inject an error and see if the app recovers
      await page.evaluate(() => {
        try {
          // @ts-ignore - Intentional error for testing
          someUndefinedFunction();
        } catch (e) {
          // Expected to catch error
        }
      });
      
      // App should still be functional after error
      await page.click('button:has-text("Balance Equation")');
      await page.waitForSelector('.result', { state: 'visible' });
      
      const result = await page.textContent('.result');
      expect(result).toContain('Balanced');
    });
  });

  test.describe('Performance Benchmarks', () => {
    test('should load page within acceptable time', async () => {
      const startTime = Date.now();
      
      await page.goto('/test-visualization.html');
      await page.waitForLoadState('networkidle');
      await page.waitForFunction(() => window.CREB !== undefined);
      
      const loadTime = Date.now() - startTime;
      
      // Page should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
      console.log(`Page loaded in ${loadTime}ms`);
    });

    test('should execute calculations quickly', async () => {
      const startTime = await page.evaluate(() => performance.now());
      
      // Execute calculation
      await page.click('button:has-text("Balance Equation")');
      await page.waitForSelector('.result', { state: 'visible' });
      
      const endTime = await page.evaluate(() => performance.now());
      const calculationTime = endTime - startTime;
      
      // Calculation should complete within 1 second
      expect(calculationTime).toBeLessThan(1000);
      console.log(`Calculation completed in ${calculationTime.toFixed(2)}ms`);
    });
  });

  test.describe('Browser Compatibility', () => {
    test('should work across different browsers', async () => {
      // This test will run across all configured browsers in playwright.config.ts
      const userAgent = await page.evaluate(() => navigator.userAgent);
      console.log(`Testing on: ${userAgent}`);
      
      // Basic functionality should work regardless of browser
      await page.click('button:has-text("Balance Equation")');
      await page.waitForSelector('.result', { state: 'visible' });
      
      const result = await page.textContent('.result');
      expect(result).toContain('Balanced');
    });

    test('should handle browser-specific features', async () => {
      // Check for modern browser features
      const hasES6 = await page.evaluate(() => {
        try {
          // Test arrow functions
          const test = () => true;
          return test();
        } catch {
          return false;
        }
      });
      
      expect(hasES6).toBe(true);
      
      // Check for required APIs
      const hasRequiredAPIs = await page.evaluate(() => {
        return typeof Promise !== 'undefined' && 
               typeof fetch !== 'undefined' && 
               typeof JSON !== 'undefined';
      });
      
      expect(hasRequiredAPIs).toBe(true);
    });
  });

  test.describe('Visual Regression', () => {
    test('should match visual baseline', async () => {
      // Take screenshot of the main interface
      await expect(page.locator('#visualization-container')).toHaveScreenshot('main-interface.png');
    });

    test('should show consistent results display', async () => {
      // Trigger a calculation
      await page.click('button:has-text("Balance Equation")');
      await page.waitForSelector('.result', { state: 'visible' });
      
      // Take screenshot of results
      await expect(page.locator('.result')).toHaveScreenshot('calculation-result.png');
    });
  });
});
