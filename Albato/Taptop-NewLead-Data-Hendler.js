// === IMPORT DATA ========================= //
// url (String) = 'https://realty-msk.site/ads/msk-rassrochka-ac-1-lan-05?utm_contractor=Ermolaev&utm_source=ru.yandex.ytaxi&utm_medium=type1&utm_campaign=117803272&utm_content=16815741583&utm_term=---autotargeting&utm_region_id=10716&utm_region_name=Balashiha&utm_source_type=context&utm_group_id=5536919735&utm_device_type=mobile&utm_creative_id=0&yclid=3387118181120475135'
// phone (String) = '+7 999 999 99 99'
// cookie (String) = 'code_verifier=NZmjZxUjVjiNzT5TQTUNNQMmjFZ3Ym3ZZ2WylhihIYN; lang_id=1; _ym_uid=1754312354250842767; _ym_d=1754312354; _ga=GA1.1.199498992.1751881784; carrotquest_device_guid=f5f534f0-61a8-4778-a2b9-2e1f823244a8; carrotquest_realtime_services_transport=wss; carrotquest_uid=2021439957582741872; carrotquest_auth_token=user.2021439957582741872.66794-1d0da327a6a11d483d05472155.d1e36c0c43e9a1586fd479abea21fdfdf35bc2b3fad794a0; carrotquest_realtime_services_key=; _ym_isad=1; _ga_R1P116XS2L=GS2.1.s1754828551$o2$g1$t1754829149$j60$l0$h643548602; carrotquest_hide_all_unread_popups=true; referer=ru.yandex.ytaxi%20type1%20---autotargeting%2016815741583; referer_uri=%2Fads%2Fmsk-rassrochka-ac-1-lan-05%3Futm_contractor%3DErmolaev%26utm_source%3Dru.yandex.ytaxi%26utm_medium%3Dtype1%26utm_campaign%3D117803272%26utm_content%3D16815741583%26utm_term%3D---autotargeting%26utm_region_id%3D10716%26utm_region_name%3DBalashiha%26utm_source_type%3Dcontext%26utm_group_id%3D5536919735%26utm_device_type%3Dmobile%26utm_creative_id%3D0%26yclid%3D3387118181120475135; referer_type=banners; _ym_visorc=w; carrotquest_session=cdua36mcxdastjop5ldl1wk20e13v8c0; carrotquest_session_started=1; referer_time=1754835891'
// orgHeading (String) = 'Премиум квартиры в ЦАО. Платеж до 100 000 ₽ в месяц'
// ========================================= //

// === EXAMPLE DATA ======================== //
const url = 'https://realty-msk.site/ads/msk-rassrochka-ac-1-lan-05?utm_contractor=Ermolaev&utm_source=ru.yandex.ytaxi&utm_medium=type1&utm_campaign=117803272&utm_content=16815741583&utm_term=---autotargeting&utm_region_id=10716&utm_region_name=Balashiha&utm_source_type=context&utm_group_id=5536919735&utm_device_type=mobile&utm_creative_id=0&yclid=3387118181120475135'
const phone = '+7 999 999 99 99'
const cookie = 'code_verifier=NZmjZxUjVjiNzT5TQTUNNQMmjFZ3Ym3ZZ2WylhihIYN; lang_id=1; _ym_uid=1754312354250842767; _ym_d=1754312354; _ga=GA1.1.199498992.1751881784; carrotquest_device_guid=f5f534f0-61a8-4778-a2b9-2e1f823244a8; carrotquest_realtime_services_transport=wss; carrotquest_uid=2021439957582741872; carrotquest_auth_token=user.2021439957582741872.66794-1d0da327a6a11d483d05472155.d1e36c0c43e9a1586fd479abea21fdfdf35bc2b3fad794a0; carrotquest_realtime_services_key=; _ym_isad=1; _ga_R1P116XS2L=GS2.1.s1754828551$o2$g1$t1754829149$j60$l0$h643548602; carrotquest_hide_all_unread_popups=true; referer=ru.yandex.ytaxi%20type1%20---autotargeting%2016815741583; referer_uri=%2Fads%2Fmsk-rassrochka-ac-1-lan-05%3Futm_contractor%3DErmolaev%26utm_source%3Dru.yandex.ytaxi%26utm_medium%3Dtype1%26utm_campaign%3D117803272%26utm_content%3D16815741583%26utm_term%3D---autotargeting%26utm_region_id%3D10716%26utm_region_name%3DBalashiha%26utm_source_type%3Dcontext%26utm_group_id%3D5536919735%26utm_device_type%3Dmobile%26utm_creative_id%3D0%26yclid%3D3387118181120475135; referer_type=banners; _ym_visorc=w; carrotquest_session=cdua36mcxdastjop5ldl1wk20e13v8c0; carrotquest_session_started=1; referer_time=1754835891'
const orgHeading = 'Премиум квартиры в ЦАО. Платеж до 100 000 ₽ в месяц'
// ========================================= //

// === COPY IT TO ALBATO =================== //
const parseParam = param => {
    const queryString = url.split('?')[1] // часть после ?
    if (!queryString) return null

    const params = queryString.split('&') // массив ['utm_contractor=Ermolaev', ...]
    
    for (let p of params) {
        const [key, value] = p.split('=')
        if (key === param) {
            return decodeURIComponent(value || '') // декодируем %D0%9E%D1%80%D1%91%D0%BB → "Орёл"
        }
    }
    return null // если не найдено
}

const parseCookie = name => {
    const cookies = cookie.split('; ')
    for (let c of cookies) {
        const [key, value] = c.split('=')
        if (key === name) {
            return decodeURIComponent(value || '')
        }
    }
    return null // если не найдено
}

const utm_source = parseParam('utm_source')
const utm_campaign = parseParam('utm_campaign')
const utm_medium = parseParam('utm_medium')
const utm_content = parseParam('utm_content')
const utm_term = parseParam('utm_term')
const utm_contractor = parseParam('utm_contractor')
const utm_region_id = parseParam('utm_region_id')
const utm_region_name = parseParam('utm_region_name')
const utm_source_type = parseParam('utm_source_type')
const utm_group_id = parseParam('utm_group_id')
const utm_device_type = parseParam('utm_device_type')
const utm_creative_id = parseParam('utm_creative_id')
const yclid = parseParam('yclid')

const _ym_uid = parseCookie('_ym_uid')
const _ym_d = parseCookie('_ym_d')

const phone_no_spaces = phone.replace(/\s+/g, '') // "+74599549549"
const phone_for_crm = phone_no_spaces // "+74599549549"
const phone_for_sheets = phone_no_spaces.replace('+', '') // "74599549549"

let heading = orgHeading

if (url.includes('ads')) { // msk-frunzenskaya
  	// heading = 'Клиент интересовался делюкс проектами в центре Москвы'
}

// ========================================= //

// === DEBUG SCRIPT ======================== //
console.log('heading →', heading)
console.log('phone_for_crm →', phone_for_crm)
console.log('phone_for_sheets →', phone_for_sheets)
console.log('utm_source →', utm_source)
console.log('utm_campaign →', utm_campaign)
console.log('utm_medium →', utm_medium)
console.log('utm_content →', utm_content)
console.log('utm_term →', utm_term)
console.log('utm_contractor →', utm_contractor)
console.log('utm_region_id →', utm_region_id)
console.log('utm_region_name →', utm_region_name)
console.log('utm_source_type →', utm_source_type)
console.log('utm_group_id →', utm_group_id)
console.log('utm_device_type →', utm_device_type)
console.log('utm_creative_id →', utm_creative_id)
console.log('yclid →', yclid)
console.log('_ym_uid →', _ym_uid)
console.log('_ym_d →', _ym_d)
// ========================================= //

// === EXPORT DATA ========================= //
// heading (String) = 'Премиум квартиры в ЦАО. Платеж до 100 000 ₽ в месяц'
// phone_for_crm (String) = '+79999999999'
// phone_for_sheets (String) = '79999999999'
// utm_source (String) = 'ru.yandex.ytaxi'
// utm_campaign (String) = '117803272'
// utm_medium (String) = 'type1'
// utm_content (String) = '16815741583'
// utm_term (String) = '---autotargeting'
// utm_contractor (String) = 'Ermolaev'
// utm_region_id (String) = '10716'
// utm_region_name (String) = 'Balashiha'
// utm_source_type (String) = 'context'
// utm_group_id (String) = '5536919735'
// utm_device_type (String) = 'mobile'
// utm_creative_id (String) = '0'
// yclid (String) = '3387118181120475135'
// _ym_uid (String) = '1754312354250842767'
// _ym_d (String) = '1754312354'
// ========================================= //