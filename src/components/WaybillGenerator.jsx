import { useRef } from 'react'
import { motion } from 'framer-motion'

export default function WaybillGenerator({ parcel, onClose }) {
  const printRef = useRef(null)

  const handlePrint = () => {
    const printContent = printRef.current
    const printWindow = window.open('', '', 'width=800,height=600')
    printWindow.document.write(printContent.innerHTML)
    printWindow.document.close()
    printWindow.print()
  }

  if (!parcel) return null

  const barcode = parcel.tracking_number.replace(/-/g, '')
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Delivery Waybill</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <div ref={printRef} className="bg-white p-8 text-slate-900 print:p-0">
          <div className="border-2 border-slate-900 p-8">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between border-b-2 border-slate-900 pb-4">
              <div>
                <h1 className="text-2xl font-bold">🕊 CommonSwift Logistics</h1>
                <p className="text-sm text-slate-600">Delivery Waybill</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">Date: {new Date().toLocaleDateString()}</p>
                <p className="text-sm">Reference: {parcel.tracking_number}</p>
              </div>
            </div>

            {/* Tracking Number & Barcode */}
            <div className="mb-6 flex gap-8">
              <div className="flex-1">
                <p className="mb-1 text-xs font-semibold uppercase text-slate-600">Tracking Number</p>
                <p className="text-2xl font-mono font-bold">{parcel.tracking_number}</p>
              </div>
              <div className="flex-1 text-right">
                <p className="mb-1 text-xs font-semibold uppercase text-slate-600">Barcode</p>
                <p className="font-mono text-lg tracking-widest font-bold">*{barcode}*</p>
              </div>
            </div>

            {/* Sender Information */}
            <div className="mb-6 border-t-2 border-slate-900 pt-4">
              <p className="mb-2 text-sm font-semibold uppercase text-slate-600">Sender Information</p>
              <div className="grid gap-2 text-sm">
                <p><strong>Name:</strong> {parcel.sender_name}</p>
                <p><strong>Phone:</strong> {parcel.sender_phone}</p>
                <p><strong>Address:</strong> {parcel.sender_address}</p>
              </div>
            </div>

            {/* Receiver Information */}
            <div className="mb-6 border-t-2 border-slate-900 pt-4">
              <p className="mb-2 text-sm font-semibold uppercase text-slate-600">Receiver Information</p>
              <div className="grid gap-2 text-sm">
                <p><strong>Name:</strong> {parcel.receiver_name}</p>
                <p><strong>Phone:</strong> {parcel.receiver_phone}</p>
                <p><strong>Destination:</strong> {parcel.destination}</p>
              </div>
            </div>

            {/* Route */}
            <div className="mb-6 border-t-2 border-slate-900 pt-4">
              <p className="mb-2 text-sm font-semibold uppercase text-slate-600">Delivery Route</p>
              <p className="text-sm">
                <strong>From:</strong> {parcel.origin} → <strong>To:</strong> {parcel.destination}
              </p>
            </div>

            {/* Status */}
            <div className="mb-6 border-t-2 border-slate-900 pt-4">
              <p className="mb-2 text-sm font-semibold uppercase text-slate-600">Current Status</p>
              <p className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
                {parcel.status}
              </p>
            </div>

            {/* Notes */}
            {parcel.notes && (
              <div className="mb-6 border-t-2 border-slate-900 pt-4">
                <p className="mb-2 text-sm font-semibold uppercase text-slate-600">Special Instructions</p>
                <p className="text-sm text-slate-700">{parcel.notes}</p>
              </div>
            )}

            {/* Footer */}
            <div className="border-t-2 border-slate-900 pt-4 text-center text-xs text-slate-600">
              <p>This is an official delivery document from CommonSwift Logistics</p>
              <p>For tracking, visit: https://delivery.example.com</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-200 px-4 py-2 font-semibold text-slate-900 hover:bg-slate-300"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
          >
            🖨️ Print Waybill
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
