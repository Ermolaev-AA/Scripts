export const getMask = (form) => {
    const inputPhone = form.querySelector('[name="phone"]')
    if (!inputPhone) return

    inputPhone.setAttribute('placeholder', '+7 999 999 99 99')

    const phoneValue = IMask(inputPhone, {
        mask: '+{7} 000 000 00 00',
        lazy: true,
        placeholderChar: ''
    })

    inputPhone.addEventListener('blur', function () {
        if (phoneValue.unmaskedValue.length < 11) {
            phoneValue.value = ''
        }
    })
}