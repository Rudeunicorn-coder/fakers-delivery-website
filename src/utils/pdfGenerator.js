import { jsPDF } from 'jspdf'

export function generatePickupNotificationPDF(parcel) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 15

  // Header
  doc.setFontSize(24)
  doc.setTextColor(34, 197, 94)
  doc.text('🕊 CommonSwift Logistics', margin, margin + 8)

  doc.setFontSize(11)
  doc.setTextColor(100, 116, 139)
  doc.text('Parcel Available for Pickup', margin, margin + 18)

  // Divider
  doc.setDrawColor(200, 200, 200)
  doc.line(margin, margin + 22, pageWidth - margin, margin + 22)

  // Main content
  let yPosition = margin + 32

  // Tracking number (prominent)
  doc.setFontSize(14)
  doc.setTextColor(15, 23, 42)
  doc.text('Tracking Number:', margin, yPosition)
  doc.setFontSize(16)
  doc.setTextColor(34, 197, 94)
  doc.setFont(undefined, 'bold')
  doc.text(parcel.tracking_number, margin, yPosition + 8)
  doc.setFont(undefined, 'normal')
  doc.setTextColor(0, 0, 0)

  yPosition += 20

  // Pickup Instructions
  doc.setFontSize(12)
  doc.setTextColor(34, 197, 94)
  doc.setFont(undefined, 'bold')
  doc.text('📍 PICKUP INSTRUCTIONS:', margin, yPosition)
  doc.setFont(undefined, 'normal')
  doc.setTextColor(0, 0, 0)

  yPosition += 8

  doc.setFontSize(10)
  const instructionText = `Your parcel is ready for pickup! Please contact us or visit our office with this tracking code.`
  const wrappedInstructions = doc.splitTextToSize(instructionText, pageWidth - 2 * margin)
  doc.text(wrappedInstructions, margin, yPosition)

  yPosition += wrappedInstructions.length * 6 + 4

  // Contact info box
  doc.setFillColor(240, 253, 250)
  doc.rect(margin, yPosition - 2, pageWidth - 2 * margin, 28, 'F')
  doc.setDrawColor(45, 212, 191)
  doc.rect(margin, yPosition - 2, pageWidth - 2 * margin, 28)

  doc.setFontSize(10)
  doc.setTextColor(0, 123, 100)
  doc.setFont(undefined, 'bold')
  doc.text('📞 Contact Information:', margin + 5, yPosition + 3)
  doc.setFont(undefined, 'normal')
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(9)
  doc.text('Phone: +1 (800) 123-4567', margin + 5, yPosition + 10)
  doc.text('Email: pickup@commonswift.com', margin + 5, yPosition + 17)
  doc.text('Office Hours: Mon-Fri 9AM-6PM, Sat 10AM-4PM', margin + 5, yPosition + 24)

  yPosition += 34

  // Divider
  doc.setDrawColor(200, 200, 200)
  doc.line(margin, yPosition, pageWidth - margin, yPosition)

  yPosition += 8

  // Sender Information
  doc.setFontSize(11)
  doc.setTextColor(34, 197, 94)
  doc.setFont(undefined, 'bold')
  doc.text('📦 SENDER INFORMATION:', margin, yPosition)
  doc.setFont(undefined, 'normal')
  doc.setTextColor(0, 0, 0)

  yPosition += 7

  doc.setFontSize(9)
  doc.text(`Name: ${parcel.sender_name}`, margin, yPosition)
  yPosition += 6
  doc.text(`Phone: ${parcel.sender_phone}`, margin, yPosition)
  yPosition += 6
  doc.text(`Address: ${parcel.sender_address}`, margin, yPosition)

  yPosition += 12

  // Recipient Information
  doc.setFontSize(11)
  doc.setTextColor(34, 197, 94)
  doc.setFont(undefined, 'bold')
  doc.text('👤 YOUR INFORMATION:', margin, yPosition)
  doc.setFont(undefined, 'normal')
  doc.setTextColor(0, 0, 0)

  yPosition += 7

  doc.setFontSize(9)
  doc.text(`Name: ${parcel.receiver_name}`, margin, yPosition)
  yPosition += 6
  doc.text(`Phone: ${parcel.receiver_phone}`, margin, yPosition)
  yPosition += 6
  doc.text(`Destination: ${parcel.destination}`, margin, yPosition)

  yPosition += 12

  // Route Information
  doc.setFontSize(11)
  doc.setTextColor(34, 197, 94)
  doc.setFont(undefined, 'bold')
  doc.text('🚚 SHIPMENT DETAILS:', margin, yPosition)
  doc.setFont(undefined, 'normal')
  doc.setTextColor(0, 0, 0)

  yPosition += 7

  doc.setFontSize(9)
  doc.text(`From: ${parcel.origin}`, margin, yPosition)
  yPosition += 6
  doc.text(`To: ${parcel.destination}`, margin, yPosition)
  yPosition += 6
  doc.text(`Status: Available for Pickup`, margin, yPosition)
  if (parcel.notes) {
    yPosition += 6
    doc.text(`Notes: ${parcel.notes}`, margin, yPosition)
  }

  // Footer
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  doc.text(
    `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
    margin,
    pageHeight - 10
  )

  return doc
}

export function downloadPickupNotificationPDF(parcel) {
  const doc = generatePickupNotificationPDF(parcel)
  doc.save(`${parcel.tracking_number}-pickup-notice.pdf`)
}
