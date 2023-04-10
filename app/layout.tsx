import { Nunito } from "next/font/google"
import getCurentUser from "./actions/getCurrentUser"
import ClientOnly from "./components/ClientOnly"
import LoginModal from "./components/modals/LoginModal"
import RegisterModal from "./components/modals/LoginModal"
import Navbar from "./components/navbar/Navbar"

import './globals.css'
import ToasterProvider from "./providers/ToasterProvider"


export const metadata = {
  title: 'Airbnb',
  description: 'airbnb',
}
const font = Nunito({
  subsets: ['latin']
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const currentUser = await getCurentUser()

  return (
    <html lang="en">
      <body className={font.className}>
        <ClientOnly>
          <ToasterProvider />
          <RegisterModal />
          <LoginModal />
          <Navbar currentUser={currentUser} />
        </ClientOnly>
        <div className="pb-20 pt-28">
          {children}
        </div>
      </body>
    </html>
  )
}
