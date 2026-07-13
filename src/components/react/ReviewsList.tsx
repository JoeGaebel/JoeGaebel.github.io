import {useState, useRef, type PropsWithChildren} from "react"

// Reviews are always fully expanded on desktop (md+). On mobile they start
// collapsed with a "See more" / "See less" toggle. The responsive behaviour is
// driven by Tailwind `md:` variants (which override the collapsed classes at the
// breakpoint) so desktop never shows the toggle regardless of React state.
export default function ReviewsList({children}: PropsWithChildren) {
    const [expanded, setExpanded] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    function handleClick() {
        setExpanded(prev => !prev)
        if (expanded) {
            window.scrollTo(0, ref.current!.offsetTop)
        }
    }

    const wrapperClass = expanded
        ? "relative"
        : "relative max-h-[50rem] overflow-hidden md:max-h-none md:overflow-visible"

    return <div ref={ref}>
        <div className={wrapperClass}>
            {children}
            {!expanded && (
                <div
                    className="md:hidden absolute bottom-0 left-0 w-full h-[40%] flex items-end justify-center text-center pb-2"
                    style={{backgroundImage: "linear-gradient(to bottom, transparent, white)"}}
                >
                    <button className="btn" onClick={handleClick}>See more</button>
                </div>
            )}
        </div>
        {expanded && (
            <div className="md:hidden flex items-end justify-center">
                <button className="mt-4 btn" onClick={handleClick}>See less</button>
            </div>
        )}
    </div>
}
