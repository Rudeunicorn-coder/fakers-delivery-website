import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { isSupabaseConfigured, supabase } from '../supabaseclient.js'

export default function DriverDashboard() {
  const [deliveries, setDeliveries] = useState([])
  const [loading, setLoading] = useState(true)
  const [driverId, setDriverId] = useState('driver-1')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchDeliveries()
  }, [filter])

  async function fetchDeliveries() {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false)
      return
    }

    setLoading(true)

    let query = supabase.from('parcels').select('*')

    if (filter === 'pending') {
      query = query.in('status', ['Processing', 'On Hold'])
    } else if (filter === 'intransit') {
      query = query.in('status', ['In Transit', 'Out for Delivery', 'Available for Pickup'])
    } else if (filter === 'completed') {
      query = query.in('status', ['Delivered'])
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      setDeliveries([])
    } else {
      setDeliveries(data || [])
    }

    setLoading(false)
  }

  async function updateDeliveryStatus(id, newStatus) {
    if (!isSupabaseConfigured || !supabase) return

    const { error } = await supabase.from('parcels').update({ status: newStatus }).eq('id', id)

    if (error) {
      alert(error.message)
      return
    }

    await fetchDeliveries()
  }

  const getStatusColor = (status) => {
    const colors = {
      'Processing': 'bg-blue-100 text-blue-800',
      'On Hold': 'bg-yellow-100 text-yellow-800',
      'In Transit': 'bg-purple-100 text-purple-800',
      'Out for Delivery': 'bg-orange-100 text-orange-800',
      'Parcel Received': 'bg-green-100 text-green-800',
      'Delivered': 'bg-emerald-100 text-emerald-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900">Driver Dashboard</h1>
          <p className="mt-2 text-slate-600">View and manage your assigned deliveries</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-700">Driver ID:</span>
            <span className="rounded-lg bg-blue-100 px-3 py-1 text-sm font-mono text-blue-800">{driverId}</span>
          </div>
        </motion.div>

        <div className="mb-6 flex gap-2 flex-wrap">
          {[
            { label: 'All Deliveries', value: 'all' },
            { label: 'Pending', value: 'pending' },
            { label: 'In Transit', value: 'intransit' },
            { label: 'Completed', value: 'completed' },
          ].map((btn) => (
            <button
              key={btn.value}
              onClick={() => setFilter(btn.value)}
              className={`rounded-lg px-4 py-2 font-semibold transition ${
                filter === btn.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-400'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="rounded-lg bg-white p-8 text-center text-slate-600">Loading deliveries...</div>
        ) : deliveries.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center text-slate-600">
            No deliveries found for this filter.
          </div>
        ) : (
          <div className="space-y-4">
            {deliveries.map((delivery, index) => (
              <motion.div
                key={delivery.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span className="text-lg font-mono font-bold text-slate-900">{delivery.tracking_number}</span>
                      <span className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(delivery.status)}`}>
                        {delivery.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">
                      <strong>Receiver:</strong> {delivery.receiver_name} ({delivery.receiver_phone})
                    </p>
                    <p className="text-sm text-slate-600 mb-2">
                      <strong>Route:</strong> {delivery.origin} → {delivery.destination}
                    </p>
                    {delivery.notes && (
                      <p className="text-sm text-slate-600 mb-2">
                        <strong>Notes:</strong> {delivery.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {delivery.status !== 'Delivered' && delivery.status !== 'Parcel Received' && (
                      <>
                        {delivery.status === 'Processing' && (
                          <button
                            onClick={() => updateDeliveryStatus(delivery.id, 'In Transit')}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                          >
                            Start
                          </button>
                        )}
                        {delivery.status === 'In Transit' && (
                          <button
                            onClick={() => updateDeliveryStatus(delivery.id, 'Out for Delivery')}
                            className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
                          >
                            Out for Delivery
                          </button>
                        )}
                        {delivery.status === 'Out for Delivery' && (
                          <button
                            onClick={() => updateDeliveryStatus(delivery.id, 'Delivered')}
                            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                          >
                            Mark Delivered
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
