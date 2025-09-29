const sections = [rec793883453, rec792212758] // Массив ID блоков с формой в которых должен проигрываться скрипн на проверку
const waInstance = '1103909234' // Инстанс (id) аккаунта GreenAPI (сервис для проверки WA)
const waToken = '4f4b5cb11cbc4c9d8e51d1155e0ac7dfbcc21ba72b3941a7ae' // Токен аккаунта GreenAPI (сервис для проверки WA)
const redirectTrue = 'https://legkaya.com/?utm_wa=true' // Ссылка редиректа если номер телефона успешно прошел проверку на WA
const redirectFalseOFF = false // отключить/включить (true/false) редирект если номер телефона не прошел проверку на WA
const redirectFalse = 'https://legkaya.com/?utm_wa=false' // Ссылка редиректа если номер телефона НЕ успешно прошел проверку на WA

sections.forEach(section => {
    const form = section.querySelector('form')

    if (form) {
        let checkResult


        if (waInstance && waToken && redirectTrue) {
            checkResult = checkWhatsApp(waInstance, waToken, form);
        }

    }
})

function checkWhatsApp (instance, token, container) {
    let checkFlag = true
    let checkFields = false


    const phone = container.querySelector('[name="phone"]')
    const submit = container.querySelector('[type="submit"]')

    // Debug
    console.log(phone)
    console.log(submit)

    submit.addEventListener('click', (event) => {
        const fields = container.querySelectorAll('input')
        const allFieldsFilled = Array.from(fields).every(field => field.value.trim() !== '');

        // Debug
        console.log(fields)
        console.log(allFieldsFilled)

        if (!allFieldsFilled && !checkFields) {
            alert('Пожалуйста, заполните все поля');
        } else {
            if (checkFlag == true) {
                // Создаем флаг для отслеживания статуса отправки запроса
                let requestSent = false;
    
                // Проверяем, заполнены ли все поля перед отправкой запроса
                if (!requestSent) {
                    // Флаг, указывающий на отправку запроса
                    requestSent = true;
    
                    const phoneNumber = phone.value.replace(/\D/g, '');
                    console.log(phoneNumber)
    
                    fetch(`https://api.green-api.com/waInstance${instance}/checkWhatsapp/${token}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            phoneNumber: phoneNumber
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data)
                        checkFlag = false       
                        redirect(data.existsWhatsapp, container)
                    })
                    .catch(error => {
                        checkFlag = false
                        // filedCheckResult.value = `error: ${error}`
                        checkResult = 'error'
    
                        redirect(checkResult, container)
                        // submit.setAttribute('value', submitTextDefault)
                        // submit.click()
    
                        // console.log('Флаг проверки:', checkFlag)
                    });
                } else {
                    // Если не все обязательные поля заполнены или запрос уже отправлен, ничего не делаем
                    // alert('Пожалуйста, заполните все поля!');
                }
    
                // event.preventDefault();
            } else {
                // submit.click()
            }
            checkFields = true
        }




    })
    
    // console.log('Проверка WA запущена')
}


function redirect(value, container) {
    console.log('value:', value);
    console.log('Редирект запущен!');

    // Проверяем, есть ли уже элемент в DOM
    const checkForSuccessPopup = () => {
        const success = document.querySelector('.t-form-success-popup');
        if (success) {
            console.log('Найден .t-form-success-popup, выполняем редирект');
            
            if (value === true) {
                console.log('Редирект true');
                window.location.href = redirectTrue;
            } else if (value === false) {
                console.log('Редирект false');
                window.location.href = redirectFalse;
            }
            return true; // Элемент найден
        }
        return false; // Элемент не найден
    };

    // Если элемент уже есть, сразу выполняем редирект
    if (checkForSuccessPopup()) {
        return;
    }

    // Если элемента нет, создаем наблюдатель для отслеживания появления
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Проверяем каждый добавленный узел
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Проверяем сам элемент и его потомков
                        if (node.classList && node.classList.contains('t-form-success-popup')) {
                            console.log('Найден .t-form-success-popup в добавленном элементе');
                            observer.disconnect(); // Отключаем наблюдатель
                            checkForSuccessPopup();
                            return;
                        }
                        
                        // Проверяем потомков добавленного элемента
                        const successInChildren = node.querySelector && node.querySelector('.t-form-success-popup');
                        if (successInChildren) {
                            console.log('Найден .t-form-success-popup в потомках добавленного элемента');
                            observer.disconnect(); // Отключаем наблюдатель
                            checkForSuccessPopup();
                            return;
                        }
                    }
                }
            }
        }
    });

    // Наблюдаем за изменениями в document.body
    observer.observe(document.body, { childList: true, subtree: true });
}
