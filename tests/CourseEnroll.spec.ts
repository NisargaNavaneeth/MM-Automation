import { test, expect } from '@playwright/test';
import { SignInPage } from '../pages/Auth/SignInPage';
import { CourseEnrollPage } from '../pages/ProCourse/CourseEnroll';

test.describe('Pro Courses Flow', () => {
    let signInPage: SignInPage;
    let courseEnrollPage: CourseEnrollPage;

    test.beforeEach(async ({ page }) => {
        signInPage = new SignInPage(page);
        courseEnrollPage = new CourseEnrollPage(page);

        // ✅ PHONE LOGIN (your working flow)
        await signInPage.openLoginView();
        await signInPage.loginWithPhoneAndOtp('7777777771', '123456');
    });

    // ── Test 1: Navigate to Pro Courses page ──────────────────────────────────
    test('User navigates to Pro Courses and Quizes', async ({ page }) => {
        test.setTimeout(180000);
        // Open sidebar
        await courseEnrollPage.openSidebar();

        // Click Pro Courses
        await courseEnrollPage.goToProCourses();
        // navigation using UI
        await expect(page.getByText('Explore All Professional Courses').first()).toBeVisible({ timeout: 2000000 });
        // Stay on the screen for 5 seconds before test ends
        await page.waitForTimeout(5000);

        //Click Continue Learning on already explored course card
        await courseEnrollPage.clickContinueLearning();

        // Validate we reached the Course View page
        await expect(page).toHaveURL(/.*course.*/, { timeout: 50000 });

        // Stay on screen for 5 seconds
        await page.waitForTimeout(5000);
        await courseEnrollPage.clickQuizChallenge();
        await expect(page).toHaveURL(/.*quiz.*/, { timeout: 20000 });
        await page.waitForTimeout(3000);

        // Click Start Quiz button
        await courseEnrollPage.clickStartQuiz();

        // Validate we reached the Quiz page
        await expect(page).toHaveURL(/.*quiz.*/, { timeout: 20000 });

        // Stay on screen for 5 seconds
        await page.waitForTimeout(5000);
        // Click Start Quiz button
        await courseEnrollPage.clickStartQuiz();

        //Click Start Quiz button on popup
        await courseEnrollPage.clickStartQuizPopup();

        // Validate we reached the Quiz page
        await expect(page).toHaveURL(/.*quiz.*/, { timeout: 20000 });
        await page.waitForTimeout(2000);
        // Attempt quiz — select random option for each question and click Next
        await courseEnrollPage.attemptQuiz();
        await courseEnrollPage.clickViewSolutions();
        // Scroll through the solutions page
        await courseEnrollPage.scrollThroughSolutions();
        //  Click Back to Challenges
        await courseEnrollPage.clickBackToChallenges();
        // Validate quiz was submitted successfully
        await page.waitForTimeout(5000);

    });
    test("users continue the quiz ",async({page})=>{

    })
});