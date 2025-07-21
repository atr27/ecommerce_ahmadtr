/**
 * Xendit Payment Test Data Helper - Browser Version
 * Load this script in browser console for easy form filling
 */

// Xendit Test Credit Cards (Official Test Data)
const XENDIT_TEST_CARDS = {
  visa_success: {
    number: '4000000000000002',
    cvv: '123',
    expiry: '12/25',
    name: 'John Doe',
    description: '✅ Visa - Payment Success'
  },
  mastercard_success: {
    number: '5200000000000007',
    cvv: '123',
    expiry: '12/25',
    name: 'Jane Smith',
    description: '✅ Mastercard - Payment Success'
  },
  visa_3ds: {
    number: '4000000000000028',
    cvv: '123',
    expiry: '12/25',
    name: 'Test User 3DS',
    description: '🔐 Visa - 3DS Authentication Required'
  },
  card_declined: {
    number: '4000000000000010',
    cvv: '123',
    expiry: '12/25',
    name: 'Declined Card',
    description: '❌ Card Declined (for testing failures)'
  },
  insufficient_funds: {
    number: '4000000000000019',
    cvv: '123',
    expiry: '12/25',
    name: 'No Funds',
    description: '💸 Insufficient Funds'
  }
}

// Indonesian Test Customer Data
const TEST_CUSTOMERS = [
  {
    name: 'Ahmad Rizki Pratama',
    email: 'ahmad.rizki@gamesphere.test',
    phone: '+628123456789',
    address: 'Jl. Sudirman Kav. 52-53',
    city: 'Jakarta Selatan',
    postalCode: '12190',
    notes: 'Gamer premium - suka game RPG'
  },
  {
    name: 'Sari Dewi Lestari',
    email: 'sari.dewi@gamesphere.test',
    phone: '+628987654321',
    address: 'Jl. M.H. Thamrin No. 28-30',
    city: 'Jakarta Pusat',
    postalCode: '10350',
    notes: 'Casual gamer - suka game puzzle'
  },
  {
    name: 'Budi Santoso Wijaya',
    email: 'budi.santoso@gamesphere.test',
    phone: '+628555666777',
    address: 'Jl. Gatot Subroto Kav. 18',
    city: 'Jakarta Selatan',
    postalCode: '12930',
    notes: 'Hardcore gamer - koleksi semua platform'
  }
]

// Auto-fill checkout form function
function fillCheckoutForm(customerIndex = 0) {
  const customer = TEST_CUSTOMERS[customerIndex] || TEST_CUSTOMERS[0]
  
  console.log('🎯 Mengisi form checkout dengan data test...')
  console.log('👤 Customer:', customer.name)
  
  // Helper function to fill form fields
  const fillField = (selector, value) => {
    const field = document.querySelector(selector)
    if (field) {
      field.value = value
      // Trigger React events
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
      nativeInputValueSetter.call(field, value)
      
      const inputEvent = new Event('input', { bubbles: true })
      field.dispatchEvent(inputEvent)
      
      const changeEvent = new Event('change', { bubbles: true })
      field.dispatchEvent(changeEvent)
      
      return true
    }
    return false
  }

  // Fill all form fields
  const fields = [
    { selector: 'input[name="name"]', value: customer.name, label: 'Nama' },
    { selector: 'input[name="email"]', value: customer.email, label: 'Email' },
    { selector: 'input[name="phone"]', value: customer.phone, label: 'Telepon' },
    { selector: 'input[name="address"]', value: customer.address, label: 'Alamat' },
    { selector: 'input[name="city"]', value: customer.city, label: 'Kota' },
    { selector: 'input[name="postalCode"]', value: customer.postalCode, label: 'Kode Pos' },
    { selector: 'textarea[name="notes"]', value: customer.notes, label: 'Catatan' }
  ]

  let filledCount = 0
  fields.forEach(field => {
    if (fillField(field.selector, field.value)) {
      console.log(`✅ ${field.label}: ${field.value}`)
      filledCount++
    } else {
      console.log(`❌ ${field.label}: Field tidak ditemukan`)
    }
  })

  console.log(`\n🎉 Berhasil mengisi ${filledCount}/${fields.length} field!`)
  
  return customer
}

// Show credit card test data
function showCreditCardData(cardType = 'visa_success') {
  const card = XENDIT_TEST_CARDS[cardType] || XENDIT_TEST_CARDS.visa_success
  
  console.log('\n💳 DATA KARTU KREDIT TEST XENDIT:')
  console.log('================================')
  console.log('Nomor Kartu:', card.number)
  console.log('CVV:', card.cvv)
  console.log('Tanggal Kadaluarsa:', card.expiry)
  console.log('Nama Pemegang:', card.name)
  console.log('Status:', card.description)
  console.log('================================')
  console.log('📋 Copy data di atas ke halaman pembayaran Xendit')
  
  return card
}

// Show all available test cards
function showAllCards() {
  console.log('\n💳 SEMUA KARTU TEST XENDIT:')
  console.log('===========================')
  Object.keys(XENDIT_TEST_CARDS).forEach((key, index) => {
    const card = XENDIT_TEST_CARDS[key]
    console.log(`${index + 1}. ${key.toUpperCase()}:`)
    console.log(`   Nomor: ${card.number}`)
    console.log(`   Status: ${card.description}`)
    console.log('')
  })
  console.log('Gunakan: showCreditCardData("nama_kartu") untuk detail')
}

// Quick test function
function quickTest() {
  console.log('🚀 QUICK TEST - MENGISI FORM OTOMATIS')
  console.log('=====================================')
  
  const customer = fillCheckoutForm(0)
  showCreditCardData('visa_success')
  
  console.log('\n📝 LANGKAH SELANJUTNYA:')
  console.log('1. Klik tombol "Proceed to Payment"')
  console.log('2. Di halaman Xendit, gunakan data kartu di atas')
  console.log('3. Klik "Pay Now" untuk menyelesaikan pembayaran')
  
  return { customer, card: XENDIT_TEST_CARDS.visa_success }
}

// Make functions globally available
window.fillCheckoutForm = fillCheckoutForm
window.showCreditCardData = showCreditCardData
window.showAllCards = showAllCards
window.quickTest = quickTest
window.XENDIT_TEST_CARDS = XENDIT_TEST_CARDS
window.TEST_CUSTOMERS = TEST_CUSTOMERS

// Auto-run when loaded
console.log('🎮 GAMESPHERE PAYMENT TEST HELPER LOADED!')
console.log('=========================================')
console.log('📋 FUNGSI YANG TERSEDIA:')
console.log('• quickTest() - Isi form + tampilkan data kartu')
console.log('• fillCheckoutForm() - Isi form checkout saja')
console.log('• showCreditCardData() - Tampilkan data kartu test')
console.log('• showAllCards() - Tampilkan semua kartu test')
console.log('')
console.log('🚀 MULAI CEPAT: Ketik quickTest() dan tekan Enter!')
