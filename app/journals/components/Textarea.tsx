export const Textarea = ({ data }) => {
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
        defaultValue={data}
      ></textarea>
    </>
  )
}
