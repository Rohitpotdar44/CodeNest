import { useViews } from "@/context/ViewContext"
import useLocalStorage from "@/hooks/useLocalStorage"
import useWindowDimensions from "@/hooks/useWindowDimensions"
import { ReactNode } from "react"
import Split from "react-split"
import '../styles/global.css'
function SplitterComponent({ children }: { children: ReactNode }) {
    const { isSidebarOpen } = useViews()
    const { isMobile, width } = useWindowDimensions()
    const { setItem, getItem } = useLocalStorage()

    const getGutter = () => {
        const gutter = document.createElement("div")
                 gutter.className = "h-full cursor-col-resize hidden md:flex md:items-center md:justify-center hover:before:opacity-100 before:opacity-0 before:content-[''] before:absolute before:w-[2px] before:h-full before:bg-[#404040] before:transition-opacity relative after:content-[''] after:absolute after:w-[4px] after:h-full after:bg-transparent hover:after:bg-[#404040]/10 after:transition-colors"
                 gutter.style.backgroundColor = "transparent"
        return gutter
    }

    const getSizes = () => {
        if (isMobile) return [0, width]
        const savedSizes = getItem("editorSizes")
                 let sizes = [30, 70]
        if (savedSizes) {
            sizes = JSON.parse(savedSizes)
        }
        // keep space for icon rail when closed
        if (!isSidebarOpen) {
            const railPercent = Math.max(0.5, (70 / width) * 100)
            return [railPercent, 100 - railPercent]
        }
        return sizes
    }

    const getMinSizes = () => {
        if (isMobile) return [0, width]
                 // min sizes for sidebar + editor
                 return isSidebarOpen ? [370, 400] : [50, 0]
    }

    const getMaxSizes = () => {
        if (isMobile) return [0, width]
                 // max sizes for sidebar + editor
                 return isSidebarOpen ? [570, width] : [70, width]
    }

    const handleGutterDrag = (sizes: number[]) => {
        setItem("editorSizes", JSON.stringify(sizes))
    }

    const getGutterStyle = () => ({
                 width: "6px",
        display: isSidebarOpen && !isMobile ? "block" : "none",
    })

    return (
        <Split
            sizes={getSizes()}
            minSize={getMinSizes()}
            gutter={getGutter}
            maxSize={getMaxSizes()}
            dragInterval={1}
            direction="horizontal"
            gutterAlign="center"
                         cursor="col-resize"
            snapOffset={30}
            gutterStyle={getGutterStyle}
            onDrag={handleGutterDrag}
            className="flex h-screen min-h-screen w-full items-stretch overflow-hidden"
        >
            {children}
        </Split>
    )
}

export default SplitterComponent
