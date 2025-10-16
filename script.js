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
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
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
    
    // Save booking to localStorage
    saveBooking(formData);
    
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

function saveBooking(formData) {
    const bookings = JSON.parse(localStorage.getItem('cleanproBookings') || '[]');
    
    const booking = {
        id: Date.now().toString(),
        ...formData,
        created: new Date().toISOString()
    };
    
    bookings.unshift(booking);
    localStorage.setItem('cleanproBookings', JSON.stringify(bookings));
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