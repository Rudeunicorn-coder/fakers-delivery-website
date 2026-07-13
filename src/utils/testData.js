import { supabase } from '../supabaseclient'

export const sampleParcels = [
  {
    tracking_number: 'VEL-26-42857',
    sender_name: 'Tech Solutions Inc',
    sender_phone: '+234 701 234 5678',
    sender_address: '128 Harbor Ave, Lagos',
    receiver_name: 'Alicia Brooks',
    receiver_phone: '+234 802 345 6789',
    receiver_email: 'alicia.brooks@email.com',
    origin: 'Lagos',
    destination: 'Kano',
    status: 'In Transit',
    notes: 'Handle with care - Electronics',
  },
  {
    tracking_number: 'VEL-26-51923',
    sender_name: 'Global Traders Ltd',
    sender_phone: '+234 703 456 7890',
    sender_address: '45 Market St, Port Harcourt',
    receiver_name: 'Marcus Lee',
    receiver_phone: '+234 804 567 8901',
    receiver_email: 'marcus.lee@email.com',
    origin: 'Rivers',
    destination: 'Abuja',
    status: 'Out for Delivery',
    notes: 'Signature required',
  },
  {
    tracking_number: 'VEL-26-63741',
    sender_name: 'Fashion Forward Co',
    sender_phone: '+234 705 678 9012',
    sender_address: '789 Ikoyi Ave, Lagos',
    receiver_name: 'Sarah Johnson',
    receiver_phone: '+234 806 789 0123',
    receiver_email: 'sarah.j@email.com',
    origin: 'Lagos',
    destination: 'Ibadan',
    status: 'Processing',
    notes: 'Fragile - clothing items',
  },
  {
    tracking_number: 'VEL-26-74829',
    sender_name: 'Express Medical Supplies',
    sender_phone: '+234 707 890 1234',
    sender_address: '321 Lekki St, Lagos',
    receiver_name: 'David Chen',
    receiver_phone: '+234 808 901 2345',
    receiver_email: 'david.chen@email.com',
    origin: 'Lagos',
    destination: 'Kaduna',
    status: 'In Transit',
    notes: 'Time-sensitive medical equipment',
  },
  {
    tracking_number: 'VEL-26-85706',
    sender_name: 'Organic Foods Distribution',
    sender_phone: '+234 709 012 3456',
    sender_address: '567 Enugu Ave, Enugu',
    receiver_name: 'Jennifer Martinez',
    receiver_phone: '+234 810 123 4567',
    receiver_email: 'jennifer.m@email.com',
    origin: 'Enugu',
    destination: 'Imo',
    status: 'Out for Delivery',
    notes: 'Perishable goods - keep cold',
  },
  {
    tracking_number: 'VEL-26-96534',
    sender_name: 'Tech Startup Labs',
    sender_phone: '+234 711 234 5678',
    sender_address: '890 Abuja Road, Kano',
    receiver_name: 'Robert Williams',
    receiver_phone: '+234 812 345 6789',
    receiver_email: 'robert.w@email.com',
    origin: 'Kano',
    destination: 'Federal Capital Territory',
    status: 'Delivered',
    notes: 'Server hardware',
  },
]

export async function seedTestData(supabaseClient = supabase) {
  if (!supabaseClient) {
    console.error('Supabase client not available')
    return { success: false, error: 'Supabase not configured' }
  }

  try {
    const { data, error } = await supabaseClient.from('parcels').insert(sampleParcels)

    if (error) {
      console.error('Error seeding data:', error)
      return { success: false, error: error.message }
    }

    console.log('Test data seeded successfully:', data)
    return { success: true, count: sampleParcels.length, data }
  } catch (error) {
    console.error('Unexpected error during seeding:', error)
    return { success: false, error: error.message }
  }
}

export async function clearTestData(supabaseClient = supabase) {
  if (!supabaseClient) {
    console.error('Supabase client not available')
    return { success: false, error: 'Supabase not configured' }
  }

  try {
    const trackingNumbers = sampleParcels.map((p) => p.tracking_number)
    const { error } = await supabaseClient
      .from('parcels')
      .delete()
      .in('tracking_number', trackingNumbers)

    if (error) {
      console.error('Error clearing data:', error)
      return { success: false, error: error.message }
    }

    console.log('Test data cleared successfully')
    return { success: true, count: trackingNumbers.length }
  } catch (error) {
    console.error('Unexpected error during clearing:', error)
    return { success: false, error: error.message }
  }
}
