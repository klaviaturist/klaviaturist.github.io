// JavaScript для промо-страницы "Обучение установщиков памятников"

document.addEventListener('DOMContentLoaded', function() {
    // FAQ аккордеон
    const faqItems = document.querySelectorAll('.faq__item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq__question');
        
        question.addEventListener('click', function() {
            // Закрываем все другие ответы
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('faq__item--active');
                }
            });
            
            // Переключаем активное состояние текущего элемента
            item.classList.toggle('faq__item--active');
        });
    });
    
    // Открываем первый вопрос по умолчанию
    faqItems[0].classList.add('faq__item--active');
    
    // Плавная прокрутка к якорям
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Фиксированная шапка при прокрутке
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop) {
            // Прокрутка вниз
            header.style.transform = 'translateY(-100%)';
        } else {
            // Прокрутка вверх
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Таймер обратного отсчета до конца регистрации
    const countDownDate = new Date("May 15, 2025 23:59:59").getTime();
    
    // Обновление таймера каждую секунду
    if (document.querySelector('.action__timer')) {
        const timerInterval = setInterval(function() {
            // Получаем текущую дату и время
            const now = new Date().getTime();
            
            // Находим разницу между датами
            const distance = countDownDate - now;
            
            // Вычисляем дни, часы, минуты и секунды
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            // Создаем элемент таймера, если он не существует
            if (!document.getElementById('countdown-timer')) {
                const timerWrapper = document.createElement('div');
                timerWrapper.id = 'countdown-timer';
                timerWrapper.className = 'countdown-timer';
                timerWrapper.innerHTML = `
                    <div class="countdown-timer__title">До окончания приема заявок осталось:</div>
                    <div class="countdown-timer__digits">
                        <div class="countdown-timer__item">
                            <div class="countdown-timer__number" id="countdown-days">${days}</div>
                            <div class="countdown-timer__label">дней</div>
                        </div>
                        <div class="countdown-timer__separator">:</div>
                        <div class="countdown-timer__item">
                            <div class="countdown-timer__number" id="countdown-hours">${hours}</div>
                            <div class="countdown-timer__label">часов</div>
                        </div>
                        <div class="countdown-timer__separator">:</div>
                        <div class="countdown-timer__item">
                            <div class="countdown-timer__number" id="countdown-minutes">${minutes}</div>
                            <div class="countdown-timer__label">минут</div>
                        </div>
                        <div class="countdown-timer__separator">:</div>
                        <div class="countdown-timer__item">
                            <div class="countdown-timer__number" id="countdown-seconds">${seconds}</div>
                            <div class="countdown-timer__label">секунд</div>
                        </div>
                    </div>
                `;
                document.querySelector('.action__timer').appendChild(timerWrapper);
            } else {
                // Обновляем существующий таймер
                document.getElementById('countdown-days').textContent = days;
                document.getElementById('countdown-hours').textContent = hours;
                document.getElementById('countdown-minutes').textContent = minutes;
                document.getElementById('countdown-seconds').textContent = seconds;
            }
            
            // Когда таймер закончится
            if (distance < 0) {
                clearInterval(timerInterval);
                if (document.getElementById('countdown-timer')) {
                    document.getElementById('countdown-timer').innerHTML = "Прием заявок завершен!";
                }
            }
        }, 1000);
    }
    
    // Счетчик оставшихся мест
    // Имитация остатка мест (в реальном проекте должно быть из базы данных)
    let remainingSeats = 7; // Из 10 мест
    
    if (document.querySelector('.action__timer')) {
        // Создаем элемент счетчика мест
        const seatsCounter = document.createElement('div');
        seatsCounter.className = 'seats-counter';
        seatsCounter.innerHTML = `
            <div class="seats-counter__title">Осталось мест:</div>
            <div class="seats-counter__number">${remainingSeats} из 10</div>
            <div class="seats-counter__progress">
                <div class="seats-counter__progress-bar" style="width: ${(remainingSeats/10)*100}%"></div>
            </div>
        `;
        document.querySelector('.action__timer').appendChild(seatsCounter);
    }
    
    // Форма бронирования места
    const reserveButton = document.querySelector('.button--reserve');
    
    if (reserveButton) {
        reserveButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Проверяем, есть ли уже форма на странице
            if (!document.getElementById('reserve-form')) {
                // Создаем модальное окно с формой
                const modalOverlay = document.createElement('div');
                modalOverlay.className = 'modal-overlay';
                modalOverlay.id = 'reserve-modal';
                
                const modalContent = document.createElement('div');
                modalContent.className = 'modal-content';
                
                modalContent.innerHTML = `
                    <div class="modal-header">
                        <h3>Забронировать место на обучение</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <form id="reserve-form" class="reserve-form">
                        <div class="form-group">
                            <label for="name">Ваше имя</label>
                            <input type="text" id="name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="phone">Телефон</label>
                            <input type="tel" id="phone" name="phone" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="city">Город</label>
                            <input type="text" id="city" name="city" required>
                        </div>
                        <div class="form-group">
                            <label>Выберите тариф</label>
                            <div class="radio-group">
                                <label>
                                    <input type="radio" name="tariff" value="basic">
                                    Базовый (5 000 руб.)
                                </label>
                                <label>
                                    <input type="radio" name="tariff" value="extended" checked>
                                    Расширенный (5 000 руб.)
                                </label>
                            </div>
                        </div>
                        <div class="form-group">
                            <button type="submit" class="button">Перейти к оплате 1000 руб.</button>
                        </div>
                        <div class="form-note">
                            * Предоплата 1000 руб. для бронирования места<br>
                            * Остаток суммы оплачивается до начала обучения
                        </div>
                    </form>
                `;
                
                modalOverlay.appendChild(modalContent);
                document.body.appendChild(modalOverlay);
                
                // Закрытие модального окна
                const closeButton = modalOverlay.querySelector('.modal-close');
                closeButton.addEventListener('click', function() {
                    modalOverlay.remove();
                });
                
                // Закрытие по клику вне формы
                modalOverlay.addEventListener('click', function(e) {
                    if (e.target === modalOverlay) {
                        modalOverlay.remove();
                    }
                });
                
                // Обработка отправки формы
                const reserveForm = document.getElementById('reserve-form');
                reserveForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    // Здесь будет обработка формы и переход к оплате
                    alert('Функционал оплаты будет добавлен позже. Ваша заявка принята!');
                    modalOverlay.remove();
                });
            }
        });
    }
});

// Добавляем стили для модального окна через JavaScript
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
    
    .modal-content {
        background-color: #fff;
        border-radius: 8px;
        max-width: 500px;
        width: 100%;
        padding: 30px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        max-height: 90vh;
        overflow-y: auto;
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }
    
    .modal-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #999;
    }
    
    .reserve-form .form-group {
        margin-bottom: 20px;
    }
    
    .reserve-form label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
    }
    
    .reserve-form input[type="text"],
    .reserve-form input[type="tel"],
    .reserve-form input[type="email"] {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
    }
    
    .radio-group {
        display: flex;
        flex-direction: column;
    }
    
    .radio-group label {
        margin-bottom: 10px;
        font-weight: normal;
    }
    
    .form-note {
        font-size: 14px;
        color: #666;
        margin-top: 20px;
    }
    
    .countdown-timer {
        background-color: #fff;
        border-radius: 8px;
        padding: 20px;
        text-align: center;
        color: #333;
        margin-bottom: 20px;
    }
    
    .countdown-timer__title {
        margin-bottom: 15px;
        font-weight: bold;
    }
    
    .countdown-timer__digits {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .countdown-timer__item {
        text-align: center;
        margin: 0 5px;
    }
    
    .countdown-timer__number {
        font-size: 36px;
        font-weight: bold;
        background-color: #095496;
        color: #fff;
        border-radius: 5px;
        padding: 10px 15px;
        min-width: 60px;
    }
    
    .countdown-timer__label {
        font-size: 12px;
        margin-top: 5px;
    }
    
    .countdown-timer__separator {
        font-size: 36px;
        font-weight: bold;
        margin: 0 5px;
    }
    
    .seats-counter {
        background-color: #fff;
        border-radius: 8px;
        padding: 20px;
        text-align: center;
        color: #333;
    }
    
    .seats-counter__title {
        margin-bottom: 10px;
        font-weight: bold;
    }
    
    .seats-counter__number {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 10px;
        color: #095496;
    }
    
    .seats-counter__progress {
        height: 20px;
        background-color: #ddd;
        border-radius: 10px;
        overflow: hidden;
    }
    
    .seats-counter__progress-bar {
        height: 100%;
        background-color: #095496;
    }
`;

document.head.appendChild(modalStyles);