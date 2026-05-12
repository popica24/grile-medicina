import { useEffect, useState, useRef } from 'react'

// Hook: count-up daca initialSeconds=null, count-down altfel
export function useTimer(initialSeconds, isRunning, onExpire) {
  const isCountdown = initialSeconds != null
  const [seconds, setSeconds] = useState(isCountdown ? initialSeconds : 0)
  const expiredRef = useRef(false)

  useEffect(() => {
    if (!isRunning) return
    const id = setInterval(() => {
      setSeconds((s) => {
        if (isCountdown) {
          const next = s - 1
          if (next <= 0 && !expiredRef.current) {
            expiredRef.current = true
            onExpire?.()
            return 0
          }
          return next
        }
        return s + 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [isRunning, isCountdown, onExpire])

  return seconds
}

export function TimerDisplay({ seconds, isCountdown, totalSeconds }) {
  const abs = Math.max(0, seconds)
  const mins = Math.floor(abs / 60)
  const secs = abs % 60
  const display = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`

  let cls = 'timer'
  if (isCountdown && totalSeconds) {
    const ratio = seconds / totalSeconds
    if (ratio <= 0.1) cls = 'timer danger'
    else if (ratio <= 0.25) cls = 'timer warning'
  }

  return <div className={cls}>{display}</div>
}
