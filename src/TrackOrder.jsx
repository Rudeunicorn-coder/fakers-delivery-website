import { useState } from 'react'
import { supabase } from './supabaseclient.js'

export default function TrackOrder() {
  const [trackingInput, setTrackingInput] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleTrack = async (event) => {
    if (event?.preventDefault) {
      event.preventDefault()
    }

    const normalized = trackingInput.trim()

    if (!normalized) {
      setErrorMessage('Please enter a tracking number')
      setSelectedOrder(null)
      return
    }

    setLoading(true)
    setErrorMessage('')
    setSelectedOrder(null)

    if (!supabase) {
      setErrorMessage('Supabase is not configured.')
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('parcels')
      .select('*')
      .ilike('tracking_number', normalized)
      .maybeSingle()

    if (error) {
      console.error(error)
      setErrorMessage('Order not found. Please check your tracking number.')
      setSelectedOrder(null)
    } else if (data) {
      setSelectedOrder(data)
    } else {
      setErrorMessage('Order not found')
      setSelectedOrder(null)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-3xl font-bold text-white">Track Your Parcel</h1>
        <p className="mb-6 text-slate-400">Enter your tracking number to see live status</p>

        <form onSubmit={handleTrack} className="mb-6 flex gap-2">
          <input
            type="text"
            value={trackingInput}
            onChange={(event) => setTrackingInput(event.target.value)}
            placeholder="e.g. TEST123"
            className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3"
          />
          <button type="submit" disabled={loading} className="rounded-xl bg-sky-600 px-6 py-3 font-semibold disabled:opacity-50">
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>

        {errorMessage && <div className="rounded-xl bg-rose-900/50 p-4 text-rose-300">{errorMessage}</div>}

        {selectedOrder && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">{selectedOrder.tracking_number}</h2>
              <span className="rounded-full bg-sky-900/80 px-3 py-1 text-sm font-semibold text-sky-300">{selectedOrder.status}</span>
            </div>
            <div className="mt-4 space-y-2 text-slate-300">
              <p><b>Tracking:</b> {selectedOrder.tracking_number}</p>
              <p><b>Status:</b> {selectedOrder.status}</p>
              <p><b>Origin:</b> {selectedOrder.origin}</p>
              <p><b>Destination:</b> {selectedOrder.destination}</p>
              <p><b>Sender:</b> {selectedOrder.sender_name}</p>
              <p><b>Receiver:</b> {selectedOrder.receiver_name}</p>
              {selectedOrder.receiver_phone && <p><b>Phone:</b> {selectedOrder.receiver_phone}</p>}
              {selectedOrder.notes && <p><b>Notes:</b> {selectedOrder.notes}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}