const getParam = param => {
    const queryString = url.split('?')[1]; // часть после ?
    if (!queryString) return null;

    const params = queryString.split('&'); // массив ['utm_contractor=Ermolaev', ...]
    
    for (let p of params) {
        const [key, value] = p.split('=');
        if (key === param) {
            return decodeURIComponent(value || ''); // декодируем %D0%9E%D1%80%D1%91%D0%BB → "Орёл"
        }
    }
    return null; // если не найдено
}

const getCookie = name => {
    const cookies = cookie.split('; ');
    for (let c of cookies) {
        const [key, value] = c.split('=');
        if (key === name) {
            return decodeURIComponent(value || '');
        }
    }
    return null; // если не найдено
}

const normalizeBoolean = (value) => {
  if (value == 1 || value == true || value == '1' || value == 'true') {
    return 'true'
  } else {
    return 'false'
  }
}

const utm_source = getParam('utm_source')
const utm_campaign = getParam('utm_campaign')
const utm_medium = getParam('utm_medium')
const utm_content = getParam('utm_content')
const utm_term = getParam('utm_term')
const utm_contractor = getParam('utm_contractor')
const utm_region_id = getParam('utm_region_id')
const utm_region_name = getParam('utm_region_name')
const utm_source_type = getParam('utm_source_type')
const utm_group_id = getParam('utm_group_id')
const utm_device_type = getParam('utm_device_type')
const utm_creative_id = getParam('utm_creative_id')
const yclid = getParam('yclid')

const _ym_uid = getCookie('_ym_uid')
const _ym_d = getCookie('_ym_d')

const is_fraud = normalizeBoolean(org_is_fraud)
const is_global_duplicate = normalizeBoolean(org_is_global_duplicate)
const is_local_duplicate = normalizeBoolean(org_is_local_duplicate)
// const captcha_enabled = normalizeBoolean(org_captcha_enabled)
// const captcha_success = normalizeBoolean(org_captcha_success)
// const captcha_failed = normalizeBoolean(org_captcha_failed)

const phone_no_spaces = phone.replace(/\s+/g, ''); // "+74599549549"
const phone_for_crm = phone_no_spaces;             // "+74599549549"
const phone_for_sheets = phone_no_spaces.replace('+', ''); // "74599549549"

let heading = org_heading

if (url.includes('msk-frunzenskaya')) { // msk-frunzenskaya
  	// heading = 'Клиент интересовался делюкс проектами в центре Москвы'
}