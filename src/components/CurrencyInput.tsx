import React, { ComponentProps, FunctionComponent } from "react"

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const pattern = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group

const CurrencyInput: FunctionComponent<{
    value: string | number
    onChange: (s: string) => void
    className?: string
    name?: string
    type?: string
}> = ({ value, onChange, ...props }) => (
    <input
        { ...props }
        
        inputMode="decimal"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        type="text"

        pattern="^[0-9]*[.,]?[0-9]*$"
        minLength={1} maxLength={79}

        placeholder="0.0"

        value={value}
        onChange={({ target: { value: v }}) => { if (v === "" || pattern.test(escapeRegExp(v))) { onChange(v) } }} />
)

export default CurrencyInput