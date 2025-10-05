import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function RepoList({ username, onClose }){
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null) // repo name
  const [readme, setReadme] = useState('')
  const [loadingReadme, setLoadingReadme] = useState(false)
  const [readmeError, setReadmeError] = useState(null)

  useEffect(()=>{
    let cancelled = false
    setLoading(true); setError(null); setRepos([])
    axios.get(`http://localhost:5000/repos/${username}`)
      .then(res=>{ if(!cancelled){ setRepos(res.data || []) }})
      .catch(err=>{
        if(cancelled) return
        const status = err.response?.status
        if(status === 429) setError('Rate limited by GitHub. Set GITHUB_TOKEN and try again.')
        else if(status === 404) setError('User not found')
        else setError('Failed to load repos')
      })
      .finally(()=>{ if(!cancelled){ setLoading(false) } })
    return ()=>{ cancelled = true }
  }, [username])

  const openReadme = (repoName)=>{
    setSelected(repoName)
    setLoadingReadme(true)
    setReadme('')
    setReadmeError(null)
    axios.get(`http://localhost:5000/readme/${username}/${repoName}`)
      .then(res=> setReadme(res.data?.readme || ''))
      .catch(err=>{
        const status = err.response?.status
        if(status === 404) setReadmeError('README not found')
        else if(status === 429) setReadmeError('Rate limited by GitHub. Try again later.')
        else setReadmeError('Failed to load README')
      })
      .finally(()=> setLoadingReadme(false))
  }

  return (
    <div className="overlay z-30">
      <div className="card w-full max-w-[900px] max-h-[85vh] overflow-hidden flex flex-col text-gray-200">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <strong>Repositories of {username}</strong>
          <button onClick={onClose} className="btn-primary bg-gray-900 border-gray-700 hover:bg-gray-800">Close</button>
        </div>
        <div className={`grid ${selected ? 'grid-cols-[320px_1fr]' : 'grid-cols-1'} flex-1 min-h-0`}>
          <div className={`overflow-auto ${selected ? 'border-r border-gray-700' : ''}`}>
            {loading && <div className="p-3">Loading…</div>}
            {error && <div className="p-3 text-red-400">{error}</div>}
            {!loading && !error && (
              <ul className="list-none m-0 p-0">
                {repos.map(r=> (
                  <li key={r.name} onClick={()=>openReadme(r.name)} className="p-3 border-b border-gray-700 cursor-pointer hover:bg-gray-900">
                    <div className="font-semibold text-gray-200">{r.name}</div>
                    {r.description && <div className="text-xs text-gray-400">{r.description}</div>}
                    <div className="text-xs text-gray-400 mt-1">
                      ⭐ {r.stargazers_count} · 🍴 {r.forks_count} {r.language ? `· ${r.language}` : ''}
                      {' '}· <a href={r.html_url} target="_blank" rel="noreferrer" className="text-blue-500">GitHub</a>
                    </div>
                  </li>
                ))}
                {repos.length === 0 && <div className="p-3">No repositories found.</div>}
              </ul>
            )}
          </div>
          {selected && (
            <div className="overflow-auto">
              <div className="p-3 border-b border-gray-700 flex items-center justify-between">
                <strong>README — {selected}</strong>
                <button onClick={()=>{ setSelected(null); setReadme(''); setReadmeError(null) }} className="btn-primary bg-gray-900 border-gray-700 hover:bg-gray-800">Back to list</button>
              </div>
              <div className="p-3">
                {loadingReadme && <div>Loading README…</div>}
                {readmeError && <div className="text-red-400">{readmeError}</div>}
                {!loadingReadme && !readmeError && (
                  <pre className="whitespace-pre-wrap break-words bg-gray-900 p-3 rounded border border-gray-700 text-gray-200">{readme || 'No README content.'}</pre>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
