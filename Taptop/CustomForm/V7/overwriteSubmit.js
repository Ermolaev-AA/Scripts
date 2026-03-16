export const overwriteSubmit = (form) => {
    const submit = form.querySelector('button[type="submit"]')
    const submitClass = submit.className
    const text = submit.querySelector('span').querySelector('span').textContent

    const newSubmit = `<button type="submit" class="${submitClass}">
        <span>${text}</span>
    </button>`

    const fieldContainer = form.querySelector(`[field-container]`)
    if (fieldContainer) {
        fieldContainer.insertAdjacentHTML('beforeend', newSubmit)
    } else {
        form.insertAdjacentHTML('beforeend', newSubmit)
    }

    submit.remove()
}