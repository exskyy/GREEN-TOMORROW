let trees = 5;

function updateCalculator() {
    document.getElementById("treeCount").textContent = trees;
    document.getElementById("co2").textContent = trees * 25;
    document.getElementById("oxygen").textContent = Math.round(trees * 2.5);
}

function increase() {
    trees++;
    updateCalculator();
}

function decrease() {
    if (trees > 1) {
        trees--;
        updateCalculator();
    }
}

// =================== СЕКЦИЯ УГРОЗЫ ===================
// Данные для каждой угрозы
const threatsData = {
    deforestation: {
        title: "Вырубка лесов",
        text: "Каждую минуту на Земле исчезает лес размером с 30 футбольных полей. С 1990 года мы потеряли 420 миллионов гектаров леса — это площадь больше, чем вся Индия. Основные причины: сельское хозяйство (80% вырубки Амазонии), незаконные лесозаготовки и расширение городов. Если темпы сохранятся, к 2050 году тропические леса исчезнут полностью."
    },
    co2: {
        title: "Выбросы углекислого газа",
        text: "Концентрация CO₂ в атмосфере достигла 420 ppm — самого высокого уровня за 3 миллиона лет. Основные источники: сжигание ископаемого топлива (энергетика, транспорт, промышленность) и вырубка лесов, которые перестают поглощать углерод. Леса планеты поглощают 30% всех выбросов CO₂, но с каждым потерянным гектаром эта способность снижается."
    },
    climate: {
        title: "Изменение климата",
        text: "Средняя температура на планете уже выросла на 1,2°C по сравнению с доиндустриальной эпохой. Последствия: участившиеся лесные пожары (в 2023 году сгорело 18 млн га леса в Канаде), наводнения, засухи и таяние ледников. Даже при оптимистичном сценарии к 2100 году температура вырастет на 1,5–2°C, что приведёт к исчезновению 70% коралловых рифов."
    }
};
//====================== тексты в угрозах =================
// Общий текст по умолчанию
const defaultThreat = {
    title: "Общая климатическая ситуация",
    text: "Планета нагревается быстрее, чем за последние 2000 лет. 2023 год стал самым тёплым за всю историю наблюдений. Леса, которые поглощают 30% выбросов CO₂, исчезают с катастрофической скоростью. Без немедленных действий к 2050 году температура может вырасти на 2-3°C, что приведёт к необратимым последствиям. Но у нас есть решение — восстановление лесов может поглотить до 30% всех выбросов углекислого газа."
};

// Получаем элементы
const threatBtns = document.querySelectorAll('.threats__btn');
const infoTitle = document.querySelector('.threats__info-title');
const infoText = document.querySelector('.threats__info-text');

// Функция обновления информации
function updateThreatInfo(threatId) {
    let data;
    
    if (threatId === 'default') {
        data = defaultThreat;
    } else {
        data = threatsData[threatId];
    }
    
    // Анимация исчезновения
    infoText.style.opacity = '0';
    infoText.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
        infoTitle.textContent = data.title;
        infoText.textContent = data.text;
        
        // Анимация появления
        infoText.style.transition = 'all 0.3s ease';
        infoText.style.opacity = '1';
        infoText.style.transform = 'translateY(0)';
    }, 150);
}

// Обработчики для кнопок
threatBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Убираем активный класс у всех кнопок
        threatBtns.forEach(b => b.classList.remove('threats__btn--active'));
        // Добавляем активный класс нажатой кнопке
        btn.classList.add('threats__btn--active');
        
        // Получаем id угрозы
        const threatId = btn.getAttribute('data-threat');
        // Обновляем информацию
        updateThreatInfo(threatId);
    });
});

// =================== ПЛАВНАЯ ПРОКРУТКА К БЛОКАМ ===================
// Функция плавного скролла
function smoothScroll(targetElement, duration = 800) {
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// Получаем все ссылки навигации
const navLinks = document.querySelectorAll('.header-nav__menu a, .footer__nav a');
const donateButtons = document.querySelectorAll('.header-nav__menu--item-donate, .main-hero__container-text--btn_donate, .howtohelp__cards-item--btn');

// Функция получения секции по тексту ссылки
function getTargetSection(linkText) {
    const text = linkText.toLowerCase();
    if (text.includes('посадить') || text.includes('дерево') || text.includes('🌲')) return document.querySelector('#donate, .main-hero');
    if (text.includes('проект') || text.includes('о нас')) return document.querySelector('.about');
    if (text.includes('угроз') || text.includes('важно')) return document.querySelector('.threats');
    if (text.includes('помочь')) return document.querySelector('.howtohelp');
    if (text.includes('контакт')) return document.querySelector('.footer');
    return null;
}

// Добавляем обработчики для навигационных ссылок
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        // Если ссылка якорная или пустая
        if (href === '#' || href === '' || href === '#donate') {
            e.preventDefault();
            const sectionName = link.textContent;
            const targetSection = getTargetSection(sectionName);
            
            if (targetSection) {
                smoothScroll(targetSection, 700);
            } else if (sectionName.includes('О проекте')) {
                smoothScroll(document.querySelector('.about'), 700);
            } else if (sectionName.includes('Угрозы')) {
                smoothScroll(document.querySelector('.threats'), 700);
            } else if (sectionName.includes('Как помочь')) {
                smoothScroll(document.querySelector('.howtohelp'), 700);
            } else if (sectionName.includes('Контакты')) {
                smoothScroll(document.querySelector('.footer'), 700);
            }
        }
    });
});

// Для кнопок "Посадить дерево" во всем сайте
donateButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const heroSection = document.querySelector('.main-hero');
        if (heroSection) {
            smoothScroll(heroSection, 700);
        }
    });
});

// Для кнопки "Узнать больше"
const infoBtn = document.querySelector('.main-hero__container-text--btn_info');
if (infoBtn) {
    infoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const aboutSection = document.querySelector('.about');
        if (aboutSection) {
            smoothScroll(aboutSection, 700);
        }
    });
}

// Для кнопок "Поделиться", "Стать партнёром" и т.д. (оставляем их поведение, но убираем переход наверх)
const allActionBtns = document.querySelectorAll('.howtohelp__cards-item--btn');
allActionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const btnText = btn.textContent;
        if (btnText.includes('Посадить')) {
            e.preventDefault();
            smoothScroll(document.querySelector('.main-hero'), 700);
        } else if (btnText.includes('Записаться')) {
            e.preventDefault();
            alert('📝 Спасибо за интерес! Скоро свяжемся с вами для записи в волонтёры.');
        } else if (btnText.includes('Поделиться')) {
            e.preventDefault();
            alert('📢 Спасибо! Поделитесь проектом в соцсетях: скопируйте ссылку на сайт.');
        } else if (btnText.includes('партнёром')) {
            e.preventDefault();
            alert('🏢 Спасибо! Напишите нам на partners@greenfuture.ru для сотрудничества.');
        }
    });
});