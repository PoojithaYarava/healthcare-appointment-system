import logo from './logo.png'
import hero_img from './hero.png'

const makeSvgDataUri = (svg) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`

const profile_pic = makeSvgDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
    <rect width="120" height="120" rx="24" fill="#e0e7ff"/>
    <circle cx="60" cy="44" r="24" fill="#818cf8"/>
    <path d="M24 104c8-18 24-28 36-28s28 10 36 28" fill="#6366f1"/>
  </svg>
`)

const dropdown_icon = makeSvgDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none">
    <path d="M5 7.5 10 12.5 15 7.5" stroke="#4b5563" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`)

const verified_icon = makeSvgDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" fill="#2563eb"/>
    <path d="m8 12 2.5 2.5L16.5 9" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`)

const info_icon = makeSvgDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" fill="#e5e7eb"/>
    <path d="M12 10v6" stroke="#374151" stroke-width="2" stroke-linecap="round"/>
    <circle cx="12" cy="7" r="1.2" fill="#374151"/>
  </svg>
`)

const upload_icon = makeSvgDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="12" fill="#4f46e5"/>
    <path d="M12 16V8m0 0-3 3m3-3 3 3" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`)

export const assets = {
    logo,
    hero_img,
    profile_pic,
    dropdown_icon,
    verified_icon,
    info_icon,
    upload_icon,
}
