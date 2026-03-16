const select = 'cian' // DEV
const tagsArr = [
    {
        // Трафик с Авито
        name: 'ЮНОНА',
        value: ['Авито', 'авито', 'avito'],
        id: 434
    },
    {
        // Трафик с Циана
        name: 'САТУРН',
        value: ['Циан', 'циан', 'cian'],
        id: 436
    },
    {
        // Трафик с Дом Клика
        name: 'ЦЕРЕРА',
        value: ['Дом Клик', 'дом клик', 'domclick'],
        id: 648
    },
    {
        // Трафик ???? с инсы?? в каком виде?
        name: 'ЦИЦЕРОН',
        value: ['Запретграм', 'Инстаграм', 'Инст', 'instagram', 'inst'],
        id: 894
    },
    {
        // Трафик с Email рассылки от Маши
        name: 'ТЕМПУС',
        value: ['Email', 'email', 'Email Рассылка', 'email рассылка'],
        id: 886
    },
    {
        // Трафик от Ермолаева (меня) из Яндекс Директа
        name: 'ПОМПЕЙ',
        value: ['direct', 'ynadex direct', 'ydirect', 'yads'],
        id: 692
    },
    {
        // Трафик ????
        name: 'ЦИТРУС',
        value: ['сitrus'],
        id: 692
    },
]

const tagObj = tagsArr.find(item => item.value.includes(select))
const tag = tagObj.name
const tagId = tagObj.id

console.log(tag) // DEV
console.log(tagId) // DEV


// if (payment) {
//     msg = msg + `
// ` + `🫰 Способ пакупки — <b>${payment}</b>`
// }

// if (budget) {
//     msg = msg + `
// ` + `💰 Бюджет — <b>${budget}</b>`
// }

// if (comments) {
//     msg = msg + `
// ` + `💬 Комментарий — <b>${comments}</b>`
// }