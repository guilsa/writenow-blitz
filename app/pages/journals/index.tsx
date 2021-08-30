import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getJournals from "app/journals/queries/getJournals"

const ITEMS_PER_PAGE = 100

export const JournalsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ journals, hasMore }] = usePaginatedQuery(getJournals, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {journals.map((journal) => (
          <li key={journal.id}>
            <Link href={Routes.ShowJournalPage({ journalId: journal.id })}>
              <a>{journal.content}</a>
            </Link>
          </li>
        ))}
      </ul>

      {/* <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button> */}
    </div>
  )
}

const JournalsPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.NewJournalPage()}>
          <a>Create New Journal</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <JournalsList />
      </Suspense>
    </div>
  )
}

JournalsPage.authenticate = true
JournalsPage.getLayout = (page) => <Layout>{page}</Layout>

export default JournalsPage
