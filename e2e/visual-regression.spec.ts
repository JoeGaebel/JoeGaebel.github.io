import {test, expect} from "@playwright/test"

test.describe("Visual Regression", () => {
    test("home page", async ({page}) => {
        await page.goto("/")
        await page.waitForLoadState("networkidle")
        await page.waitForTimeout(2000)
        await expect(page).toHaveScreenshot("home-full.png", {
            fullPage: true,
            maxDiffPixelRatio: 0.01,
        })
    })

    test("reviews - desktop always expanded, no toggle", async ({page}, testInfo) => {
        test.skip(testInfo.project.name !== "desktop", "desktop-only behaviour")
        await page.goto("/")
        await page.waitForLoadState("networkidle")
        await page.locator("#reviews").scrollIntoViewIfNeeded()
        await page.waitForTimeout(1000)
        // On desktop the toggle is hidden (md:hidden) and reviews render fully expanded.
        await expect(page.locator("#reviews button", {hasText: "See more"})).toBeHidden()
        await expect(page.locator("#reviews button", {hasText: "See less"})).toBeHidden()
    })

    test("reviews - mobile collapsed then expandable", async ({page}, testInfo) => {
        test.skip(testInfo.project.name !== "mobile", "mobile-only behaviour")
        await page.goto("/")
        await page.waitForLoadState("networkidle")
        await page.locator("#reviews").scrollIntoViewIfNeeded()
        // Wait for the astro-island runtime to load, then for the client:visible
        // island to hydrate. Retry the click until "See less" appears so we don't
        // depend on a fixed hydration delay (or dev-only island attributes).
        await page.waitForFunction(() => customElements.get("astro-island") !== undefined, {timeout: 10000})
        const seeMore = page.locator("#reviews button", {hasText: "See more"})
        await expect(seeMore).toBeVisible()
        await expect(async () => {
            await seeMore.click()
            await expect(page.locator("#reviews button", {hasText: "See less"})).toBeVisible({timeout: 1000})
        }).toPass({timeout: 10000})
        await expect(page).toHaveScreenshot("home-reviews-expanded-mobile.png", {
            fullPage: true,
            maxDiffPixelRatio: 0.01,
        })
    })

    test("articles listing", async ({page}) => {
        await page.goto("/articles")
        await page.waitForLoadState("networkidle")
        await expect(page).toHaveScreenshot("articles-listing.png", {
            fullPage: true,
            maxDiffPixelRatio: 0.01,
        })
    })

    test("article post", async ({page}) => {
        await page.goto("/articles/principled-agentic-software-development")
        await page.waitForLoadState("networkidle")
        await page.waitForTimeout(3000)
        await expect(page).toHaveScreenshot("article-post.png", {
            fullPage: true,
            maxDiffPixelRatio: 0.01,
        })
    })

})
