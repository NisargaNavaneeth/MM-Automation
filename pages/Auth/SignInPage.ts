import { Page, Locator } from '@playwright/test';

export class SignInPage {
    readonly page: Page;

    // Shared Locators
    readonly homeSignInButton: Locator;

    // Email Login Locators
    readonly loginWithEmailOption: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly submitLoginButton: Locator;

    // Phone & OTP Login Locators
    readonly phoneInput: Locator;
    readonly sendOtpButton: Locator;
    readonly otpBoxes: Locator;
    readonly verifyOtpButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Shared
        this.homeSignInButton = page.getByText('Sign In', { exact: true });

        // Email flow
        this.loginWithEmailOption = page.getByText('Login with Email', { exact: true });
        this.emailInput = page.locator('#email');
        this.passwordInput = page.locator('#password');
        this.submitLoginButton = page.getByRole('button', { name: 'Login', exact: true });

        // Phone flow
        this.phoneInput = page.locator('input.auth-phone-input');
        this.sendOtpButton = page.getByRole('button', { name: 'Send OTP' });
        this.otpBoxes = page.locator('input.otp-box');
        this.verifyOtpButton = page.getByRole('button', { name: 'Verify & Sign In' });
    }

    /**
     * Navigates to the base URL and opens the initial login modal/page
     */
    async openLoginView() {
        await this.page.goto('/');
        await this.homeSignInButton.click();
    }

    /**
     * Switches from the default Phone view to Email view
     */
    async openEmailLoginForm() {
        await this.openLoginView();
        await this.loginWithEmailOption.click();
    }

    /**
     * Fills in the email/password credentials and submits the login form
     */
    async loginWithEmail(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.submitLoginButton.click();
    }

    /**
     * Executes the phone login and OTP verification flow
     */
    async loginWithPhoneAndOtp(phone: string, otp: string) {
        await this.phoneInput.fill(phone);
        await this.sendOtpButton.click();

        // Fill out the 6 OTP boxes
        const otpArray = otp.split('');
        for (let i = 0; i < otpArray.length; i++) {
            await this.otpBoxes.nth(i).fill(otpArray[i]);
            await this.page.waitForTimeout(100);
        }
        // headless in parallel — waiting explicitly here is more reliable.
        await this.page.waitForFunction(() => {
            const btn = document.querySelector('button[type="submit"].auth-submit') as HTMLButtonElement;
            return btn !== null && !btn.disabled;
        }, { timeout: 15000 });


        // Click verify to submit
        await this.verifyOtpButton.click();
    }
}
