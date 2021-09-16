import { useRef, useState, useEffect, SyntheticEvent, ChangeEvent } from "react"

export const Textarea = ({ initialData, handleChange, ...props }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = "600px"
      const scrollHeight = textareaRef.current.scrollHeight
      textareaRef.current.style.height = scrollHeight + "px"
    }
  }, [initialData])

  return (
    <>
      <textarea
        ref={textareaRef}
        style={{
          fontSize: 16,
          width: "100%",
          border: "none",
          outline: 0,
          resize: "none",
          overflow: "hidden",
        }}
        value={initialData}
        onChange={(e) => handleChange(e.currentTarget.value)}
        // {...props}
      ></textarea>
    </>
  )
}
