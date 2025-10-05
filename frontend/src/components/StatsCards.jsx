import React from 'react'

export default function StatsCards({ totalRepos=0, mostActiveRepo='', languages={} }){
  const topLang = Object.keys(languages).length
    ? Object.entries(languages).sort((a,b)=>b[1]-a[1])[0][0]
    : 'N/A'
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="card p-4">
        <div className="card-header text-sm">Total Repositories</div>
        <p className="text-2xl font-bold">{totalRepos}</p>
      </div>
      <div className="card p-4">
        <div className="card-header text-sm">Top Repo (week)</div>
        <p className="text-xl font-bold break-words">{mostActiveRepo || 'N/A'}</p>
      </div>
      <div className="card p-4">
        <div className="card-header text-sm">Top Language</div>
        <p className="text-2xl font-bold">{topLang}</p>
      </div>
    </div>
  )
}
