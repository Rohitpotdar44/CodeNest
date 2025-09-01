import { useChatRoom } from "@/context/ChatContext"
import { useViews } from "@/context/ViewContext"
import { VIEWS } from "@/types/view"
import { useState } from "react"
import { Tooltip } from "react-tooltip"
import { buttonStyles, tooltipStyles } from "../tooltipStyles"
import '../../../styles/global.css'
interface ViewButtonProps {
    viewName: VIEWS
    icon: JSX.Element
}

const ViewButton = ({ viewName, icon }: ViewButtonProps) => {
    const { activeView, setActiveView, isSidebarOpen, setIsSidebarOpen } =
        useViews()
    const { isNewMessage } = useChatRoom()
    const [showTooltip, setShowTooltip] = useState(true)

    const handleViewClick = (viewName: VIEWS) => {
        if (viewName === activeView) {
            setIsSidebarOpen(!isSidebarOpen)
        } else {
            setIsSidebarOpen(true)
            setActiveView(viewName)
        }
    }

    return (
        <div className="relative flex flex-col items-center after:absolute after:inset-0 after:rounded-lg after:transition-opacity after:duration-300 hover:after:opacity-100 after:opacity-0 after:bg-gradient-to-r after:from-[#333333] after:to-[#404040] after:blur-xl after:-z-10">
            <button
                onClick={() => handleViewClick(viewName)}
                onMouseEnter={() => setShowTooltip(true)}
                className={`${buttonStyles.base} ${buttonStyles.hover} ${
                    activeView === viewName ? 'bg-[#262626] border-[#404040] text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]' : 'text-gray-400'
                }`}
                {...(showTooltip && {
                    "data-tooltip-id": `tooltip-${viewName}`,
                    "data-tooltip-content": viewName,
                })}
            >
                {/* Button glow effect */}

                
                <div className="flex items-center justify-center relative z-10">
                    <span className="transition-colors">
                        {icon}
                    </span>
                </div>
                
                {/* Enhanced notification dot for chat */}
                {viewName === VIEWS.CHATS && isNewMessage && (
                    <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-500 border border-[#333333]"></div>
                )}
            </button>
            {/* render the tooltip */}
            {showTooltip && (
                <Tooltip
                    id={`tooltip-${viewName}`}
                    place="right"
                    offset={25}
                    className="!z-50"
                    style={tooltipStyles}
                    noArrow={false}
                    positionStrategy="fixed"
                    float={true}
                />
            )}
        </div>
    )
}

export default ViewButton
