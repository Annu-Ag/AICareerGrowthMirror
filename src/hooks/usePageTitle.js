import { useEffect } from 'react'

const TITLES = {
  '/': 'Career Growth Mirror',
  '/profile': 'Your Profile — Career Growth Mirror',
  '/analysis': 'AI Analysis — Career Growth Mirror',
  '/check-in': 'Weekly Check-in — Career Growth Mirror',
  '/report': 'Growth Report — Career Growth Mirror',
}

export default function usePageTitle(pathname) {
  useEffect(() => {
    document.title = TITLES[pathname] || 'Career Growth Mirror'
  }, [pathname])
}
