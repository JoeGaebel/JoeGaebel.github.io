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
        // Wait for the astro-island to hydrate
        await page.waitForFunction(() => {
            const island = document.querySelector("#reviews astro-island")
            return island && island.hasAttribute("client-render-time")
        }, {timeout: 10000})
        await page.waitForTimeout(500)
        const seeMore = page.locator("#reviews button", {hasText: "See more"})
        await expect(seeMore).toBeVisible()
        await seeMore.click()
        await page.waitForTimeout(1500)
        await expect(page.locator("#reviews button", {hasText: "See less"})).toBeVisible()
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
