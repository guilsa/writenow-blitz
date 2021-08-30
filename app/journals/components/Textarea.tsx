export const Textarea = ({ initialData, handleChange }) => {
  return (
    <>
      <textarea
        style={{
          fontSize: 16,
          width: "100%",
          height: "600px",
          border: "none",
          outline: 0,
          resize: "none",
          overflow: "hidden",
          // overflowY: "scroll",
        }}
        defaultValue={initialData}
        onChange={(e) => handleChange(e.target.value)}
      ></textarea>
    </>
  )
}
