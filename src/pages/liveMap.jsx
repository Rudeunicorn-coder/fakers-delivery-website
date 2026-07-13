import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { isSupabaseConfigured, supabase } from '../supabaseclient.js'

export default function LiveMap() {
  const [parcels, setParcels] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedParcel, setSelectedParcel] = useState(null)

  useEffect(() => {
    fetchParcels()
  }, [])

  async function fetchParcels() {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('parcels')
      .select('*')
      .in('status', ['In Transit', 'Out for Delivery'])
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      setParcels([])
    } else {
      setParcels(data || [])
    }

    setLoading(false)
  }

  const generateRandomCoords = (index) => {
    const lat = 40.7128 + (Math.random() - 0.5) * 0.1
    const lng = -74.006 + (Math.random() - 0.5) * 0.1
    return { lat, lng }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold">Live Delivery Map</h1>
          <p className="mt-2 text-slate-400">Track active deliveries in real-time</p>
        </motion.div>

        {loading ? (
          <div className="rounded-lg bg-slate-900 p-8 text-center text-slate-400">Loading map data...</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-4">
            <div className="md:col-span-3 rounded-xl border border-slate-700 bg-slate-900 p-6">
              <div className="aspect-video w-full rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border border-slate-700">
                <div className="text-center">
                  <div className="text-4xl mb-2">🗺️</div>
                  <p className="text-slate-400 text-sm">
                    Integration with Google Maps, Mapbox, or Leaflet<br />
                    Shows live parcel locations and delivery routes
                  </p>
                  <div className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold">
                    {parcels.length} Active Deliveries
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-900 p-6 h-fit">
              <h3 className="font-semibold text-slate-200 mb-4">Active Deliveries</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {parcels.length === 0 ? (
                  <p className="text-sm text-slate-400">No active deliveries</p>
                ) : (
                  parcels.map((parcel, index) => (
                    <motion.button
                      key={parcel.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSelectedParcel(selectedParcel?.id === parcel.id ? null : parcel)}
                      className={`w-full text-left rounded-lg p-3 transition ${
                        selectedParcel?.id === parcel.id
                          ? 'bg-blue-600'
                          : 'bg-slate-800 hover:bg-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                        <span className="text-xs font-mono font-bold">{parcel.tracking_number}</span>
                      </div>
                      <p className="text-xs text-slate-300">{parcel.receiver_name}</p>
                      <p className="text-xs text-slate-400">{parcel.status}</p>
                    </motion.button>
                  ))
                )}
              </div>
            </div>

            {selectedParcel && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="md:col-span-4 rounded-xl border border-slate-700 bg-slate-900 p-6"
              >
                <h3 className="font-bold text-lg mb-4">Delivery Details</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-slate-400">Tracking Number</p>
                    <p className="text-lg font-mono font-bold">{selectedParcel.tracking_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Status</p>
                    <p className="text-lg font-semibold">{selectedParcel.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Receiver</p>
                    <p className="text-lg font-semibold">{selectedParcel.receiver_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Phone</p>
                    <p className="text-lg">{selectedParcel.receiver_phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Route</p>
                    <p className="text-lg">{selectedParcel.origin} → {selectedParcel.destination}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Created</p>
                    <p className="text-lg">{new Date(selectedParcel.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
