'use client'

import { Suspense } from 'react'
import ApplicationsTable from '@/components/dashboard/ApplicationsTable'
import { useApplications } from '@/lib/context/ApplicationsContext'

function ChosenContent() {
  const { shortlistedApplications, selections, selectionData, error, refresh } = useApplications()

  if (error && (!shortlistedApplications || shortlistedApplications.length === 0)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-2">Error: {error}</p>
          <button
            onClick={() => refresh(false, true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!shortlistedApplications || shortlistedApplications.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Shortlisted Candidates</h1>
        <div className="bg-white dark:bg-gray-800 p-10 rounded-lg shadow text-center text-gray-500">
          No candidates shortlisted yet.
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Shortlisted Candidates</h1>
      <ApplicationsTable 
        applications={shortlistedApplications} 
        initialSelections={selections} 
      />
    </div>
  )
}

export default function ChosenPage() {
  const { isLoading, shortlistedApplications } = useApplications()

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Loading shortlisted candidates...</p>
          </div>
        </div>
      }
    >
      {isLoading && (!shortlistedApplications || shortlistedApplications.length === 0) ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Loading shortlisted candidates...</p>
          </div>
        </div>
      ) : (
        <ChosenContent />
      )}
    </Suspense>
  )
}
