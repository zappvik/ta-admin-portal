'use client'

import { UserCog } from 'lucide-react'

interface LogoProps {
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function Logo({ className = '', showText = true, size = 'md' }: LogoProps) {
const sizeClasses = {
  sm: { icon: 'w-6 h-6 sm:w-7 sm:h-7', text: 'text-xs sm:text-sm', gap: 'gap-1.5', iconSize: 20 },
  md: { icon: 'w-7 h-7 sm:w-9 sm:h-9', text: 'text-sm sm:text-base', gap: 'gap-2', iconSize: 24 },
  lg: { icon: 'w-9 h-9 sm:w-12 sm:h-12', text: 'text-base sm:text-lg', gap: 'gap-2 sm:gap-2.5', iconSize: 32 },
}

  const currentSize = sizeClasses[size]

  return (
    <div className={`flex items-center ${currentSize.gap} ${className}`}>
      <div className={`${currentSize.icon} flex-shrink-0 flex items-center justify-center`}>
        <UserCog
          size={currentSize.iconSize}
          className="text-blue-600 dark:text-blue-400"
          strokeWidth={2.5}
        />
      </div>

      {showText && (
        <div className={`flex items-center ${currentSize.text} font-bold tracking-tight leading-none whitespace-nowrap`}>
          <span className="text-blue-600 dark:text-blue-400 font-bold">TA</span>
          <span className="text-gray-900 dark:text-white ml-1.5 font-bold">ADMIN PORTAL</span>
        </div>
      )}
    </div>
  )
}
