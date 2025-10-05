import React, { useState } from 'react'
import FollowList from './FollowList.jsx'
import RepoList from './RepoList.jsx'

export default function UserProfile({ profile, username, onAnalyze }){
  const [listType, setListType] = useState(null) // 'followers' | 'following' | null
  const [showRepos, setShowRepos] = useState(false)
  if(!profile) return null
  return (
    <div style={{display:'flex',gap:16,alignItems:'center',padding:16,border:'1px solid #ddd',borderRadius:6,position:'relative'}}>
      <a href={profile.html_url} target="_blank" rel="noreferrer">
        <img src={profile.avatar_url} alt="avatar" style={{width:80,height:80,borderRadius:8,objectFit:'cover'}} />
      </a>
      <div style={{flex:1}}>
        <h2 style={{margin:'0 0 6px 0'}}>
          <a href={profile.html_url} target="_blank" rel="noreferrer" style={{textDecoration:'none',color:'inherit'}}>
            {profile.name || 'No name'}
          </a>
        </h2>
        <p style={{margin:'0 0 6px 0',color:'#ddd'}}>{profile.bio || ''}</p>
        <div style={{display:'flex',gap:12,flexWrap:'wrap',color:'#ddd',fontSize:14}}>
          {profile.location && <div>📍 {profile.location}</div>}
          <button onClick={()=>setListType('followers')} style={{border:'none',background:'none',color:'#0366d6',cursor:'pointer',padding:0}}>👥 {profile.followers} followers</button>
          <button onClick={()=>setListType('following')} style={{border:'none',background:'none',color:'#0366d6',cursor:'pointer',padding:0}}>🔁 {profile.following} following</button>
          <button onClick={()=>setShowRepos(true)} style={{border:'none',background:'none',color:'#0366d6',cursor:'pointer',padding:0}}>📦 {profile.public_repos} repos</button>
        </div>
      </div>
      {listType && (
        <FollowList
          username={username}
          type={listType}
          onClose={()=>setListType(null)}
          onSelectUser={(login)=>{ setListType(null); onAnalyze && onAnalyze(login) }}
        />
      )}
      {showRepos && (
        <RepoList username={username} onClose={()=>setShowRepos(false)} />
      )}
    </div>
  )
}
