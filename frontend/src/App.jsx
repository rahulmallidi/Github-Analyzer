import React, { useState } from 'react'
import heroBg from './assets/images/Background.jpeg'
import axios from 'axios'
import UsernameForm from './components/UsernameForm.jsx'
import StatsCards from './components/StatsCards.jsx'
import LanguageChart from './components/LanguageChart.jsx'
import CommitChart from './components/CommitChart.jsx'
import UserProfile from './components/UserProfile.jsx'
import StarForkChart from './components/StarForkChart.jsx'
import CommitTrendChart from './components/CommitTrendChart.jsx'

export default function App(){
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [view, setView] = useState('intro') // intro | loading | results
  const [currentUser, setCurrentUser] = useState('')

  const goHome = () => {
    setView('intro')
    setData(null)
    setError(null)
    setCurrentUser('')
  }

  const handleAnalyze = async (username)=>{
    setLoading(true)
    setError(null)
    setData(null)
    setView('loading')
    setCurrentUser(username)
    try{
      const res = await axios.get(`http://localhost:5000/analyze/${username}`)
  setData(res.data)
      setView('results')
    }catch(e){
      if(e.response && e.response.status === 404){
        setError('User not found')
      } else if(e.response && e.response.status === 429){
        setError('Rate limited by GitHub API. Set GITHUB_TOKEN and try again soon.')
      } else {
        setError('Could not fetch data')
      }
      setView('intro')
    }finally{
      setLoading(false)
    }
  }

  const Intro = (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center text-center text-gray-200 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <h1 className="mb-3 text-2xl font-semibold">GitHub Analyzer</h1>
      <p className="mt-0 mb-4 text-gray-200 drop-shadow">Enter a GitHub username to analyze activity and repos.</p>
      <div>
        <UsernameForm onAnalyze={handleAnalyze} variant="nav" />
      </div>
      {error && <p className="text-red-300 mt-3">{error}</p>}
    </div>
  )

  const LoadingOverlay = (
    <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-10">
      <div className="w-14 h-14 rounded-full border-8 border-gray-300 border-t-blue-500 animate-spin" />
      <div className="mt-3 text-gray-200">Fetching data…</div>
    </div>
  )

  const Results = data && (
    <div className="mt-4 text-gray-200">
      <div className="grid gap-4 lg:[grid-template-columns:320px_1fr]">
        <div>
          <UserProfile profile={data.profile} username={currentUser} onAnalyze={handleAnalyze} />
        </div>
        <div>
          <StatsCards totalRepos={data.total_repos} mostActiveRepo={data.most_active_repo} languages={data.languages} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <LanguageChart languages={data.languages} />
        <CommitChart commits={data.commit_activity} />
        <StarForkChart starsPerRepo={data.stars_per_repo} forksPerRepo={data.forks_per_repo} />
      </div>
      <div className="mt-4">
        <CommitTrendChart repoCommits={data.repo_commits} />
      </div>
    </div>
  )

  return (
    <div className={`min-h-screen bg-gray-900 text-gray-200 ${view === 'intro' ? 'overflow-hidden' : ''}`}>
      <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-screen-xl mx-auto px-4 py-2 flex items-center gap-3">
          <div className="text-gray-200 font-bold flex items-center gap-2 cursor-pointer select-none" onClick={goHome} role="button" title="Go to home">
            <span className="text-xl">🐙</span>
            <span>GitHub Analyzer</span>
          </div>
          {view === 'results' && (
            <div className="ml-auto">
              <UsernameForm onAnalyze={handleAnalyze} variant="nav" />
            </div>
          )}
        </div>
      </header>
      <main className={view === 'intro' ? 'p-0' : 'max-w-screen-xl mx-auto p-4'}>
        {view === 'intro' && Intro}
        {view === 'results' && Results}
      </main>
      {loading && LoadingOverlay}
    </div>
  )
}
