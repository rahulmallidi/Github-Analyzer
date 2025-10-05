import React from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(ArcElement, Tooltip, Legend)
export default function LanguageChart({ languages }){
  const labels = Object.keys(languages)
  const data = {
    labels,
    datasets:[{data:labels.map(l=>languages[l]),backgroundColor:["#36A2EB","#FF6384","#FFCE56","#4BC0C0","#9966FF","#FF9F40"]}]
  }
  const options = { plugins: { legend: { labels: { color:'#c9d1d9' } } } }
  return (
    <div className="card p-4">
      <h3 className="card-header">Languages</h3>
      <Pie data={data} options={options} />
    </div>
  )
}
