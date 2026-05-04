import { Page, Locator } from '@playwright/test';

export class CourseEnrollPage {
    readonly page: Page;
    readonly menuButton: Locator;
    readonly proCoursesOption: Locator;
    readonly continueLearningButton: Locator;
    readonly quizButton: Locator;
    readonly startQuizButton: Locator;
    readonly startQuizPopupButton: Locator;
    readonly quizOptions: Locator;
    readonly nextButton: Locator;
    readonly submitButton: Locator;
    readonly submitQuizPopupButton: Locator;
    readonly viewSolutionsButton: Locator;
    readonly backToChallengesButton: Locator;


    constructor(page: Page) {
        this.page = page;

        // ── Sidebar ───────────────────────────────────────────────────────────
        this.menuButton = page.getByRole('button').first();
        // Targets the material icon menu trigger directly

        this.proCoursesOption = page.getByRole('link', { name: 'Pro Courses' });

        this.continueLearningButton = page.locator('button.btn-cancel').filter({ hasText: 'Continue Learning' }).first();
        // Quiz Challenge tab on Course View page
        this.quizButton = page.locator('button.tab').filter({ hasText: 'Quiz Challenge' }).first();
        // Start Quiz button on Quiz list page
        this.startQuizButton = page.locator('button.action-btn.btn-primary').filter({ hasText: 'Start Quiz' }).first();
        // Start Quiz button inside the popup that appears after clicking Start Quiz on quiz list
        this.startQuizPopupButton = page.locator('button.btn-primary-gradient').filter({ hasText: 'Start Quiz' }).first();
        this.quizOptions = page.locator('label.custom-radio');
        // Next button
        this.nextButton = page.locator('button.nav-btn').filter({ hasText: 'Next' }).first();
        // Submit button on last question (inside quiz)
        this.submitButton = page.locator('button.nav-btn.submit').filter({ hasText: 'Submit' }).first();
        // Submit Quiz button inside the confirmation popup
        this.submitQuizPopupButton = page.locator('button.btn-submit').filter({ hasText: 'Submit Quiz' }).first();
        // View Solutions button after quiz submission
        // <span class="mdc-button__label">View Solutions</span>
        this.viewSolutionsButton = page.locator('span.mdc-button__label').filter({ hasText: 'View Solutions' }).first();

        // Back to Challenges button
        // <button class="back-button">← Back to Challenges</button>
        this.backToChallengesButton = page.locator('button.back-button').filter({ hasText: 'Back to Challenges' }).first();


    }


    async openSidebar() {
        await this.page.waitForLoadState('networkidle');
        await this.menuButton.waitFor({ state: 'visible' });
        await this.menuButton.click();
        await this.proCoursesOption.first().waitFor({ state: 'visible', timeout: 50000 });
    }

    async goToProCourses() {
        await Promise.all([
            this.page.waitForNavigation({ waitUntil: 'networkidle' }),
            this.proCoursesOption.first().click(),
        ]);
    }

    async clickContinueLearning() {
        // Scroll the button into view first — it is below the fold on the course list page
        await this.continueLearningButton.waitFor({ state: 'visible', timeout: 20000 });
        await this.continueLearningButton.scrollIntoViewIfNeeded();
        await this.continueLearningButton.waitFor({ state: 'visible', timeout: 10000 });
        await Promise.all([
            this.page.waitForNavigation({ waitUntil: 'networkidle' }),
            this.continueLearningButton.click(),
        ]);
    }
    async clickQuizChallenge() {
        await this.quizButton.waitFor({ state: 'visible', timeout: 20000 });
        await this.quizButton.click();
        await this.page.waitForLoadState('networkidle');
    }
    async clickStartQuiz() {
        await this.startQuizButton.waitFor({ state: 'visible', timeout: 20000 });
        // Wait for popup overlay to appear and block, then click the popup button directly
        await this.page.waitForTimeout(1000);
        await this.startQuizButton.click({ force: true });
        await this.page.waitForLoadState('networkidle');
    }
    async clickStartQuizPopup() {
        await this.startQuizPopupButton.waitFor({ state: 'visible', timeout: 20000 });
        await this.startQuizPopupButton.click();
        // Wait for popup to close and quiz to start
        await this.page.waitForTimeout(1000);
    }
    async attemptQuiz() {
        while (true) {
            await this.quizOptions.first().waitFor({ state: 'visible', timeout: 30000 });

            // Select a random option
            const options = await this.quizOptions.all();
            const randomIndex = Math.floor(Math.random() * options.length);
            await options[randomIndex].click();
            await this.page.waitForTimeout(500);

            // Check if Submit button is visible (last question)
            const isSubmitVisible = await this.submitButton.isVisible();
            if (isSubmitVisible) {
                // Click Submit — this opens the confirmation popup
                await this.submitButton.click();
                await this.page.waitForTimeout(1000);

                // Click Submit Quiz inside the popup
                await this.submitQuizPopupButton.waitFor({ state: 'visible', timeout: 10000 });
                await this.submitQuizPopupButton.click();
                await this.page.waitForLoadState('networkidle');
                break;
            }

            // Check if Next button is visible
            const isNextVisible = await this.nextButton.isVisible();
            if (isNextVisible) {
                await this.nextButton.click();
                await this.page.waitForTimeout(500);
            } else {
                break;
            }
        }
    }
    async clickViewSolutions() {
        await this.viewSolutionsButton.waitFor({ state: 'visible', timeout: 20000 });
        await this.viewSolutionsButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async scrollThroughSolutions() {
        // Scroll down slowly through the solutions page
        await this.page.evaluate(async () => {
            await new Promise((resolve) => {
                let totalHeight = 0;
                const distance = 300;
                const timer = setInterval(() => {
                    window.scrollBy(0, distance);
                    totalHeight += distance;
                    if (totalHeight >= document.body.scrollHeight) {
                        clearInterval(timer);
                        resolve(true);
                    }
                }, 500);
            });
        });
        await this.page.waitForTimeout(2000);
    }

    async clickBackToChallenges() {
        await this.backToChallengesButton.waitFor({ state: 'visible', timeout: 20000 });
        await this.backToChallengesButton.click();
        await this.page.waitForLoadState('networkidle');
    }
}
