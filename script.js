// Smooth scrolling
function scrollToBooking() {
    document.getElementById('booking').scrollIntoView({
        behavior: 'smooth'
    });
}

// Set minimum date to today
document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    
    // Set default time slots
    const timeInput = document.getElementById('time');
    timeInput.min = '08:00';
    timeInput.max = '20:00';
});

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
    const selectedTime = document.getElementById('time').value;
    const hour = parseInt(selectedTime.split(':')[0]);
    
    if (hour < 8 || hour > 20) {
        alert('Пожалуйста, выберите время с 8:00 до 20:00');
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
        await window.supabaseDB.insert(booking);
        console.log('Заявка сохранена в Supabase');
    } catch (error) {
        console.log('Ошибка Supabase, сохраняем локально:', error);
        const bookings = JSON.parse(localStorage.getItem('cleanproBookings') || '[]');
        booking.id = Date.now().toString();
        booking.created = new Date().toISOString();
        bookings.unshift(booking);
        localStorage.setItem('cleanproBookings', JSON.stringify(bookings));
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