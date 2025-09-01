import { useAppContext } from "@/context/AppContext"
import { useFileSystem } from "@/context/FileContext"
import { useViews } from "@/context/ViewContext"
import { useContextMenu } from "@/hooks/useContextMenu"
import useWindowDimensions from "@/hooks/useWindowDimensions"
import { ACTIVITY_STATE } from "@/types/app"
import { FileSystemItem, Id } from "@/types/file"
import { sortFileSystemItem } from "@/utils/file"
import { getIconClassName } from "@/utils/getIconClassName"
import { Icon } from "@iconify/react"
import cn from "classnames"
import { MouseEvent, useEffect, useRef, useState } from "react"
import { AiOutlineFolder, AiOutlineFolderOpen } from "react-icons/ai"
import { MdDelete } from "react-icons/md"
import { PiPencilSimpleFill } from "react-icons/pi"
import {
    RiFileAddLine,
    RiFolderAddLine,
} from "react-icons/ri"
import RenameView from "./RenameView"
import useResponsive from "@/hooks/useResponsive"
import '../../styles/global.css'
function FileStructureView() {
    const {
        fileStructure,
        createFile,
        createDirectory,
        deleteFile,
        deleteDirectory,
    } = useFileSystem()
    const explorerRef = useRef<HTMLDivElement | null>(null)
    const [selectedDirId, setSelectedDirId] = useState<Id | null>(null)
    const { minHeightReached } = useResponsive()
    const [isCreating, setIsCreating] = useState<false | "file" | "directory">(false)
    const [createName, setCreateName] = useState("")
    const createInputRef = useRef<HTMLInputElement | null>(null)
    const [confirmDelete, setConfirmDelete] = useState<
        | { type: "file" | "directory"; id: Id; name?: string }
        | null
    >(null)

    const handleClickOutside = (e: MouseEvent) => {
        if (
            explorerRef.current &&
            !explorerRef.current.contains(e.target as Node)
        ) {
            setSelectedDirId(fileStructure.id)
        }
    }

    const startCreate = (type: "file" | "directory") => {
        setIsCreating(type)
        setCreateName("")
        setTimeout(() => createInputRef.current?.focus(), 0)
    }

    const confirmCreate = () => {
        const name = createName.trim()
        if (!name) return
        const parentDirId: Id = selectedDirId || fileStructure.id
        if (isCreating === "file") createFile(parentDirId, name)
        if (isCreating === "directory") createDirectory(parentDirId, name)
        setIsCreating(false)
        setCreateName("")
    }

    const cancelCreate = () => {
        setIsCreating(false)
        setCreateName("")
    }



    const sortedFileStructure = sortFileSystemItem(fileStructure)



    const performDelete = () => {
        if (!confirmDelete) return
        if (confirmDelete.type === "file") {
            deleteFile(confirmDelete.id)
        } else {
            deleteDirectory(confirmDelete.id)
        }
        setConfirmDelete(null)
    }

    return (
        <div onClick={handleClickOutside} className="relative flex flex-grow flex-col bg-[#1a1a1a] w-full">
            <div className="flex justify-between items-center p-4 border-b border-[#333333] bg-[#1a1a1a] relative">
                <h2 className="text-white text-lg">Files</h2>
                <div className="flex gap-2">
                    <button
                        className="rounded-lg p-2 hover:bg-[#262626] text-gray-400 hover:text-white transition-colors"
                        onClick={() => startCreate("file")}
                        title="Create File"
                    >
                        <RiFileAddLine size={20} />
                    </button>
                    <button
                        className="rounded-lg p-2 hover:bg-[#262626] text-gray-400 hover:text-white transition-colors"
                        onClick={() => startCreate("directory")}
                        title="Create Directory"
                    >
                        <RiFolderAddLine size={20} />
                    </button>

                </div>
                {isCreating && (
                    <div className="absolute left-4 top-full z-30 mt-3 w-[calc(100%-2rem)] max-w-[360px] overflow-hidden rounded-lg border border-[#333333] bg-[#0d0d0d] p-3 shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
                        <label className="block text-sm text-gray-300 mb-2">
                            {isCreating === "file" ? "Enter file name" : "Enter folder name"}
                        </label>
                        <input
                            ref={createInputRef}
                            value={createName}
                            onChange={(e) => setCreateName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") confirmCreate()
                                if (e.key === "Escape") cancelCreate()
                            }}
                            placeholder={isCreating === "file" ? "index.ts" : "src"}
                            className="w-full min-w-0 bg-[#262626] border border-[#333333] rounded-lg px-3 py-2 text-white outline-none focus:border-[#404040]"
                        />
                        <div className="mt-2 flex items-center justify-end gap-2">
                            <button
                                onClick={cancelCreate}
                                className="px-3 py-2 rounded-lg hover:bg-[#262626] text-gray-300"
                                title="Cancel"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmCreate}
                                className="px-3 py-2 rounded-lg bg-[#333333] hover:bg-[#404040] text-white"
                                title="Create"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div
                className={cn(
                    "min-h-[200px] flex-grow overflow-auto p-4 sm:min-h-0 bg-[#1a1a1a] w-full",
                    {
                        "h-[calc(80vh-170px)]": !minHeightReached,
                        "h-[85vh]": minHeightReached,
                    },
                )}
                ref={explorerRef}
            >
                {sortedFileStructure.children &&
                    sortedFileStructure.children.map((item) => (
                        <Directory
                            key={item.id}
                            item={item}
                            setSelectedDirId={setSelectedDirId}
                            
                        />
                    ))}
            </div>

            {confirmDelete && (
                <div className="absolute inset-0 z-40 flex items-start justify-center pt-24 bg-black/30">
                    <div className="w-[90%] max-w-[360px] rounded-lg border border-[#333333] bg-[#0d0d0d] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
                        <p className="text-white mb-4">
                            {`Are you sure you want to delete ${
                                confirmDelete.type === "file" ? "file" : "directory"
                            }${confirmDelete.name ? ` \"${confirmDelete.name}\"` : ""}?`}
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="px-3 py-2 rounded-lg hover:bg-[#262626] text-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={performDelete}
                                className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function Directory({
    item,
    setSelectedDirId,
}: {
    item: FileSystemItem
    setSelectedDirId: (id: Id) => void
}) {
    const [isEditing, setEditing] = useState<boolean>(false)
    const dirRef = useRef<HTMLDivElement | null>(null)
    const { coords, menuOpen, setMenuOpen } = useContextMenu({
        ref: dirRef,
    })
    const { toggleDirectory, deleteDirectory } = useFileSystem()

    const handleDirClick = (dirId: string) => {
        setSelectedDirId(dirId)
        toggleDirectory(dirId)
    }

    const handleRenameDirectory = (e: MouseEvent) => {
        e.stopPropagation()
        setMenuOpen(false)
        setEditing(true)
    }

    const handleDeleteDirectory = (e: MouseEvent, id: Id) => {
        e.stopPropagation()
        setMenuOpen(false)
        deleteDirectory(id)
    }

    // Add F2 key event listener to directory for renaming
    useEffect(() => {
        const dirNode = dirRef.current

        if (!dirNode) return

        dirNode.tabIndex = 0

        const handleF2 = (e: KeyboardEvent) => {
            e.stopPropagation()
            if (e.key === "F2") {
                setEditing(true)
            }
        }

        dirNode.addEventListener("keydown", handleF2)

        return () => {
            dirNode.removeEventListener("keydown", handleF2)
        }
    }, [])

    if (item.type === "file") {
        return <File item={item} setSelectedDirId={setSelectedDirId} />
    }

    return (
        <div className="overflow-x-auto">
            <div
                className="flex w-full items-center rounded-lg px-3 py-2 hover:bg-[#262626] text-gray-400 hover:text-white transition-colors"
                onClick={() => handleDirClick(item.id)}
                ref={dirRef}
            >
                {item.isOpen ? (
                    <AiOutlineFolderOpen size={24} className="mr-2 min-w-fit" />
                ) : (
                    <AiOutlineFolder size={24} className="mr-2 min-w-fit" />
                )}
                {isEditing ? (
                    <RenameView
                        id={item.id}
                        preName={item.name}
                        type="directory"
                        setEditing={setEditing}
                    />
                ) : (
                    <p
                        className="flex-grow cursor-pointer overflow-hidden truncate"
                        title={item.name}
                    >
                        {item.name}
                    </p>
                )}
            </div>
            <div
                className={cn(
                    { hidden: !item.isOpen },
                    { block: item.isOpen },
                    { "pl-4": item.name !== "root" },
                )}
            >
                {item.children &&
                    item.children.map((item) => (
                        <Directory
                            key={item.id}
                            item={item}
                            setSelectedDirId={setSelectedDirId}
                        />
                    ))}
            </div>

            {menuOpen && (
                <DirectoryMenu
                    handleDeleteDirectory={handleDeleteDirectory}
                    handleRenameDirectory={handleRenameDirectory}
                    id={item.id}
                    left={coords.x}
                    top={coords.y}
                />
            )}
        </div>
    )
}

const File = ({
    item,
    setSelectedDirId,
}: {
    item: FileSystemItem
    setSelectedDirId: (id: Id) => void
}) => {
    const { openFile, deleteFile } = useFileSystem()
    const [isEditing, setEditing] = useState<boolean>(false)
    const { setIsSidebarOpen } = useViews()
    const { isMobile } = useWindowDimensions()
    const { activityState, setActivityState } = useAppContext()
    const fileRef = useRef<HTMLDivElement | null>(null)
    const { menuOpen, coords, setMenuOpen } = useContextMenu({
        ref: fileRef,
    })

    const handleFileClick = (fileId: string) => {
        if (isEditing) return
        setSelectedDirId(fileId)

        openFile(fileId)
        if (isMobile) {
            setIsSidebarOpen(false)
        }
        if (activityState === ACTIVITY_STATE.DRAWING) {
            setActivityState(ACTIVITY_STATE.CODING)
        }
    }

    const handleRenameFile = (e: MouseEvent) => {
        e.stopPropagation()
        setEditing(true)
        setMenuOpen(false)
    }

    const handleDeleteFile = (e: MouseEvent, id: Id) => {
        e.stopPropagation()
        setMenuOpen(false)
        deleteFile(id)
    }

    // Add F2 key event listener to file for renaming
    useEffect(() => {
        const fileNode = fileRef.current

        if (!fileNode) return

        fileNode.tabIndex = 0

        const handleF2 = (e: KeyboardEvent) => {
            e.stopPropagation()
            if (e.key === "F2") {
                setEditing(true)
            }
        }

        fileNode.addEventListener("keydown", handleF2)

        return () => {
            fileNode.removeEventListener("keydown", handleF2)
        }
    }, [])

    return (
        <div
            className="flex w-full items-center rounded-md px-2 py-1 hover:bg-primaryLight text-white"
            onClick={() => handleFileClick(item.id)}
            ref={fileRef}
        >
            <Icon
                icon={getIconClassName(item.name)}
                fontSize={22}
                className="mr-2 min-w-fit"
            />
            {isEditing ? (
                <RenameView
                    id={item.id}
                    preName={item.name}
                    type="file"
                    setEditing={setEditing}
                />
            ) : (
                <p
                    className="flex-grow cursor-pointer overflow-hidden truncate"
                    title={item.name}
                >
                    {item.name}
                </p>
            )}

            {/* Context Menu For File*/}
            {menuOpen && (
                <FileMenu
                    top={coords.y}
                    left={coords.x}
                    id={item.id}
                    handleRenameFile={handleRenameFile}
                    handleDeleteFile={handleDeleteFile}
                />
            )}
        </div>
    )
}

const FileMenu = ({
    top,
    left,
    id,
    handleRenameFile,
    handleDeleteFile,
}: {
    top: number
    left: number
    id: Id
    handleRenameFile: (e: MouseEvent) => void
    handleDeleteFile: (e: MouseEvent, id: Id) => void
}) => {
    return (
        <div
            className="absolute z-10 w-[150px] rounded-lg border border-[#333333] bg-[#1a1a1a] p-2 text-white"
            style={{
                top,
                left,
            }}
        >
            <button
                onClick={handleRenameFile}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-[#262626] text-gray-400 hover:text-white transition-colors"
            >
                <PiPencilSimpleFill size={18} />
                Rename
            </button>
            <button
                onClick={(e) => handleDeleteFile(e, id)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-[#262626] text-red-500 hover:text-red-400 transition-colors"
            >
                <MdDelete size={20} />
                Delete
            </button>
        </div>
    )
}

const DirectoryMenu = ({
    top,
    left,
    id,
    handleRenameDirectory,
    handleDeleteDirectory,
}: {
    top: number
    left: number
    id: Id
    handleRenameDirectory: (e: MouseEvent) => void
    handleDeleteDirectory: (e: MouseEvent, id: Id) => void
}) => {
    return (
        <div
            className="absolute z-10 w-[150px] rounded-lg border border-[#333333] bg-[#1a1a1a] p-2 text-white"
            style={{
                top,
                left,
            }}
        >
            <button
                onClick={handleRenameDirectory}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-[#262626] text-gray-400 hover:text-white transition-colors"
            >
                <PiPencilSimpleFill size={18} />
                Rename
            </button>
            <button
                onClick={(e) => handleDeleteDirectory(e, id)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-[#262626] text-red-500 hover:text-red-400 transition-colors"
            >
                <MdDelete size={20} />
                Delete
            </button>
        </div>
    )
}

export default FileStructureView
