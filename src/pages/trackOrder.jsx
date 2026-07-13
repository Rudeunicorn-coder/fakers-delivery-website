import { useState } from 'react'
import { supabase } from '../supabaseclient.js'

export default function TrackOrder() {
  const [trackingInput, setTrackingInput] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const formatDispatchDateTime = (value) => {
    if (!value) return 'Not available'

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return 'Not available'

    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
  }

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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,116,144,0.2),_transparent_35%)] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-[32px] border border-slate-800 bg-slate-900/80 p-6 shadow-[0_20px_80px_rgba(2,8,23,0.55)] backdrop-blur sm:p-8 lg:p-10">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">Live shipment tracking</p>
            <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Track your shipment in real time</h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">
              Enter a tracking code created by the admin to view shipment progress and recipient details instantly.
            </p>
          </div>

          <form onSubmit={handleTrack} className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 rounded-2xl border border-amber-200/70 bg-white/90 p-3 shadow-sm sm:flex-row sm:items-center">
            <div className="flex w-full items-center rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <span className="mr-2 text-amber-500">#</span>
              <input
                type="text"
                value={trackingInput}
                onChange={(event) => setTrackingInput(event.target.value)}
                placeholder="e.g. CSL-26-42144"
                className="w-full bg-transparent text-base text-slate-800 outline-none"
              />
            </div>
            <button type="submit" disabled={loading} className="rounded-xl bg-amber-400 px-6 py-3 font-semibold text-slate-900 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? 'Searching...' : 'Track'}
            </button>
          </form>

          {!errorMessage && !selectedOrder && (
            <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 p-5 text-center text-sm text-slate-400">
              Example codes: CSL-26-42144 or CSL-26-12873
            </div>
          )}

          {errorMessage && <div className="mx-auto mt-6 max-w-2xl rounded-xl border border-rose-800/70 bg-rose-950/50 p-4 text-center text-rose-300">{errorMessage}</div>}

          {selectedOrder && (
            <div className="mx-auto mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">Tracking Code</p>
                    <h2 className="mt-1 text-2xl font-bold text-white">{selectedOrder.tracking_number}</h2>
                  </div>
                  <span className={selectedOrder.status === 'On Hold' ? 'rounded-full bg-rose-900/80 px-3 py-1 text-sm font-semibold text-rose-300' : 'rounded-full bg-emerald-900/80 px-3 py-1 text-sm font-semibold text-emerald-300'}>{selectedOrder.status}</span>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                      <p className="text-sm text-slate-400">Origin</p>
                      <p className="mt-1 font-semibold text-white">{selectedOrder.origin}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                      <p className="text-sm text-slate-400">Destination</p>
                      <p className="mt-1 font-semibold text-white">{selectedOrder.destination}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                      <p className="text-sm text-slate-400">Sender</p>
                      <p className="mt-1 font-semibold text-white">{selectedOrder.sender_name}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                      <p className="text-sm text-slate-400">Receiver</p>
                      <p className="mt-1 font-semibold text-white">{selectedOrder.receiver_name}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                      <p className="text-sm text-slate-400">Receiver Phone</p>
                      <p className="mt-1 font-semibold text-white">{selectedOrder.receiver_phone || 'Not provided'}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                      <p className="text-sm text-slate-400">Dispatched</p>
                      <p className="mt-1 font-semibold text-white">{formatDispatchDateTime(selectedOrder.dispatched_at || selectedOrder.created_at || selectedOrder.updated_at)}</p>
                    </div>
                    {selectedOrder.notes && (
                      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                        <p className="text-sm text-slate-400">Notes</p>
                        <p className="mt-1 font-semibold text-white">{selectedOrder.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">Current status</p>
                <p className={selectedOrder.status === 'On Hold' ? 'mt-3 text-2xl font-semibold text-rose-300' : 'mt-3 text-2xl font-semibold text-white'}>{selectedOrder.status}</p>
                <p className="mt-2 text-sm text-slate-400">{selectedOrder.status === 'On Hold' ? 'Contact customer support for assistance.' : 'Your parcel is currently moving through the delivery network.'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
