'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Application = {
  id: string
  created_at: string
  student_name: string
  roll_number: string
  email: string
  reason: string | null
  internship: string | null
  selected_subjects: any[] | null
}

type SelectionData = {
  subject: string
  created_at: string
}

type CachedData = {
  applications: Application[]
  selections: string[]
  selectionData: Record<string, SelectionData>
  timestamp: number
}

type ApplicationsContextType = {
  applications: Application[]
  selections: Set<string>
  selectionData: Record<string, SelectionData>
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
  totalCount: number
  recentApplications: Application[]
  chosenCount: number
  shortlistedApplications: Application[]
}

const CACHE_KEY = 'applications_cache'
const CACHE_DURATION = 30 * 1000

function getCachedData(): CachedData | null {
  if (typeof window === 'undefined') return null
  
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null
    
    const data: CachedData = JSON.parse(cached)
    const now = Date.now()
    
    if (now - data.timestamp < CACHE_DURATION) {
      return data
    }
    
    localStorage.removeItem(CACHE_KEY)
    return null
  } catch (error) {
    console.error('Error reading cache:', error)
    return null
  }
}

function setCachedData(data: CachedData) {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Error writing cache:', error)
  }
}

export const ApplicationsContext = createContext<ApplicationsContextType | undefined>(undefined)

export function ApplicationsProvider({ children }: { children: ReactNode }) {
  const cachedData = getCachedData()
  const [applications, setApplications] = useState<Application[]>(cachedData?.applications || [])
  const [selections, setSelections] = useState<Set<string>>(
    cachedData ? new Set(cachedData.selections) : new Set()
  )
  const [selectionData, setSelectionData] = useState<Record<string, SelectionData>>(
    cachedData?.selectionData || {}
  )
  const [isLoading, setIsLoading] = useState(!cachedData)
  const [error, setError] = useState<string | null>(null)

  const totalCount = applications.length
  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)
  
  const chosenApplicationIds = new Set(
    Array.from(selections).map((s) => s.split('::')[0])
  )
  const chosenCount = chosenApplicationIds.size
  
  const shortlistedApplications = applications.filter((app) =>
    chosenApplicationIds.has(app.id)
  )

  const fetchApplications = async (showLoading = false) => {
    try {
      if (showLoading) {
        setIsLoading(true)
      }
      setError(null)
      
      const response = await fetch('/api/applications', {
        cache: 'default',
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to fetch applications: ${response.status}`)
      }

      const data = await response.json()
      const newApplications = data.applications || []
      const newSelections = new Set<string>(data.selections || [])
      const newSelectionData = data.selectionData || {}
      
      setApplications(newApplications)
      setSelections(newSelections)
      setSelectionData(newSelectionData)
      
      setCachedData({
        applications: newApplications,
        selections: Array.from(newSelections),
        selectionData: newSelectionData,
        timestamp: Date.now(),
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      console.error('Error fetching applications:', err)
      
      const currentCached = getCachedData()
      if (!currentCached) {
        setError(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const refresh = async () => {
    await fetchApplications(true)
  }

  useEffect(() => {
    const hasCachedData = !!cachedData
    fetchApplications(!hasCachedData)
    
    const interval = setInterval(() => {
      fetchApplications(false)
    }, 1800000)

    return () => clearInterval(interval)
  }, [])

  return (
    <ApplicationsContext.Provider
      value={{
        applications,
        selections,
        selectionData,
        isLoading,
        error,
        refresh,
        totalCount,
        recentApplications,
        chosenCount,
        shortlistedApplications,
      }}
    >
      {children}
    </ApplicationsContext.Provider>
  )
}

export function useApplications() {
  const context = useContext(ApplicationsContext)
  if (context === undefined) {
    throw new Error('useApplications must be used within an ApplicationsProvider')
  }
  return context
}
