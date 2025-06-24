'use client'

import { useEffect } from 'react'

export default function ViewportFix() {
  useEffect(() => {
    // 모바일 브라우저에서 viewport 높이 문제 해결
    const setVH = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }

    // 초기 설정
    setVH()

    // 리사이즈 시 재계산
    window.addEventListener('resize', setVH)
    window.addEventListener('orientationchange', setVH)

    // 스크롤 시에도 높이 유지 (iOS Safari 대응)
    let timeoutId: NodeJS.Timeout
    const handleScroll = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(setVH, 100)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('resize', setVH)
      window.removeEventListener('orientationchange', setVH)
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(timeoutId)
    }
  }, [])

  return null
} 