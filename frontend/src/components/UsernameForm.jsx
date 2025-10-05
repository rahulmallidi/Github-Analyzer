import React, { useState } from 'react'

export default function UsernameForm({ onAnalyze, variant='default' }){
  const [username, setUsername] = useState('')
  const submit = (e)=>{
    e.preventDefault()
    if(!username) return
    onAnalyze(username.trim())
  }
  const isNav = variant === 'nav'
  return (
    <form onSubmit={submit} className={isNav ? 'flex items-center gap-2' : 'flex justify-center gap-2'}>
      <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="GitHub username" className={isNav ? 'input min-w-[240px] text-sm' : 'input min-w-[240px] text-base'} />
      <button type="submit" className={isNav ? 'btn-primary text-sm' : 'btn-primary text-base'}>Search</button>
    </form>
  )
}
