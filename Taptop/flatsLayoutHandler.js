const layouts = document.querySelectorAll('[layout]')
const buttons = document.querySelectorAll('[button-layout]')
const swipersByLayout = new Map()

/** Tilda и др. часто задают display сильнее, чем [hidden] — скрываем через inline !important */
function hideLayoutEl(el) {
    el.style.setProperty('display', 'none', 'important')
    el.setAttribute('aria-hidden', 'true')
}

function showLayoutEl(el) {
    el.style.removeProperty('display')
    el.removeAttribute('aria-hidden')
}

layouts.forEach((layout) => hideLayoutEl(layout))

function addSwiper(layout) {
    const index = layout.getAttribute('layout')
    const collection = layout.querySelector('.swiper-layout')
    const navNext = layout.querySelector('[navigation="next"]')
    const navPrev = layout.querySelector('[navigation="prev"]')
    const pagination = layout.querySelector('[pagination="fraction"]')

    navNext.setAttribute(`layout${index}-navigation`, 'next')
    navPrev.setAttribute(`layout${index}-navigation`, 'prev')
    pagination.setAttribute(`layout${index}-pagination`, 'fraction')

    return new Swiper(collection, {
        slidesPerView: 2,
        spaceBetween: -268,
        centeredSlides: true,
        speed: 600,
        watchSlidesProgress: true,
        resistanceRatio: 0.85,
        navigation: {
            nextEl: `[layout${index}-navigation="next"]`,
            prevEl: `[layout${index}-navigation="prev"]`,
        },
        pagination: {
            el: `[layout${index}-pagination="fraction"]`,
            type: 'fraction',

            renderFraction: (currentClass, totalClass) => {
                return `<span class="${currentClass}" style="padding-right: 10px;"></span> / <span class="${totalClass}" style="padding-left: 10px;"></span>`
            },
        },

        on: {
            setTranslate(sw) {
                sw.slides.forEach((slide) => {
                    const p = Math.abs(slide.progress) // 0 = активный, 1 = соседний, 2 = через один и т.д.
                    const t = Math.min(p, 2) // Ограничим влияние до 2 "шагов"
                    const opacity = Math.max(0, 1 - t * 0.8) // Прозрачность: 1 -> 0.5 -> 0
                    const scale = 1 - t * 0.45 // Масштаб: 1 -> 0.9 -> 0.8
                    const clip = Math.min(24, t * 12) // "Скрыть часть" через clip-path (0% -> 12% -> 24%)
                    slide.style.opacity = opacity.toFixed(3)
                    slide.style.transform = `scale(${scale.toFixed(3)})`
                    slide.style.clipPath = `inset(0 ${clip}% 0 ${clip}%)`
                    slide.style.transition = 'opacity 300ms, transform 300ms, clip-path 300ms'
                })
            },
        },
    })
}

function showLayout(activeIndex) {
    layouts.forEach((layout) => {
        const match = layout.getAttribute('layout') === activeIndex
        if (match) showLayoutEl(layout)
        else hideLayoutEl(layout)
    })

    buttons.forEach((btn) => {
        const match = btn.getAttribute('button-layout') === activeIndex
        if (match) btn.setAttribute('active', '')
        else btn.removeAttribute('active')
    })

    const sw = swipersByLayout.get(activeIndex)
    if (sw) requestAnimationFrame(() => sw.update())
}

layouts.forEach((layout) => {
    const index = layout.getAttribute('layout')
    swipersByLayout.set(index, addSwiper(layout))
})

buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
        const id = btn.getAttribute('button-layout')
        if (id != null) showLayout(id)
    })
})

const initialBtn = document.querySelector('[button-layout][active]') ?? buttons[0]
const initialIndex = initialBtn?.getAttribute('button-layout')
if (initialIndex != null) showLayout(initialIndex)
