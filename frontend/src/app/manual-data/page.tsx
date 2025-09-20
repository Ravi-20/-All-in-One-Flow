'use client'

import ManualDataEntry from '@/components/forms/manual-data-entry'
import RealTimeIndicator from '@/components/demo/real-time-indicator'

export default function ManualDataPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manual Data Entry</h1>
          <p className="text-muted-foreground">Add production orders, materials, and stock movements manually</p>
        </div>
        <RealTimeIndicator />
      </div>

      <ManualDataEntry />
    </div>
  )
}