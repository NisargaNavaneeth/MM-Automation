import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Home Page Tests', () => {
    test('should navigate to home page and get title successfully', async ({ page }) => {
        const homePage = new HomePage(page);
        
        await homePage.navigate();
        
        const title = await homePage.getTitle();
        // Just verify the title is a non-empty string, you can update this to the exact expected title later
        expect(title.length).toBeGreaterThan(0);
        
        // Also verify the URL is correct
        await expect(page).toHaveURL(/.*acelucid.*/);
    });
});
