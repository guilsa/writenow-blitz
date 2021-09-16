import { useRef, useState, useEffect, SyntheticEvent, ChangeEvent } from "react"

export const Textarea = ({ initialData, handleChange, ...props }) => {
  const [value, setValue] = useState<String>()
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const handleChangeLocal = (e: React.FormEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value)
    handleChange(e.currentTarget.value)
  }

  useEffect(() => {
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = "0px"
      const scrollHeight = textareaRef.current.scrollHeight
      textareaRef.current.style.height = scrollHeight + "px"
    }
  }, [value])

  return (
    <>
      <textarea
        ref={textareaRef}
        style={{
          fontSize: 16,
          width: "100%",
          height: "600px",
          border: "none",
          outline: 0,
          resize: "none",
          overflow: "hidden",
        }}
        value={initialData}
        onChange={(e) => handleChangeLocal(e)}
        // {...props}
      ></textarea>
    </>
  )
}
