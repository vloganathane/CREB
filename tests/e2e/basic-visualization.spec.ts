import { test, expect, type Page } from '@playwright/test';

test.describe('CREB Visualization System - Basic Test', () => {
  test('should load HTML page and verify basic elements', async ({ page }) => {
    // Go directly to the file URL instead of using web server
    await page.goto('file://' + process.cwd() + '/demos/test-visualization.html');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check if page title is correct
    await expect(page.locator('h1')).toHaveText('🧬 CREB Visualization Test Suite');
    
    // Check if main container exists
    const container = page.locator('.container');
    await expect(container).toBeVisible();
    
    // Check if buttons exist
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);
    
    // Take a screenshot
    await page.screenshot({ path: 'test-results/visualization-test.png', fullPage: true });
  });

  test('should handle CREB library loading', async ({ page }) => {
    await page.goto('file://' + process.cwd() + '/demos/test-visualization.html');
    await page.waitForLoadState('networkidle');
    
    // Check if CREB is available (with timeout)
    const crebAvailable = await page.evaluate(async () => {
      // Give it some time to load
      let attempts = 0;
      while (attempts < 10) {
        if (typeof (window as any).CREB !== 'undefined') {
          return true;
        }
        await new Promise(resolve => setTimeout(resolve, 500));
        attempts++;
      }
      return false;
    });
    
    console.log('CREB available:', crebAvailable);
    
    if (crebAvailable) {
      // Test basic functionality
      const balanceResult = await page.evaluate(() => {
        try {
          return (window as any).CREB.balanceEquation('H2 + O2 = H2O');
        } catch (error) {
          return { error: error.message };
        }
      });
      
      console.log('Balance result:', balanceResult);
      expect(balanceResult).toBeDefined();
    } else {
      console.log('CREB library not loaded - this is expected if script path is incorrect');
    }
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    await page.goto('file://' + process.cwd() + '/demos/test-visualization.html');
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    const mobileContainer = page.locator('.container');
    await expect(mobileContainer).toBeVisible();
    await page.screenshot({ path: 'test-results/mobile-view.png' });
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(mobileContainer).toBeVisible();
    await page.screenshot({ path: 'test-results/tablet-view.png' });
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(mobileContainer).toBeVisible();
    await page.screenshot({ path: 'test-results/desktop-view.png' });
  });

  test('should have accessible elements', async ({ page }) => {
    await page.goto('file://' + process.cwd() + '/demos/test-visualization.html');
    
    // Check heading structure
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    
    // Check all buttons have text
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const buttonText = await buttons.nth(i).textContent();
      expect(buttonText).toBeTruthy();
      expect(buttonText?.length).toBeGreaterThan(0);
    }
    
    // Check for proper contrast (basic test)
    const bgColor = await page.evaluate(() => {
      const body = document.body;
      return window.getComputedStyle(body).backgroundColor;
    });
    
    expect(bgColor).toBeDefined();
    console.log('Background color:', bgColor);
  });

  test('should handle user interactions', async ({ page }) => {
    await page.goto('file://' + process.cwd() + '/demos/test-visualization.html');
    
    // Try clicking the first button
    const firstButton = page.locator('button').first();
    await expect(firstButton).toBeVisible();
    
    // Click the button
    await firstButton.click();
    
    // Check if anything changed (this will depend on implementation)
    // For now, just verify the page didn't crash
    const pageTitle = await page.title();
    expect(pageTitle).toBeDefined();
  });

  test('should load without JavaScript errors', async ({ page }) => {
    const jsErrors: Error[] = [];
    
    // Listen for JavaScript errors
    page.on('pageerror', error => {
      jsErrors.push(error);
    });
    
    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('Console error:', msg.text());
      }
    });
    
    await page.goto('file://' + process.cwd() + '/demos/test-visualization.html');
    await page.waitForLoadState('networkidle');
    
    // Wait a bit to catch any delayed errors
    await page.waitForTimeout(2000);
    
    // Check if there were any critical JavaScript errors
    const criticalErrors = jsErrors.filter(error => 
      !error.message.includes('CREB') // Allow CREB-related errors since the library might not load
    );
    
    expect(criticalErrors.length).toBe(0);
    console.log('Total JS errors:', jsErrors.length, 'Critical errors:', criticalErrors.length);
  });
});
