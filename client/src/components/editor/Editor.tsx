import { useAppContext } from "@/context/AppContext"
import { useFileSystem } from "@/context/FileContext"
import { useSettings } from "@/context/SettingContext"
import { useSocket } from "@/context/SocketContext"
import usePageEvents from "@/hooks/usePageEvents"
import useResponsive from "@/hooks/useResponsive"
import { FileSystemItem } from "@/types/file"
import { SocketEvent } from "@/types/socket"
import { LanguageName, loadLanguage } from "@uiw/codemirror-extensions-langs"
import CodeMirror, {
    Extension,
    ViewUpdate,
    scrollPastEnd,
} from "@uiw/react-codemirror"
import { useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"
import { cursorTooltipBaseTheme, tooltipField } from "./tooltip"
import { EditorView } from "@codemirror/view"
import '../../styles/global.css'
function Editor() {
    const { users, currentUser } = useAppContext()
    const { activeFile, setActiveFile } = useFileSystem()
    const { language, fontSize } = useSettings()
    const { socket } = useSocket()
    const { viewHeight } = useResponsive()
    const [timeOut, setTimeOut] = useState(setTimeout(() => {}, 0))
    const filteredUsers = useMemo(
        () => users.filter((u) => u.username !== currentUser.username),
        [users, currentUser],
    )
    const [extensions, setExtensions] = useState<Extension[]>([])

    const onCodeChange = (code: string, view: ViewUpdate) => {
        if (!activeFile) return

        const file: FileSystemItem = { ...activeFile, content: code }
        setActiveFile(file)
        const cursorPosition = view.state?.selection?.main?.head
        socket.emit(SocketEvent.TYPING_START, { cursorPosition })
        socket.emit(SocketEvent.FILE_UPDATED, {
            fileId: activeFile.id,
            newContent: code,
        })
        clearTimeout(timeOut)

        const newTimeOut = setTimeout(
            () => socket.emit(SocketEvent.TYPING_PAUSE),
            1000,
        )
        setTimeOut(newTimeOut)
    }

    // handle zoom and page events
    usePageEvents()

    useEffect(() => {
        // custom theme for editor
        const codeNestTheme = EditorView.theme(
            {
                "&": {
                    backgroundColor: "#000000",
                    color: "#ffffff",
                },
                ".cm-scroller": {
                    backgroundColor: "#000000",
                },
                ".cm-content": {
                    backgroundColor: "#0d0d0d",
                },
                ".cm-gutters": {
                    backgroundColor: "#000000",
                    color: "#a3a3a3",
                    borderRight: "1px solid #333333",
                },
                ".cm-lineNumbers .cm-gutterElement": {
                    color: "#a3a3a3",
                },
                ".cm-foldGutter .cm-gutterElement": {
                    color: "#a3a3a3",
                },
                ".cm-activeLine": {
                    backgroundColor: "#111111",
                },
                ".cm-activeLineGutter": {
                    backgroundColor: "#111111",
                    color: "#ffffff",
                },
                ".cm-selectionBackground, .cm-content ::selection": {
                    backgroundColor: "#1f1f1f80",
                },
                ".cm-cursor": {
                    borderLeftColor: "#ffffff",
                },
                ".cm-tooltip": {
                    backgroundColor: "#000000",
                    border: "1px solid #333333",
                    color: "#ffffff",
                },
            },
            { dark: true },
        )

        const extensions = [
            tooltipField(filteredUsers),
            cursorTooltipBaseTheme,
            scrollPastEnd(),
            codeNestTheme,
        ]
        const langExt = loadLanguage(language.toLowerCase() as LanguageName)
        if (langExt) {
            extensions.push(langExt)
        } else {
            toast.error(
                "Syntax highlighting is unavailable for this language. Please adjust the editor settings; it may be listed under a different name.",
                {
                    duration: 5000,
                },
            )
        }

        setExtensions(extensions)
    }, [filteredUsers, language])

    return (
        <CodeMirror
            onChange={onCodeChange}
            value={activeFile?.content}
            extensions={extensions}
            minHeight="100%"
            maxWidth="100vw"
            style={{
                fontSize: fontSize + "px",
                height: viewHeight,
                position: "relative",
            }}
        />
    )
}

export default Editor
