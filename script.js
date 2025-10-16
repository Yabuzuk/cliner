// Smooth scrolling
function scrollToBooking() {
    document.getElementById('booking').scrollIntoView({
        behavior: 'smooth'
    });
}

// Calendar and booking system
let currentDate = new Date();
let selectedDate = null;
let selectedTime = null;
let bookedSlots = [];

document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    
    loadBookedSlots();
    renderCalendar();
});

// Generate time slots from 7:00 to 17:00 with 15min intervals
function generateTimeSlots() {
    const slots = [];
    for (let hour = 7; hour < 17; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
            const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            slots.push(timeStr);
        }
    }
    return slots;
}

// Load booked slots from database
async function loadBookedSlots() {
    try {
        if (window.supabaseDB) {
            bookedSlots = await window.supabaseDB.select();
        } else {
            bookedSlots = JSON.parse(localStorage.getItem('cleanproBookings') || '[]');
        }
    } catch (error) {
        console.log('Ошибка загрузки бронирований:', error);
        bookedSlots = JSON.parse(localStorage.getItem('cleanproBookings') || '[]');
    }
}

// Render calendar
function renderCalendar() {
    const calendar = document.getElementById('calendar');
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const today = new Date();
    
    const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                       'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    
    calendar.innerHTML = `
        <div class="calendar-header">
            <button class="calendar-nav" onclick="changeMonth(-1)">‹</button>
            <h3>${monthNames[month]} ${year}</h3>
            <button class="calendar-nav" onclick="changeMonth(1)">›</button>
        </div>
        <div class="calendar-grid">
            <div style="font-weight: bold; text-align: center;">Пн</div>
            <div style="font-weight: bold; text-align: center;">Вт</div>
            <div style="font-weight: bold; text-align: center;">Ср</div>
            <div style="font-weight: bold; text-align: center;">Чт</div>
            <div style="font-weight: bold; text-align: center;">Пт</div>
            <div style="font-weight: bold; text-align: center;">Сб</div>
            <div style="font-weight: bold; text-align: center;">Вс</div>
        </div>
        <div id="timeSlots" class="time-slots"></div>
    `;
    
    const grid = calendar.querySelector('.calendar-grid');
    
    // Empty cells before first day
    const startDay = (firstDay.getDay() + 6) % 7; // Monday = 0
    for (let i = 0; i < startDay; i++) {
        grid.innerHTML += '<div></div>';
    }
    
    // Days of month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(year, month, day);
        const dateStr = date.toISOString().split('T')[0];
        const isPast = date < today;
        const isSelected = selectedDate === dateStr;
        
        const dayBookings = bookedSlots.filter(slot => slot.date === dateStr);
        const isFullyBooked = dayBookings.length >= generateTimeSlots().length;
        
        let className = 'calendar-day';
        if (isPast) className += ' disabled';
        if (isSelected) className += ' selected';
        if (isFullyBooked && !isPast) className += ' booked';
        
        grid.innerHTML += `<div class="${className}" onclick="selectDate('${dateStr}')">${day}</div>`;
    }
}

// Change month
function changeMonth(direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    renderCalendar();
}

// Select date and show time slots
function selectDate(dateStr) {
    const date = new Date(dateStr);
    const today = new Date();
    
    if (date < today) return;
    
    selectedDate = dateStr;
    document.getElementById('date').value = dateStr;
    
    renderCalendar();
    showTimeSlots(dateStr);
}

// Show available time slots
function showTimeSlots(dateStr) {
    const timeSlotsContainer = document.getElementById('timeSlots');
    const allSlots = generateTimeSlots();
    const dayBookings = bookedSlots.filter(slot => slot.date === dateStr);
    const bookedTimes = dayBookings.map(slot => slot.time);
    
    timeSlotsContainer.innerHTML = '<h4 style="grid-column: 1/-1; margin: 10px 0;">Доступное время:</h4>';
    
    allSlots.forEach(time => {
        const isBooked = bookedTimes.includes(time);
        const isSelected = selectedTime === time;
        
        let className = 'time-slot';
        if (isBooked) className += ' booked';
        if (isSelected) className += ' selected';
        
        const onclick = isBooked ? '' : `onclick="selectTime('${time}')"`;
        
        timeSlotsContainer.innerHTML += `
            <div class="${className}" ${onclick}>
                ${time}
                ${isBooked ? '<br><small>Занято</small>' : ''}
            </div>
        `;
    });
}

// Select time
function selectTime(time) {
    selectedTime = time;
    document.getElementById('time').value = time;
    document.getElementById('time').style.display = 'block';
    
    showTimeSlots(selectedDate);
}

// Load available slots when date changes
function loadAvailableSlots() {
    const dateStr = document.getElementById('date').value;
    if (dateStr) {
        selectDate(dateStr);
    }
}

// Form submission
document.getElementById('bookingForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        serviceType: document.getElementById('serviceType').value,
        service: document.getElementById('service').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        area: document.getElementById('area').value,
        comment: document.getElementById('comment').value
    };
    
    // Validate time slot
    if (!selectedTime) {
        alert('Пожалуйста, выберите время из доступных слотов');
        return;
    }
    
    // Save booking to Firebase/localStorage
    await saveBooking(formData);
    
    // Show success message
    showSuccessMessage();
    
    // Reset form
    this.reset();
});

function showSuccessMessage() {
    // Create success message element
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = 'Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время.';
    successDiv.style.display = 'block';
    
    // Insert before form
    const form = document.getElementById('bookingForm');
    form.parentNode.insertBefore(successDiv, form);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

async function saveBooking(formData) {
    const booking = {
        name: formData.name,
        phone: formData.phone,
        service_type: formData.serviceType,
        service: formData.service,
        date: formData.date,
        time: formData.time,
        area: formData.area,
        comment: formData.comment
    };
    
    try {
        console.log('Попытка сохранить:', booking);
        const result = await window.supabaseDB.insert(booking);
        console.log('Заявка сохранена в Supabase:', result);
        // Обновляем календарь
        await loadBookedSlots();
        renderCalendar();
        if (selectedDate) showTimeSlots(selectedDate);
        
        alert('Заявка отправлена в базу данных!');
    } catch (error) {
        console.log('Ошибка Supabase:', error);
        alert('Ошибка сохранения в базу, сохраняем локально');
        const bookings = JSON.parse(localStorage.getItem('cleanproBookings') || '[]');
        booking.id = Date.now().toString();
        booking.created = new Date().toISOString();
        bookings.unshift(booking);
        localStorage.setItem('cleanproBookings', JSON.stringify(bookings));
        alert('Заявка сохранена локально');
    }
}

// Smooth scroll for navigation links
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Phone number formatting
document.getElementById('phone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 0) {
        if (value.length <= 1) {
            value = '+7 (' + value;
        } else if (value.length <= 4) {
            value = '+7 (' + value.substring(1);
        } else if (value.length <= 7) {
            value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4);
        } else if (value.length <= 9) {
            value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4, 7) + '-' + value.substring(7);
        } else {
            value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4, 7) + '-' + value.substring(7, 9) + '-' + value.substring(9, 11);
        }
    }
    e.target.value = value;
});

// Service options management
const serviceOptions = {
    basic: [
        { value: 'basic-1br', text: '1 спальня - 3ч (€50)' },
        { value: 'basic-2br', text: '2 спальни - 4ч (€65)' },
        { value: 'basic-3br', text: '3 спальни - 5ч (€80)' },
        { value: 'basic-4br', text: '4 спальни - 6ч (€95)' },
        { value: 'basic-5br', text: '5 спален - 8ч (€0.6/м²)' },
        { value: 'basic-large', text: 'Более 250м² (€0.5/м²)' }
    ],
    spring: [
        { value: 'spring-1br', text: '1 спальня (€16/час)' },
        { value: 'spring-2br', text: '2 спальни (€16/час)' },
        { value: 'spring-3br', text: '3 спальни (€16/час)' },
        { value: 'spring-4br', text: '4 спальни (€16/час)' },
        { value: 'spring-5br', text: '5 спален (€15/час)' }
    ],
    urgent: [
        { value: 'urgent-standard', text: 'Срочная уборка (€35/час)' },
        { value: 'urgent-large', text: 'Более 250м² (€0.5/м²)' }
    ],
    renovation: [
        { value: 'renovation-1br', text: '1 спальня (€3/м²)' },
        { value: 'renovation-2br', text: '2 спальни (€3/м²)' },
        { value: 'renovation-3br', text: '3 спальни (€3/м²)' },
        { value: 'renovation-4br', text: '4 спальни (€3/м²)' },
        { value: 'renovation-5br', text: '5 спален (€3/м²)' }
    ],
    commercial: [
        { value: 'commercial-basic', text: 'Базовая уборка (€0.5/м² или €20/час)' },
        { value: 'commercial-spring', text: 'Генеральная уборка (€0.8/м² или €20/час)' },
        { value: 'commercial-renovation', text: 'После ремонта (€3/м² или €20/час)' }
    ],
    drycleaning: [
        { value: 'sofa-2seat', text: '2-местный диван (€50)' },
        { value: 'sofa-3seat', text: '3-местный диван (€70)' },
        { value: 'sofa-4seat', text: '4-местный диван (€90)' },
        { value: 'sofa-corner', text: 'Угловой диван (€90)' },
        { value: 'sofa-large-corner', text: 'Большой угловой диван (€110)' },
        { value: 'mattress-single', text: 'Одиночный матрас (€50)' },
        { value: 'mattress-half', text: 'Полутораспальный матрас (€70)' },
        { value: 'mattress-double', text: 'Двуспальный матрас (€90)' },
        { value: 'carpet-low', text: 'Ковер с коротким ворсом (€5/м²)' },
        { value: 'carpet-medium', text: 'Ковер со средним ворсом (€3/м²)' },
        { value: 'carpet-high', text: 'Ковер с длинным ворсом (€4/м²)' },
        { value: 'armchair', text: 'Кресло (€25)' },
        { value: 'armchair-sliding', text: 'Раздвижное кресло (€30)' },
        { value: 'chair-office', text: 'Офисный стул (€20)' },
        { value: 'chair', text: 'Стул (€10)' },
        { value: 'bench', text: 'Банкетка (€15)' }
    ],
    additional: [
        { value: 'pickup-key', text: 'Забрать за ключом (€20)' },
        { value: 'ironing', text: 'Глажка белья (€15/час)' },
        { value: 'washing', text: 'Стирка, развесить белье (€5)' },
        { value: 'animal-tray', text: 'Почистить лоток для животных (€5)' },
        { value: 'errands', text: 'Поручения (химчистка, магазин, обувь) (€15)' },
        { value: 'mosquito-net', text: 'Москитная сетка (от €5)' },
        { value: 'street-blinds', text: 'Уличные жалюзи (от €5)' },
        { value: 'yard-cleaning', text: 'Уборка придомовой территории (от €8)' },
        { value: 'animals-house', text: 'Животные в доме (+€10)' }
    ]
};

function updateServiceOptions() {
    const serviceType = document.getElementById('serviceType').value;
    const serviceSelect = document.getElementById('service');
    
    if (!serviceType) {
        serviceSelect.style.display = 'none';
        serviceSelect.innerHTML = '<option value="">Выберите услугу</option>';
        return;
    }
    
    serviceSelect.style.display = 'block';
    serviceSelect.innerHTML = '<option value="">Выберите услугу</option>';
    
    const options = serviceOptions[serviceType] || [];
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        serviceSelect.appendChild(optionElement);
    });
}