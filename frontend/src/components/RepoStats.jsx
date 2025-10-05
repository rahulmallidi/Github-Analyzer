import React from 'react'
export default function RepoStats({ total, mostActive }){
  return (
    <div style={{padding:16,border:'1px solid #ddd',borderRadius:6}}>
      <h2 style={{marginTop:0}}>Repository Stats</h2>
      <p><strong>Total public repositories:</strong> {total}</p>
      <p><strong>Most active repo (week):</strong> {mostActive || 'N/A'}</p>
    </div>
  )
}
