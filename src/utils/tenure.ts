// Formats how long since a start month/year, rounded to the nearest 0.5 years,
// as a short string like "3 yrs". Shared by build-time rendering and the client
// so the value can be recalculated on the fly without a redeploy.
export function tenureYears(startYear: number, startMonthIndex: number, now: Date = new Date()): string {
    const months = (now.getFullYear() - startYear) * 12 + (now.getMonth() - startMonthIndex)
    const halfYears = Math.round(months / 6) / 2
    return `${halfYears} yrs`
}

// May 2023 — Atlassian start date (monthIndex is 0-based, matching Date).
export const ATLASSIAN_START = {year: 2023, monthIndex: 4} as const
