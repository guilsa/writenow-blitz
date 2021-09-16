const countWords = (content: string): number => {
  // Source: http://jsfiddle.net/deepumohanp/jZeKu/
  if (!content || content.length === 0) {
    return 0
  }

  let regex = /\s+/gi
  let wordCount = content.trim().replace(regex, " ").split(" ").length

  return wordCount
}

export { countWords }
