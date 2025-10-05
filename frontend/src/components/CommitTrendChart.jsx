import React from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function CommitTrendChart({ repoCommits = [] }){
  const labels = repoCommits.map(r=>r.name)
  const dataPoints = repoCommits.map(r=>r.commits)
  const data = {labels,datasets:[{label:'Commits (last 7 days)',data:dataPoints,fill:false,borderColor:'#ff7b72',tension:0.3}]}
  const options = {responsive:true, plugins:{legend:{display:false, labels:{ color:'#c9d1d9' }}}, scales:{ x:{ ticks:{ color:'#8b949e' }, grid:{ color:'#30363d' } }, y:{ ticks:{ color:'#8b949e' }, grid:{ color:'#30363d' } } } }
  return (
    <div className="card p-4">
      <h3 className="card-header">Commits per repo (last 7 days)</h3>
      <Line data={data} options={options} />
    </div>
  )
}
