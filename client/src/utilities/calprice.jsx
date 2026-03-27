const SIZE_PRICES    = { 'Small': 0, 'Medium': 8, 'Large': 15 }
const MATERIAL_PRICES = { 'Plastic': 0, 'Glass': 10, 'Aluminum': 14, 'Stainless Steel': 22 }
const CAP_PRICES      = { 'Screw-top': 0, 'Flip-top': 4, 'Straw': 6, 'Sport Cap': 8 }

const BASE_PRICE = 12

export const calcPrice = ({ size, material, cap_type }) => {
    const s = SIZE_PRICES[size]     ?? 0
    const m = MATERIAL_PRICES[material] ?? 0
    const c = CAP_PRICES[cap_type]  ?? 0
    return (BASE_PRICE + s + m + c).toFixed(2)
}