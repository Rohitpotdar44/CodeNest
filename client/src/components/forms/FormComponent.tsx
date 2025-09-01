import { useAppContext } from "@/context/AppContext"
import { useSocket } from "@/context/SocketContext"
import { SocketEvent } from "@/types/socket"
import { USER_STATUS } from "@/types/user"
import { ChangeEvent, FormEvent, useEffect, useRef } from "react"
import { toast } from "react-hot-toast"
import { useLocation, useNavigate } from "react-router-dom"
import { v4 as uuidv4 } from "uuid"
import '../../styles/global.css'
const FormComponent = () => {
    const location = useLocation()
    const { currentUser, setCurrentUser, status, setStatus } = useAppContext()
    const { socket } = useSocket()

    const usernameRef = useRef<HTMLInputElement | null>(null)
    const navigate = useNavigate()

    const createNewRoomId = () => {
        setCurrentUser({ ...currentUser, roomId: uuidv4() })
        toast.success("Created a new Room Id")
        usernameRef.current?.focus()
    }

    const handleInputChanges = (e: ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name
        const value = e.target.value
        setCurrentUser({ ...currentUser, [name]: value })
    }

    const validateForm = () => {
        if (currentUser.username.trim().length === 0) {
            toast.error("Enter your username")
            return false
        } else if (currentUser.roomId.trim().length === 0) {
            toast.error("Enter a room id")
            return false
        } else if (currentUser.roomId.trim().length < 5) {
            toast.error("ROOM Id must be at least 5 characters long")
            return false
        } else if (currentUser.username.trim().length < 3) {
            toast.error("Username must be at least 3 characters long")
            return false
        }
        return true
    }

    const joinRoom = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (status === USER_STATUS.ATTEMPTING_JOIN) return
        if (!validateForm()) return
        toast.loading("Joining room...")
        setStatus(USER_STATUS.ATTEMPTING_JOIN)
        socket.emit(SocketEvent.JOIN_REQUEST, currentUser)
    }

    useEffect(() => {
        if (currentUser.roomId.length > 0) return
        if (location.state?.roomId) {
            setCurrentUser({ ...currentUser, roomId: location.state.roomId })
            if (currentUser.username.length === 0) {
                toast.success("Enter your username")
            }
        }
    }, [currentUser, location.state?.roomId, setCurrentUser])

    useEffect(() => {
        if (status === USER_STATUS.DISCONNECTED && !socket.connected) {
            socket.connect()
            return
        }

        const isRedirect = sessionStorage.getItem("redirect") || false

        if (status === USER_STATUS.JOINED && !isRedirect) {
            const username = currentUser.username
            sessionStorage.setItem("redirect", "true")
            navigate(`/editor/${currentUser.roomId}`, {
                state: {
                    username,
                },
            })
        } else if (status === USER_STATUS.JOINED && isRedirect) {
            sessionStorage.removeItem("redirect")
            setStatus(USER_STATUS.DISCONNECTED)
            socket.disconnect()
            socket.connect()
        }
    }, [currentUser, location.state?.redirect, navigate, setStatus, socket, status])

    return (
        <div className="w-full max-w-md">
            {/* Ultra-modern glassmorphic form */}
            <div className="bg-[#1a1a1a] p-8 relative overflow-hidden border border-[#333333] rounded-lg">
                {/* Header section */}
                <div className="relative text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-3">Join Workspace</h2>
                    <p className="text-gray-400 text-sm">Enter the future of collaborative coding</p>
                </div>

                <form onSubmit={joinRoom} className="relative space-y-6">
                    {/* Room ID input with floating label */}
                    <div className="relative group">
                        <input
                            id="roomId"
                            type="text"
                            name="roomId"
                            placeholder=" "
                            className="w-full peer placeholder-transparent bg-[#262626] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gray-500 transition-colors"
                            onChange={handleInputChanges}
                            value={currentUser.roomId}
                        />
                        <label 
                            htmlFor="roomId" 
                            className="absolute left-4 -top-2.5 text-sm font-medium text-gray-400 bg-[#1a1a1a] px-2 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-white peer-focus:text-sm peer-focus:bg-[#1a1a1a]"
                        >
                            Room ID
                        </label>
                    </div>
                    
                    {/* Username input with floating label */}
                    <div className="relative group">
                        <input
                            id="username"
                            type="text"
                            name="username"
                            placeholder=" "
                            className="w-full peer placeholder-transparent bg-[#262626] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gray-500 transition-colors"
                            onChange={handleInputChanges}
                            value={currentUser.username}
                            ref={usernameRef}
                        />
                        <label 
                            htmlFor="username" 
                            className="absolute left-4 -top-2.5 text-sm font-medium text-gray-400 bg-[#1a1a1a] px-2 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-white peer-focus:text-sm peer-focus:bg-[#1a1a1a]"
                        >
                            Username
                        </label>
                    </div>

                    {/* Ultra-modern submit button */}
                    <button
                        type="submit"
                        className="w-full text-lg font-bold relative overflow-hidden group bg-[#333333] hover:bg-[#404040] text-white py-3 rounded-lg transition-colors"
                        disabled={status === USER_STATUS.ATTEMPTING_JOIN}
                    >
                        {/* Button shimmer effect */}
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-1000"></div>
                        
                        {status === USER_STATUS.ATTEMPTING_JOIN ? (
                            <span className="flex items-center justify-center relative z-10">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                                Connecting...
                            </span>
                        ) : (
                            <span className="relative z-10">Launch Workspace</span>
                        )}
                    </button>
                </form>

                {/* Generate room ID link with neon effect */}
                <div className="mt-8 text-center relative">
                    <button
                        type="button"
                        className="text-gray-400 hover:text-white text-sm font-semibold transition-colors duration-300 px-4 py-2 rounded-lg border border-[#333333] hover:border-[#404040] bg-[#262626] hover:bg-[#333333]"
                        onClick={createNewRoomId}
                    >
                        ✨ Generate New Room ID
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FormComponent
