import { useEffect } from 'react'

export default function TawkChat() {
  useEffect(() => {
    const propertyId = import.meta.env.VITE_TAWK_PROPERTY_ID
    const widgetId = import.meta.env.VITE_TAWK_WIDGET_ID

    if (!propertyId || !widgetId) return

    if (document.getElementById('tawk-script')) return

    window.Tawk_API = window.Tawk_API || {}
    window.Tawk_LoadStart = new Date()

    const script = document.createElement('script')
    script.id = 'tawk-script'
    script.async = true
    script.src = `https://embed.tawk.to/${propertyId}/${widgetId}`
    script.charset = 'UTF-8'
    script.setAttribute('crossorigin', '*')
    document.body.appendChild(script)
  }, [])

  return null
}
