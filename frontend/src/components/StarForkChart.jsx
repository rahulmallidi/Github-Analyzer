import React from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function StarForkChart({ starsPerRepo = [], forksPerRepo = [] }){
  const labels = starsPerRepo.map(s=>s.name)
  const stars = starsPerRepo.map(s=>s.stars)
  // align forks by repo name
  const forksMap = Object.fromEntries(forksPerRepo.map(f=>[f.name,f.forks]))
  const forks = labels.map(n=>forksMap[n] || 0)
  const data = {
    labels,
    datasets:[
      {label:'Stars', data:stars, backgroundColor:'#e3b341'},
      {label:'Forks', data:forks, backgroundColor:'#1f6feb'}
    ]
  }
  const options = {responsive:true, plugins:{legend:{position:'top', labels:{ color:'#c9d1d9' }}}, scales:{ x:{ ticks:{ color:'#8b949e' }, grid:{ color:'#30363d' } }, y:{ ticks:{ color:'#8b949e' }, grid:{ color:'#30363d' } } } }
  return (
    <div className="card p-4">
      <h3 className="card-header">Stars & Forks per repo</h3>
      <Bar data={data} options={options} />
    </div>
  )
}
