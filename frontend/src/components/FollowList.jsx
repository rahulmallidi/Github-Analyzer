import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function FollowList({ username, type, onClose, onSelectUser }){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(()=>{
    let cancelled = false
    setLoading(true)
    setError(null)
    setItems([])
    const url = type === 'followers'
      ? `http://localhost:5000/followers/${username}`
      : `http://localhost:5000/following/${username}`
    axios.get(url)
      .then(res=>{ if(!cancelled){ setItems(res.data || []) } })
      .catch(err=>{ 
        if(cancelled) return
        const status = err.response?.status
        if(status === 429){
          setError('Rate limited by GitHub. Set GITHUB_TOKEN and try again.')
        } else if(status === 404){
          setError('User not found')
        } else {
          setError('Failed to load')
        }
      })
      .finally(()=>{ if(!cancelled){ setLoading(false) } })
    return ()=>{ cancelled = true }
  }, [username, type])

  return (
    <div className="overlay">
      <div className="card w-full max-w-[700px] max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <strong>{type === 'followers' ? 'Followers' : 'Following'}</strong>
          <button onClick={onClose} className="btn-primary bg-gray-900 border-gray-700 hover:bg-gray-800">Close</button>
        </div>
        <div className="p-3 overflow-auto">
          {loading && <div>Loading…</div>}
          {error && <div className="text-red-400">{error}</div>}
          {!loading && !error && (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 list-none p-0 m-0">
              {items.map(u=> (
                <li key={u.login} className="flex items-center gap-3 border border-gray-700 rounded-lg p-2 cursor-pointer bg-gray-900 hover:bg-gray-800" onClick={()=>onSelectUser(u.login)}>
                  <img src={u.avatar_url} alt={u.login} className="w-10 h-10 rounded object-cover" />
                  <div className="flex flex-col">
                    <span className="font-semibold">{u.login}</span>
                    <a href={u.html_url} target="_blank" rel="noreferrer" className="text-blue-500 text-xs">View on GitHub</a>
                  </div>
                </li>
              ))}
              {items.length === 0 && <div>No users found.</div>}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
