import { useRunCode } from "@/context/RunCodeContext"
import useResponsive from "@/hooks/useResponsive"
import { ChangeEvent } from "react"
import toast from "react-hot-toast"
import { LuCopy } from "react-icons/lu"
import { PiCaretDownBold } from "react-icons/pi"
import '../../../styles/global.css'
function RunView() {
    const { viewHeight } = useResponsive()
    const {
        setInput,
        output,
        isRunning,
        supportedLanguages,
        selectedLanguage,
        setSelectedLanguage,
        runCode,
    } = useRunCode()

    const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const lang = JSON.parse(e.target.value)
        setSelectedLanguage(lang)
    }

    const copyOutput = () => {
        navigator.clipboard.writeText(output)
        toast.success("Output copied to clipboard")
    }

    return (
        <div
            className="flex flex-col gap-4 p-4"
            style={{ height: viewHeight }}
        >
            <h1 className="text-lg text-white mb-4">🚀 Run Code</h1>
            <div className="flex h-[90%] w-full flex-col gap-4 md:h-[92%]">
                <div className="relative w-full">
                    <label htmlFor="language-select" className="block text-sm font-medium text-light mb-2">
                        Programming Language
                    </label>
                    <div className="relative">
                        <select
                            id="language-select"
                            className="w-full appearance-none pr-10 bg-[#262626] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#404040] transition-colors"
                            value={JSON.stringify(selectedLanguage)}
                            onChange={handleLanguageChange}
                        >
                            {supportedLanguages
                                .sort((a, b) => (a.language > b.language ? 1 : -1))
                                .map((lang, i) => {
                                    return (
                                        <option
                                            key={i}
                                            value={JSON.stringify(lang)}
                                        >
                                            {lang.language +
                                                (lang.version
                                                    ? ` (${lang.version})`
                                                    : "")}
                                        </option>
                                    )
                                })}
                        </select>
                        <PiCaretDownBold
                            size={16}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-light">Input</label>
                    <textarea
                        className="min-h-[120px] w-full resize-none font-mono bg-[#262626] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#404040] transition-colors"
                        placeholder="Write your input here..."
                        onChange={(e) => setInput(e.target.value)}
                    />
                </div>

                <button
                    className="w-full font-semibold bg-[#333333] hover:bg-[#404040] text-white py-3 rounded-lg transition-colors"
                    onClick={runCode}
                    disabled={isRunning}
                >
                    {isRunning ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Running...
                        </span>
                    ) : (
                        "Run Code"
                    )}
                </button>

                <div className="flex flex-col gap-2 flex-grow">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-light">Output</label>
                        <button 
                            onClick={copyOutput} 
                            title="Copy Output"
                            className="p-1.5 rounded-md hover:bg-darkHover transition-colors duration-200"
                        >
                            <LuCopy size={16} className="text-muted hover:text-light" />
                        </button>
                    </div>
                    <div className="w-full flex-grow overflow-y-auto p-4 bg-[#1a1a1a] border border-[#333333] rounded-lg">
                        <code className="font-mono text-sm">
                            <pre className="text-wrap text-white whitespace-pre-wrap">{output || "No output yet..."}</pre>
                        </code>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RunView
