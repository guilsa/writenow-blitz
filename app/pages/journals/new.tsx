import { useEffect, useState } from "react"
import { useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createJournal from "app/journals/mutations/createJournal"
import { JournalForm, FORM_ERROR } from "app/journals/components/JournalForm"

import { Textarea } from "app/journals/components/Textarea"

import { countWords } from "app/journals/utils/helper"

const NewJournalPage: BlitzPage = () => {
  const router = useRouter()
  const [createJournalMutation] = useMutation(createJournal)

  const [content, setContent] = useState("")
  const [wordCount, setWordCount] = useState(0)

  const date = new Date()

  useEffect(() => {
    setWordCount(countWords(content))
  }, [content])

  return (
    <>
      <p
        style={{
          color: "rgb(77, 181, 89)",
          fontWeight: "bold",
          fontSize: 24,
          fontFamily: "Menlo",
        }}
      >
        {date.toDateString()}
      </p>
      <Textarea initialData={""} handleChange={(e) => setContent(e)} />
      <div>{wordCount} words</div>
      <br />
      <button
        onClick={async () => {
          try {
            const journal = await createJournalMutation({ content, wordCount })
            router.push(Routes.ShowJournalPage({ journalId: journal.id }))
          } catch (error) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      >
        Save
      </button>
    </>
  )
}

NewJournalPage.authenticate = true
NewJournalPage.getLayout = (page) => (
  <Layout title={"Create New Journal"}>{page}</Layout>
)

export default NewJournalPage
