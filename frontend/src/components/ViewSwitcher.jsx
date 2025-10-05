import React from 'react'

export default function ViewSwitcher({ value, onChange }){
  const tabs = [
    {key:'profile', label:'Profile'},
    {key:'repos', label:'Repos Overview'},
    {key:'languages', label:'Languages'},
    {key:'commits', label:'Commit Activity'},
    {key:'starsforks', label:'Stars & Forks'},
    {key:'committrend', label:'Commit Trend'}
  ]
  return (
    <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
      {tabs.map(t=> (
        <button key={t.key} onClick={()=>onChange(t.key)}
          style={{
            padding:'8px 12px',
            border:'1px solid #ccc',
            borderRadius:6,
            background: value===t.key ? '#36A2EB' : '#fff',
            color: value===t.key ? '#fff' : '#333',
            cursor:'pointer'
          }}
        >{t.label}</button>
      ))}
    </div>
  )
}
