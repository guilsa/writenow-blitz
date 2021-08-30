import { ReactNode } from "react"
import { Head } from "blitz"

type LayoutProps = {
  title?: string
  children: ReactNode
}

const Layout = ({ title, children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title || "writenow"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container">
        <main>{children}</main>
      </div>
    </>
  )
}

export default Layout
