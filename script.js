// Ждем, когда DOM полностью загрузится
document.addEventListener('DOMContentLoaded', function() {
    // Функция для плавной прокрутки при клике на ссылки содержания
    const smoothScroll = function(target, duration) {
        const targetElement = document.querySelector(target);
        if (!targetElement) return;
        
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const scrollY = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, scrollY);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }

        // Функция плавности прокрутки
        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    };

    // Применяем плавную прокрутку ко всем ссылкам в содержании
    document.querySelectorAll('.table-of-contents a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            smoothScroll(targetId, 800);
            
            // Добавляем подсветку целевого заголовка
            setTimeout(() => {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.classList.add('highlight');
                    setTimeout(() => {
                        targetElement.classList.remove('highlight');
                    }, 2000);
                }
            }, 800);
        });
    });
    
    // Интерактивные чек-листы
    const createChecklist = function(listId, storageKey) {
        const list = document.getElementById(listId);
        if (!list) return;
        
        // Преобразуем обычный список в интерактивный чек-лист
        const items = list.querySelectorAll('li');
        const savedChecks = JSON.parse(localStorage.getItem(storageKey) || '[]');
        
        items.forEach((item, index) => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `${listId}-item-${index}`;
            checkbox.className = 'checklist-item';
            
            // Восстанавливаем состояние из localStorage
            if (savedChecks.includes(index)) {
                checkbox.checked = true;
                item.classList.add('checked-item');
            }
            
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    item.classList.add('checked-item');
                    // Сохраняем отмеченные пункты
                    const currentSaved = JSON.parse(localStorage.getItem(storageKey) || '[]');
                    if (!currentSaved.includes(index)) {
                        currentSaved.push(index);
                        localStorage.setItem(storageKey, JSON.stringify(currentSaved));
                    }
                } else {
                    item.classList.remove('checked-item');
                    // Удаляем из сохраненных
                    const currentSaved = JSON.parse(localStorage.getItem(storageKey) || '[]');
                    const newSaved = currentSaved.filter(i => i !== index);
                    localStorage.setItem(storageKey, JSON.stringify(newSaved));
                }
            });
            
            // Вставляем чекбокс перед текстом
            item.insertBefore(checkbox, item.firstChild);
        });
    };
    
    // Инициализируем интерактивные элементы
    window.setTimeout(() => {
        // Создаем интерактивные чек-листы
        if (document.getElementById('red-flags-list')) {
            createChecklist('red-flags-list', 'red-flags-checked');
        }
        
        if (document.getElementById('green-signals-list')) {
            createChecklist('green-signals-list', 'green-signals-checked');
        }
        
        // Добавляем интерактивные элементы к цитатам и примерам
        document.querySelectorAll('.perspective').forEach(block => {
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'toggle-btn';
            toggleBtn.innerHTML = 'Показать больше';
            toggleBtn.setAttribute('aria-expanded', 'false');
            
            const content = block.querySelector('p');
            if (!content) return;
            
            content.classList.add('collapsible');
            
            if (content.offsetHeight > 80) {
                content.style.maxHeight = '80px';
                content.style.overflow = 'hidden';
                
                toggleBtn.addEventListener('click', function() {
                    if (this.getAttribute('aria-expanded') === 'false') {
                        content.style.maxHeight = content.scrollHeight + 'px';
                        this.innerHTML = 'Свернуть';
                        this.setAttribute('aria-expanded', 'true');
                    } else {
                        content.style.maxHeight = '80px';
                        this.innerHTML = 'Показать больше';
                        this.setAttribute('aria-expanded', 'false');
                    }
                });
                
                block.appendChild(toggleBtn);
            }
        });
        
        // Добавляем print-friendly версию
        const printBtn = document.createElement('button');
        printBtn.className = 'print-button';
        printBtn.innerHTML = '<span class="print-icon">🖨️</span> Версия для печати';
        
        printBtn.addEventListener('click', function() {
            window.print();
        });
        
        const headerContainer = document.querySelector('.header .container');
        if (headerContainer) {
            headerContainer.appendChild(printBtn);
        }
        
        // Обработка события печати
        window.addEventListener('beforeprint', function() {
            // Раскрываем все свернутые элементы перед печатью
            document.querySelectorAll('.collapsible').forEach(el => {
                el.style.maxHeight = 'none';
                el.style.overflow = 'visible';
            });
        });
    }, 500);
});