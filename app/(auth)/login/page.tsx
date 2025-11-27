import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import LoginForm from '@/components/auth/LoginForm'
import Watermark from '@/components/Watermark'

export default async function LoginPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/dashboard')
  }

  return (
    <main className="relative">
      <LoginForm />
      <Watermark />
    </main>
  )
}