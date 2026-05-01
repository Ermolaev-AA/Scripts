// console.log('hellow world')

let BaseCollection = []
const collections = document.querySelectorAll('[collection]')

collections.forEach(collection => {
    const collectionName = collection.getAttribute('collection')
    const collectionObj = { name: collectionName, items: [] }

    const items = collection.querySelectorAll('[item]')
    items.forEach(item => {
        const itemId = item.getAttribute('data-tt-collection-item-id')
        const values = item.querySelectorAll('[value]')
        const itemData = { id: itemId }

        values.forEach(valueContainer => {
            const paramName = valueContainer.getAttribute('value')
            if (!paramName) return

            const span = valueContainer.querySelector('span')
            const img = valueContainer.querySelector('img')

            let paramValue = null

            if (span) {
                paramValue = span.textContent.trim()
            } else if (img) {
                paramValue = img.src
            }

            itemData[paramName] = paramValue
        })

        collectionObj.items.push(itemData)
    })

    BaseCollection.push(collectionObj)
})

console.log('BaseCollection:', BaseCollection)