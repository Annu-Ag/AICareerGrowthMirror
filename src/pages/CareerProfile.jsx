import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'

const initialProfile = {
  name: '',
  currentRole: '',
  yearsOfExperience: '',
  currentSkills: '',
  targetRole: '',
  dreamCompany: '',
  biggestCareerChallenge: '',
}

export default function CareerProfile() {
  const [profile, setProfile] = useState(initialProfile)
  const [isSaved, setIsSaved] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setProfile((currentProfile) => ({ ...currentProfile, [name]: value }))
    setIsSaved(false)
  }

  function handleSubmit(event) {
    event.preventDefault()
    setIsSaved(true)
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <PageHeader
        eyebrow="Career profile"
        title="Build your professional mirror"
        description="Give your analysis the context it needs to surface the patterns, strengths, and next moves that matter most."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8 flex items-center justify-between border-b border-slate-100 pb-6">
            <div><h2 className="font-semibold text-slate-900">Your career snapshot</h2><p className="mt-1 text-sm text-slate-500">Fields marked with <span className="text-indigo-600">*</span> are required.</p></div>
            <span className="grid size-10 place-items-center rounded-xl bg-indigo-50 text-lg text-indigo-600">✦</span>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name" name="name" value={profile.name} onChange={handleChange} placeholder="e.g. Priya Sharma" required />
            <Field label="Current role" name="currentRole" value={profile.currentRole} onChange={handleChange} placeholder="e.g. Product Designer" required />
            <Field label="Years of experience" name="yearsOfExperience" value={profile.yearsOfExperience} onChange={handleChange} placeholder="e.g. 5" inputMode="numeric" required />
            <Field label="Target role" name="targetRole" value={profile.targetRole} onChange={handleChange} placeholder="e.g. Design Lead" required />
            <div className="sm:col-span-2"><Field label="Current skills" name="currentSkills" value={profile.currentSkills} onChange={handleChange} placeholder="e.g. User research, Figma, Product strategy" hint="Separate skills with commas." required /></div>
            <div className="sm:col-span-2"><Field label="Dream company" name="dreamCompany" value={profile.dreamCompany} onChange={handleChange} placeholder="e.g. Stripe, Canva, or your own company" /></div>
            <div className="sm:col-span-2"><Field label="Biggest career challenge" name="biggestCareerChallenge" value={profile.biggestCareerChallenge} onChange={handleChange} placeholder="What feels most difficult or uncertain right now?" textarea required /></div>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-slate-400">Your profile lives in this session only.</p>
            <button type="submit" className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700">Save career profile</button>
          </div>
        </form>

        <aside className="h-fit rounded-2xl bg-slate-900 p-6 text-white sm:p-7">
          <p className="text-sm font-medium text-indigo-300">Profile progress</p>
          <p className="mt-3 text-5xl font-semibold tracking-tight">{completion(profile)}%</p>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-700"><div className="h-full rounded-full bg-indigo-400 transition-all" style={{ width: `${completion(profile)}%` }} /></div>
          <p className="mt-6 text-sm leading-6 text-slate-300">The more context you share, the sharper your career reflection becomes.</p>
          {isSaved ? <div className="mt-6 rounded-xl border border-indigo-400/30 bg-indigo-400/10 p-3 text-sm text-indigo-100">Profile saved in this session.</div> : <Link to="/analysis" className="mt-8 inline-block text-sm font-semibold text-white underline decoration-indigo-400 underline-offset-4">Explore an example analysis →</Link>}
        </aside>
      </div>
    </section>
  )
}

function completion(profile) {
  const requiredFields = ['name', 'currentRole', 'yearsOfExperience', 'currentSkills', 'targetRole', 'biggestCareerChallenge']
  return Math.round((requiredFields.filter((field) => profile[field].trim()).length / requiredFields.length) * 100)
}

function Field({ label, name, value, onChange, placeholder, hint, required, textarea, inputMode }) {
  const sharedProps = { id: name, name, value, onChange, placeholder, required, inputMode, className: 'mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50' }
  return <label htmlFor={name} className="block text-sm font-medium text-slate-700">{label}{required && <span className="ml-0.5 text-indigo-600">*</span>}{textarea ? <textarea {...sharedProps} rows="4" className={`${sharedProps.className} resize-y`} /> : <input {...sharedProps} />}{hint && <span className="mt-1.5 block text-xs font-normal text-slate-400">{hint}</span>}</label>
}
