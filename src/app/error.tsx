'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-white">
      <h1 className="text-3xl font-bold">Something went wrong!</h1>
      <p className="mt-2 text-lg">Please try again later.</p>
      <button
        onClick={() => reset()}
        className="mt-4 rounded bg-red-500 px-4 py-2 text-white font-semibold hover:bg-red-700"
      >
        Try Again
      </button>
    </div>
  )
}
