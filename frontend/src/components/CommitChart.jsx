import React from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)
export default function CommitChart({ commits }){
  const labels = commits.map((_,i)=>`Day ${i+1}`)
  const data = {labels,datasets:[{label:'Commits',data:commits,fill:false,borderColor:'#1f6feb',tension:0.3}]}
  const options = {
    plugins:{ legend:{ labels:{ color:'#c9d1d9' } } },
    scales:{
      x:{ ticks:{ color:'#8b949e' }, grid:{ color:'#30363d' } },
      y:{ ticks:{ color:'#8b949e' }, grid:{ color:'#30363d' } }
    }
  }
  return (
    <div className="card p-4">
      <h3 className="card-header">Commit Activity (last 7 days)</h3>
      <Line data={data} options={options} />
    </div>
  )
}
