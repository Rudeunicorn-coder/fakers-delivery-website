import { useEffect, useState } from 'react'
import { isSupabaseConfigured, supabase } from './supabaseclient.js'
import WaybillGenerator from './components/WaybillGenerator'
import { sendNotification } from './utils/notifications'
import { seedTestData, clearTestData } from './utils/testData'
import { downloadPickupNotificationPDF } from './utils/pdfGenerator'
import { NIGERIAN_STATES } from './utils/nigerianStates'

const initialForm = {
  tracking_number: '',
  sender_name: '',
  sender_phone: '',
  sender_address: '',
  receiver_name: '',
  receiver_phone: '',
  origin: '',
  destination: '',
  status: 'Processing',
  notes: '',
}

function generateTrackingCode() {
  const year = new Date().getFullYear().toString().slice(-2)
  const randomPart = Math.floor(10000 + Math.random() * 90000)
  return `VEL-${year}-${randomPart}`
}

function formatTrackingCode(code) {
  return code?.toUpperCase().trim() || ''
}

const statusOptions = ['Processing', 'On Hold', 'In Transit', 'Out for Delivery', 'Available for Pickup', 'Delivered']

const sampleParcels = [
  {
    id: 1,
    tracking_number: 'CSL-1042',
    sender_name: 'CommonSwift Hub',
    sender_phone: '+1 206 555 0101',
    sender_address: '128 Harbor Ave, Lagos',
    receiver_name: 'Alicia Brooks',
    receiver_phone: '+1 202 555 0147',
    origin: 'Lagos',
    destination: 'Kano',
    status: 'In Transit',
    notes: 'Priority parcel',
  },
  {
    id: 2,
    tracking_number: 'CSL-2057',
    sender_name: 'CommonSwift Hub',
    sender_phone: '+1 408 555 0123',
    sender_address: '45 Market St, Port Harcourt',
    receiver_name: 'Marcus Lee',
    receiver_phone: '+1 415 555 0198',
    origin: 'Rivers',
    destination: 'Abuja',
    status: 'Out for Delivery',
    notes: 'Signature required',
  },
]

export default function Admin() {
  const [parcels, setParcels] = useState(sampleParcels)
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('Preview mode is active. Connect Supabase to load live parcels.')
  const [copiedCode, setCopiedCode] = useState('')
  const [selectedWaybill, setSelectedWaybill] = useState(null)
  const [seedingLoading, setSeedingLoading] = useState(false)
  const [receivedNotification, setReceivedNotification] = useState(null)

  useEffect(() => {
    if (!isSupabaseConfigured) return
    fetchParcels()
  }, [])

  async function fetchParcels() {
    if (!isSupabaseConfigured || !supabase) {
      setParcels(sampleParcels)
      setStatusMessage('Preview mode is active. Add your Supabase credentials to load live parcels.')
      return
    }

    const { data, error } = await supabase.from('parcels').select('*').order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      setParcels(sampleParcels)
      setStatusMessage('Supabase is configured, but the parcels table is not ready yet. Create it and refresh the page.')
      return
    }

    setParcels(data?.length ? data : sampleParcels)
    setStatusMessage(data?.length ? 'Live Supabase parcels are loaded.' : 'No live parcels found yet. Add one to start tracking.')
  }

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function addParcel(event) {
    event.preventDefault()

    if (!isSupabaseConfigured || !supabase) {
      alert('Add your Supabase URL and anon key in the .env file first.')
      return
    }

    setLoading(true)

    const trackingCode = formatTrackingCode(form.tracking_number) || generateTrackingCode()
    const parcelToInsert = {
      ...form,
      tracking_number: trackingCode,
    }

    const { error } = await supabase.from('parcels').insert([parcelToInsert])

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }

    setForm(initialForm)
    await fetchParcels()
    setLoading(false)
  }

  async function updateStatus(id, status) {
    if (!isSupabaseConfigured || !supabase) return

    const updates = { status }

    if (status === 'Parcel Received') {
      updates.received_at = new Date().toISOString()
    } else if (status !== 'Parcel Received') {
      updates.received_at = null
    }

    const { error } = await supabase.from('parcels').update(updates).eq('id', id)

    if (error) {
      alert(error.message)
      return
    }

    await fetchParcels()

    // Send notification
    const parcel = parcels.find((p) => p.id === id)
    if (parcel) {
      const notificationType =
        status === 'Out for Delivery' ? 'out_for_delivery' :
        status === 'Parcel Received' ? 'parcel_received' :
        status === 'Delivered' ? 'delivered' :
        status === 'Available for Pickup' ? 'pickup_available' :
        'status_update'
      
      await sendNotification({ ...parcel, status }, notificationType)

      // Download PDF for pickup status
      if (status === 'Available for Pickup') {
        setTimeout(() => {
          downloadPickupNotificationPDF({ ...parcel, status })
        }, 500)
      }
    }
  }

  async function handleSeedTestData() {
    setSeedingLoading(true)
    const result = await seedTestData(supabase)
    setSeedingLoading(false)
    
    if (result.success) {
      setStatusMessage(`✅ Seeded ${result.count} test parcels successfully!`)
      await fetchParcels()
    } else {
      setStatusMessage(`❌ Error seeding data: ${result.error}`)
    }
  }

  async function handleClearTestData() {
    if (!window.confirm('Clear all test data? This cannot be undone.')) return
    
    setSeedingLoading(true)
    const result = await clearTestData(supabase)
    setSeedingLoading(false)
    
    if (result.success) {
      setStatusMessage(`✅ Cleared ${result.count} test parcels`)
      await fetchParcels()
    } else {
      setStatusMessage(`❌ Error clearing data: ${result.error}`)
    }
  }

  async function markAsReceived(parcel) {
    if (!isSupabaseConfigured || !supabase) return

    const receivedTimestamp = new Date().toISOString()
    const updates = { status: 'Parcel Received', received_at: receivedTimestamp }

    const { error } = await supabase.from('parcels').update(updates).eq('id', parcel.id)

    if (error) {
      alert(error.message)
      return
    }

    // Show notification with timestamp
    const receivedDate = new Date(receivedTimestamp)
    const formattedDate = receivedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    const formattedTime = receivedDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })

    setReceivedNotification({
      trackingNumber: parcel.tracking_number,
      date: formattedDate,
      time: formattedTime,
    })

    setTimeout(() => setReceivedNotification(null), 5000)

    await fetchParcels()
    await sendNotification({ ...parcel, status: 'Parcel Received', received_at: receivedTimestamp }, 'parcel_received')
  }

  async function deleteParcel(id) {
    if (!window.confirm('Delete this parcel?')) return
    if (!isSupabaseConfigured || !supabase) return

    const { error } = await supabase.from('parcels').delete().eq('id', id)

    if (error) {
      alert(error.message)
      return
    }

    await fetchParcels()
  }

  async function copyTrackingCode(code) {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(code)
      setTimeout(() => setCopiedCode(''), 1800)
    } catch (error) {
      console.error(error)
      alert('Unable to copy tracking code')
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-[linear-gradient(135deg,_#fffef8_0%,_#fff7cc_45%,_#ffffff_100%)] px-4 py-10 text-slate-800 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-2xl border border-amber-200 bg-white/95 p-8 shadow-[0_20px_60px_rgba(250,204,21,0.16)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Admin preview mode</h1>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Supabase is not connected yet, so this view shows sample parcels so you can inspect the dashboard layout right away.
              </p>
            </div>
            <div className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
              Sample data only
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {parcels.map((parcel) => (
              <div key={parcel.id} className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">{parcel.tracking_number}</h2>
                  <span className="rounded-full bg-amber-400 px-2.5 py-1 text-xs font-semibold text-slate-900">{parcel.status}</span>
                </div>
                <p className="mt-3 text-sm text-slate-600">{parcel.receiver_name} • {parcel.receiver_phone}</p>
                <p className="mt-1 text-sm text-slate-600">{parcel.origin} → {parcel.destination}</p>
                {parcel.notes && <p className="mt-2 text-sm text-slate-700">{parcel.notes}</p>}
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-amber-100 bg-white p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">To connect live data, add these values to your environment file:</p>
            <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-900 p-3 text-sm text-amber-200">
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
            </pre>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#fffef8_0%,_#fff7cc_45%,_#ffffff_100%)] px-4 py-6 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl border border-amber-200 bg-white/95 p-6 shadow-[0_20px_60px_rgba(250,204,21,0.16)]">
          <h1 className="text-2xl font-semibold text-slate-900">CommonSwift Logistics Admin</h1>
          <p className="mt-2 text-sm text-slate-600">Manage parcels, update delivery status, and keep tracking records in Supabase.</p>
          <div className="mt-3 inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
            {statusMessage}
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-white/95 p-6 shadow-[0_20px_60px_rgba(250,204,21,0.16)]">
          <h2 className="text-xl font-semibold text-slate-900">Add New Parcel</h2>
          <form onSubmit={addParcel} className="mt-4 grid gap-4 md:grid-cols-2">
            <input name="tracking_number" value={form.tracking_number} onChange={handleChange} placeholder="Leave blank to auto-generate (e.g. CSL-42144)" className="rounded-xl border border-amber-200 bg-amber-50/60 px-3 py-2 text-sm text-slate-800 outline-none focus:border-amber-400" />
            <input name="sender_name" value={form.sender_name} onChange={handleChange} required placeholder="Sender Name" className="rounded-xl border border-amber-200 bg-amber-50/60 px-3 py-2 text-sm text-slate-800 outline-none focus:border-amber-400" />
            <input name="sender_phone" value={form.sender_phone} onChange={handleChange} required placeholder="Sender Phone" className="rounded-xl border border-amber-200 bg-amber-50/60 px-3 py-2 text-sm text-slate-800 outline-none focus:border-amber-400" />
            <input name="sender_address" value={form.sender_address} onChange={handleChange} required placeholder="Sender Home Address" className="rounded-xl border border-amber-200 bg-amber-50/60 px-3 py-2 text-sm text-slate-800 outline-none focus:border-amber-400" />
            <input name="receiver_name" value={form.receiver_name} onChange={handleChange} required placeholder="Receiver Name" className="rounded-xl border border-amber-200 bg-amber-50/60 px-3 py-2 text-sm text-slate-800 outline-none focus:border-amber-400" />
            <input name="receiver_phone" value={form.receiver_phone} onChange={handleChange} required placeholder="Receiver Phone" className="rounded-xl border border-amber-200 bg-amber-50/60 px-3 py-2 text-sm text-slate-800 outline-none focus:border-amber-400" />
            <select name="origin" value={form.origin} onChange={handleChange} required className="rounded-xl border border-amber-200 bg-amber-50/60 px-3 py-2 text-sm text-slate-800 outline-none focus:border-amber-400">
              <option value="">Select Origin State</option>
              {NIGERIAN_STATES.map((state) => (
                <option key={`origin-${state}`} value={state}>{state}</option>
              ))}
            </select>
            <select name="destination" value={form.destination} onChange={handleChange} required className="rounded-xl border border-amber-200 bg-amber-50/60 px-3 py-2 text-sm text-slate-800 outline-none focus:border-amber-400">
              <option value="">Select Destination State</option>
              {NIGERIAN_STATES.map((state) => (
                <option key={`dest-${state}`} value={state}>{state}</option>
              ))}
            </select>
            <select name="status" value={form.status} onChange={handleChange} className="rounded-xl border border-amber-200 bg-amber-50/60 px-3 py-2 text-sm text-slate-800 outline-none focus:border-amber-400">
              {statusOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Notes" rows="3" className="md:col-span-2 rounded-xl border border-amber-200 bg-amber-50/60 px-3 py-2 text-sm text-slate-800 outline-none focus:border-amber-400" />
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" disabled={loading} className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-70">
                {loading ? 'Adding Parcel...' : 'Add Parcel'}
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-white/95 p-6 shadow-[0_20px_60px_rgba(250,204,21,0.16)]">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Test Data Management</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSeedTestData}
              disabled={seedingLoading}
              className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {seedingLoading ? 'Seeding...' : '📦 Seed Test Data'}
            </button>
            <button
              onClick={handleClearTestData}
              disabled={seedingLoading}
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {seedingLoading ? 'Clearing...' : '🗑️ Clear Test Data'}
            </button>
          </div>
          <p className="mt-3 text-xs text-slate-600">Quickly populate or clear sample deliveries for testing driver dashboard and map features.</p>
        </div>

        {receivedNotification && (
          <div className="rounded-2xl border-l-4 border-green-600 bg-green-50 p-6 shadow-md">
            <div className="flex items-start gap-4">
              <div className="text-3xl">✅</div>
              <div>
                <h3 className="text-lg font-bold text-green-900">Parcel Received</h3>
                <p className="mt-1 text-sm text-green-800">
                  <strong>Tracking:</strong> {receivedNotification.trackingNumber}
                </p>
                <p className="mt-1 text-sm text-green-800">
                  <strong>Date:</strong> {receivedNotification.date}
                </p>
                <p className="mt-1 text-sm text-green-800">
                  <strong>Time:</strong> {receivedNotification.time}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-amber-200 bg-white/95 p-6 shadow-[0_20px_60px_rgba(250,204,21,0.16)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Parcels</h2>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">{parcels.length} total</span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-amber-100 text-slate-600">
                  <th className="px-3 py-2">Tracking</th>
                  <th className="px-3 py-2">Sender</th>
                  <th className="px-3 py-2">Receiver</th>
                  <th className="px-3 py-2">Route</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {parcels.map((parcel) => (
                  <tr key={parcel.id} className="border-b border-amber-100/80 text-slate-700">
                    <td className="px-3 py-3 font-medium text-slate-900">
                      <div className="flex items-center gap-2">
                        <span>{parcel.tracking_number}</span>
                        <button onClick={() => copyTrackingCode(parcel.tracking_number)} className="rounded-md border border-amber-200 bg-white px-2 py-1 text-xs font-semibold text-amber-700 transition hover:border-amber-400 hover:text-amber-800">
                          {copiedCode === parcel.tracking_number ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </td>
                    <td className="px-3 py-3">{parcel.sender_name}</td>
                    <td className="px-3 py-3">
                      <div>{parcel.receiver_name}</div>
                      <div className="text-xs text-slate-500">{parcel.receiver_phone}</div>
                    </td>
                    <td className="px-3 py-3">{parcel.origin} → {parcel.destination}</td>
                    <td className="px-3 py-3">
                      <select value={parcel.status} onChange={(event) => updateStatus(parcel.id, event.target.value)} className="rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 text-sm text-slate-800 outline-none focus:border-amber-400">
                        {statusOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => markAsReceived(parcel)}
                          disabled={parcel.status === 'Parcel Received'}
                          className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          ✓ Received
                        </button>
                        <button
                          onClick={() => setSelectedWaybill(parcel)}
                          className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                          🖨️ Waybill
                        </button>
                        <button onClick={() => deleteParcel(parcel.id)} className="rounded-lg bg-red-500 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-red-400">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {selectedWaybill && <WaybillGenerator parcel={selectedWaybill} onClose={() => setSelectedWaybill(null)} />}
    </div>
  )
}