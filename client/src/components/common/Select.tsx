import { ChangeEvent } from "react"
import { PiCaretDownBold } from "react-icons/pi"
import '../../styles/global.css'
interface SelectProps {
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void
    value: string
    options: string[]
    title: string
}

function Select({ onChange, value, options, title }: SelectProps) {
    return (
        <div className="relative w-full">
            <label htmlFor={`select-${title}`} className="mb-2 text-light font-medium">{title}</label>
            <select
                id={`select-${title}`}
                className="w-full appearance-none pr-10 bg-[#262626] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#404040] transition-colors"
                value={value}
                onChange={onChange}
            >
                {options.sort().map((option) => {
                    const value = option
                    const name =
                        option.charAt(0).toUpperCase() + option.slice(1)

                    return (
                        <option key={name} value={value}>
                            {name}
                        </option>
                    )
                })}
            </select>
            <PiCaretDownBold
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
            />
        </div>
    )
}

export default Select
