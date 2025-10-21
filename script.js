// Flight Schedules Database (for reference, not used in filtering anymore)
const flightSchedules = {
    roundtrip: [
        { flightNo: '5J 560', from: 'Cebu', to: 'Manila', departTime: '06:00', arriveTime: '07:30', returnTime: '18:00', returnArriveTime: '19:30', duration: '1h 30m', price: 2500, seatsAvailable: 45, fareType: 'Promo Fare', departTerminal: 'Terminal 1', returnTerminal: 'Terminal 1' },
        { flightNo: '5J 561', from: 'Cebu', to: 'Manila', departTime: '10:30', arriveTime: '12:00', returnTime: '14:30', returnArriveTime: '16:00', duration: '1h 30m', price: 3200, seatsAvailable: 32, fareType: 'Standard', departTerminal: 'Terminal 2', returnTerminal: 'Terminal 2' },
        { flightNo: '5J 562', from: 'Cebu', to: 'Davao', departTime: '09:30', arriveTime: '11:45', returnTime: '16:00', returnArriveTime: '18:15', duration: '2h 15m', price: 3500, seatsAvailable: 28, fareType: 'Promo Fare', departTerminal: 'Terminal 1', returnTerminal: 'Terminal 1' }
    ],
    oneway: [
        { flightNo: '5J 570', from: 'Cebu', to: 'Manila', departTime: '08:00', arriveTime: '09:30', duration: '1h 30m', price: 1500, seatsAvailable: 50, fareType: 'Promo Fare', departTerminal: 'Terminal 1' },
        { flightNo: '5J 571', from: 'Cebu', to: 'Manila', departTime: '14:00', arriveTime: '15:30', duration: '1h 30m', price: 2000, seatsAvailable: 38, fareType: 'Standard', departTerminal: 'Terminal 2' },
        { flightNo: '5J 572', from: 'Cebu', to: 'Davao', departTime: '07:00', arriveTime: '09:15', duration: '2h 15m', price: 2200, seatsAvailable: 41, fareType: 'Promo Fare', departTerminal: 'Terminal 1' }
    ]
};

const bookingData = {
    from: '',
    to: '',
    flightType: 'roundtrip',
    departDate: '',
    returnDate: '',
    passengers: 1,
    selectedFlight: null,
    passengerDetails: [],
    generatedFlights: []
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('departDate').min = today;
    document.getElementById('returnDate').min = today;

    document.getElementById('bookingForm').addEventListener('submit', handleBookingSubmit);
    document.getElementById('passengerForm').addEventListener('submit', handlePassengerSubmit);
});

// Navigation
function goToStep(step) {
    const sections = ['homeSection', 'bookingSection', 'flightSection', 'passengerSection', 'summarySection'];
    sections.forEach(section => document.getElementById(section).classList.remove('active'));
    document.getElementById(sections[step]).classList.add('active');
    updateProgress(step);
    window.scrollTo(0, 0);
}

function goBack() {
    const sections = ['homeSection', 'bookingSection', 'flightSection', 'passengerSection', 'summarySection'];
    const currentIndex = sections.findIndex(id => document.getElementById(id).classList.contains('active'));
    if (currentIndex > 0) {
        goToStep(currentIndex - 1);
    }
}

function goToSummary() {
    const form = document.getElementById('passengerForm');
    if (!form) return;
    if (typeof form.requestSubmit === 'function') {
        form.requestSubmit(); // modern browsers
    } else {
        form.submit(); // fallback
    }
}

function updateProgress(step) {
    const steps = document.querySelectorAll('.step-circle');
    const progressLine = document.getElementById('progressLine');
    const totalSteps = steps.length - 1;

    steps.forEach((circle, index) => {
        circle.classList.remove('active', 'completed');
        if (index < step - 1) circle.classList.add('completed');
        if (index === step - 1) circle.classList.add('active');
    });

    const progressPercent = ((step - 1) / totalSteps) * 87;
    progressLine.style.width = `${progressPercent}%`;
}

function toggleReturnDate() {
    const type = document.querySelector('input[name="flightType"]:checked').value;
    const returnGroup = document.getElementById('returnDateGroup');
    const returnDate = document.getElementById('returnDate');
    if (type === 'oneway') {
        returnGroup.classList.add('hidden');
        returnDate.removeAttribute('required');
    } else {
        returnGroup.classList.remove('hidden');
        returnDate.setAttribute('required', true);
    }
    bookingData.flightType = type;
}

// Booking Form Handler
function handleBookingSubmit(e) {
    e.preventDefault();

    const from = document.getElementById('fromLocation').value.trim();
    const to = document.getElementById('toLocation').value.trim();

    if (!from || !to) {
        alert('Please enter both origin and destination.');
        return;
    }

    if (from.toLowerCase() === to.toLowerCase()) {
        alert('Origin and destination cannot be the same.');
        return;
    }

    bookingData.from = capitalizeWords(from);
    bookingData.to = capitalizeWords(to);
    bookingData.flightType = document.querySelector('input[name="flightType"]:checked').value;
    bookingData.departDate = document.getElementById('departDate').value;
    bookingData.returnDate = bookingData.flightType === 'roundtrip' ? document.getElementById('returnDate').value : null;
    bookingData.passengers = parseInt(document.getElementById('passengers').value);

    displayFlights();
    goToStep(2);
}

function capitalizeWords(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

// Display flights
function displayFlights() {
    const container = document.getElementById('flightsContainer');
    const { from, to, flightType, departDate, returnDate } = bookingData;

    let flights = [];

    if (flightType === 'roundtrip') {
        flights = [
            { flightNo: 'J&K-500', from, to, departTime: '06:00', arriveTime: '07:30', returnTime: '18:00', returnArriveTime: '19:30', duration: '1h 30m', price: 2500, seatsAvailable: 45, fareType: 'Promo Fare', departTerminal: 'Terminal 1', returnTerminal: 'Terminal 1' },
            { flightNo: 'J&K-501', from, to, departTime: '10:30', arriveTime: '12:00', returnTime: '15:00', returnArriveTime: '16:30', duration: '1h 30m', price: 3200, seatsAvailable: 32, fareType: 'Standard', departTerminal: 'Terminal 2', returnTerminal: 'Terminal 2' },
            { flightNo: 'J&K-502', from, to, departTime: '14:45', arriveTime: '16:15', returnTime: '21:00', returnArriveTime: '22:30', duration: '1h 30m', price: 3600, seatsAvailable: 28, fareType: 'Promo Fare', departTerminal: 'Terminal 3', returnTerminal: 'Terminal 3' }
        ];
    } else {
        flights = [
            { flightNo: 'K&J-500', from, to, departTime: '07:00', arriveTime: '08:30', duration: '1h 30m', price: 1800, seatsAvailable: 50, fareType: 'Promo Fare', departTerminal: 'Terminal 1' },
            { flightNo: 'K&J-501', from, to, departTime: '12:15', arriveTime: '13:45', duration: '1h 30m', price: 2100, seatsAvailable: 40, fareType: 'Standard', departTerminal: 'Terminal 2' },
            { flightNo: 'K&J-502', from, to, departTime: '17:30', arriveTime: '19:00', duration: '1h 30m', price: 2400, seatsAvailable: 36, fareType: 'Promo Fare', departTerminal: 'Terminal 3' }
        ];
    }

    bookingData.generatedFlights = flights;

    container.innerHTML = flights.map((f, idx) => `
        <div class="flight-card">
            <h3>${f.flightNo}</h3>
            <p><strong>${f.from} ➜ ${f.to}</strong></p>
            <p style="font-size: 12px; color: #999;">Depart Date: ${departDate}</p>
            <div class="flight-info">
                <div>
                    <p><strong>${convertTo12Hour(f.departTime)}</strong> - ${convertTo12Hour(f.arriveTime)}</p>
                    <p style="font-size: 12px; color: #999;">${f.duration}</p>
                </div>
                <div style="text-align: right;">
                    <p><strong>Seats:</strong> ${f.seatsAvailable}</p>
                </div>
            </div>
            ${flightType === 'roundtrip' ? `
                <div style="background:#e8f4f8;padding:10px;border-radius:6px;margin:10px 0;font-size:13px;">
                    <p><strong>Return:</strong> ${convertTo12Hour(f.returnTime)} - ${convertTo12Hour(f.returnArriveTime)}</p>
                    <p style="font-size:11px;color:#666;">Return Date: ${returnDate}</p>
                </div>` : ''}
            <div class="price">₱${f.price.toLocaleString()}</div>
            <p style="font-size:13px; color:#007bff; margin-top:4px;"><strong>Fare Type:</strong> ${f.fareType || '—'}</p>
            <button class="btn-primary" onclick="selectFlight(${idx})">Select</button>
        </div>
    `).join('');
}

function convertTo12Hour(timeStr) {
    const [hour, minute] = timeStr.split(':').map(Number);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
}

function selectFlight(idx) {
    const selected = bookingData.generatedFlights[idx];
    bookingData.selectedFlight = { ...selected, departDate: bookingData.departDate, returnDate: bookingData.returnDate };
    displayPassengerForms();
    goToStep(3);
}

function displayPassengerForms() {
    const container = document.getElementById('passengerFormsContainer');
    container.innerHTML = '';

    for (let i = 0; i < bookingData.passengers; i++) {
        const form = document.createElement('div');
        form.className = 'passenger-form';
        form.innerHTML = `
            <h3>Passenger ${i + 1}</h3>
            <div class="form-row">
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" name="fullName_${i}" placeholder="JD Som" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" name="email_${i}" placeholder="jd@example.com" required>
                </div>
                <div class="form-group">
                    <label>Phone Number</label>
                    <input type="tel" name="phone_${i}" placeholder="09xxxxxxxxx" required>
                </div>
            </div>
        `;
        container.appendChild(form);
    }
}

function handlePassengerSubmit(e) {
    e.preventDefault();

    let isValid = true;
    bookingData.passengerDetails = [];

    for (let i = 0; i < bookingData.passengers; i++) {
        const fullName = document.querySelector(`input[name="fullName_${i}"]`).value.trim();
        const email = document.querySelector(`input[name="email_${i}"]`).value.trim();
        const phone = document.querySelector(`input[name="phone_${i}"]`).value.trim();

        if (!fullName || !email || !phone) {
            isValid = false;
        }

        bookingData.passengerDetails.push({
            fullName,
            email,
            phone,
            seat: `${i + 1}${String.fromCharCode(65 + (i % 6))}`
        });
    }

    if (isValid) {
        displaySummary();
        goToStep(4);
    } else {
        alert('Please complete all passenger details.');
    }
}
const PROMO_DISCOUNT = 0.15;
// ✅ Updated: Display Summary (Each Passenger Separate + Flight Info Layout)
function displaySummary() {
    const s = bookingData.selectedFlight;
    const summary = document.getElementById('summaryContent');

    if (!s) {
        summary.innerHTML = '<p>No flight selected.</p>';
        return;
    }

    const basePrice = s.price;
    const isPromo = (s.fareType || '').toLowerCase().includes('promo');
    const discountAmount = isPromo ? basePrice * PROMO_DISCOUNT : 0;

    // Build per-passenger fares: only first passenger gets discount (if promo)
    const passengerFares = [];
    for (let i = 0; i < bookingData.passengers; i++) {
        if (isPromo && i === 0) {
            passengerFares.push(basePrice - discountAmount);
        } else {
            passengerFares.push(basePrice);
        }
    }

    const total = passengerFares.reduce((acc, v) => acc + v, 0);

    const passengerSummaries = bookingData.passengerDetails.map((p, i) => `
        <div class="summary-card">
            <h3>Passenger ${i + 1}</h3>
            <p><strong>Name:</strong> ${p.fullName}</p>
            <p><strong>Seat:</strong> ${p.seat}</p>

            <div class="flight-summary">
                <h4>${s.from} (${s.from.slice(0,3).toUpperCase()}) → ${s.to} (${s.to.slice(0,3).toUpperCase()})</h4>
                
                <div class="flight-details-grid">
                    <div>
                        <p class="label">Departure</p>
                        <p>${formatDate(s.departDate)} • ${convertTo12Hour(s.departTime)}</p>
                    </div>
                    ${bookingData.flightType === 'roundtrip' ? `
                    <div>
                        <p class="label">Return</p>
                        <p>${formatDate(s.returnDate)} • ${convertTo12Hour(s.returnTime)}</p>
                    </div>` : ''}
                    <div>
                        <p class="label">Flight Duration</p>
                        <p>${s.duration}</p>
                    </div>
                    <div>
                        <p class="label">Fare Type</p>
                        <p>${s.fareType}</p>
                    </div>
                </div>

                <div class="fare-amount">
                    <p><strong>Fare:</strong> ₱${passengerFares[i].toLocaleString()}</p>
                    ${isPromo && i === 0 ? `<p style="color:green;font-size:12px;margin-top:4px;">Promo applied: -₱${discountAmount.toLocaleString()} (${Math.round(PROMO_DISCOUNT*100)}%)</p>` : ''}
                </div>
            </div>
        </div>
    `).join('');

    summary.innerHTML = `
        ${passengerSummaries}
        <div class="summary-card total">
            <h3>💰 Total Fee</h3>
            <p><strong>₱${total.toLocaleString()}</strong></p>
            ${isPromo ? `<p style="font-size:13px;color:#666;margin-top:6px;">Promo: only first passenger received a ${Math.round(PROMO_DISCOUNT*100)}% discount.</p>` : ''}
        </div>
    `;
}
// Helper: format date (YYYY-MM-DD → readable)
function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
}


function confirmBooking() {
    document.getElementById('successModal').classList.add('active');
}

function resetBooking() {
    Object.assign(bookingData, {
        from: '',
        to: '',
        flightType: 'roundtrip',
        departDate: '',
        returnDate: '',
        passengers: 1,
        selectedFlight: null,
        passengerDetails: []
    });

    document.getElementById('bookingForm').reset();
    document.getElementById('passengerForm').reset();
    document.getElementById('successModal').classList.remove('active');

    const steps = document.querySelectorAll('.step-circle');
    steps.forEach(c => c.classList.remove('active', 'completed'));
    steps[0].classList.add('active');
    document.getElementById('progressLine').style.width = '0%';

    goToStep(0);
}
