import { useState, useCallback } from 'react'
import { QuestionCard } from './QuestionCard'
import { useTimer, TimerDisplay } from './Timer'
import { getBookmarks, toggleBookmark } from '../storage'

export function SessionScreen({ session, onFinish, onExit }) {
  const { questions, mode, timerSeconds, label } = session
  const [answers, setAnswers] = useState({}) // { questionId: [indices] }
  const [checkedSet, setCheckedSet] = useState(new Set()) // grile verificate in study mode
  const [finished, setFinished] = useState(false)
  const [bookmarks, setBookmarks] = useState(getBookmarks())

  const handleExpire = useCallback(() => {
    if (!finished) {
      setFinished(true)
      onFinish(answers)
    }
  }, [finished, answers, onFinish])

  const elapsed = useTimer(timerSeconds, !finished, handleExpire)

  function toggleOption(qid, optionIndex) {
    setAnswers((prev) => {
      const current = prev[qid] || []
      const next = current.includes(optionIndex)
        ? current.filter((i) => i !== optionIndex)
        : [...current, optionIndex]
      return { ...prev, [qid]: next }
    })
  }

  function handleCheck(qid) {
    setCheckedSet((prev) => {
      const next = new Set(prev)
      next.add(qid)
      return next
    })
  }

  function handleBookmark(qid) {
    setBookmarks(toggleBookmark(qid))
  }

  function handleFinish() {
    setFinished(true)
    onFinish(answers)
  }

  const answeredCount = Object.values(answers).filter((a) => a.length > 0).length
  const checkedCount = checkedSet.size

  return (
    <>
      <div className="session-header">
        <button className="back" onClick={onExit}>
          ← Renunță
        </button>
        <div className="progress">
          {label && <strong>{label} · </strong>}
          {mode === 'study'
            ? `${checkedCount} / ${questions.length} verificate`
            : `${answeredCount} / ${questions.length} grile cu răspunsuri`}
        </div>
        {timerSeconds != null ? (
          <TimerDisplay seconds={elapsed} isCountdown={true} totalSeconds={timerSeconds} />
        ) : (
          <TimerDisplay seconds={elapsed} isCountdown={false} />
        )}
      </div>

      {questions.map((q, i) => (
        <QuestionCard
          key={q.id}
          question={q}
          index={i}
          selected={answers[q.id] || []}
          onToggle={(idx) => toggleOption(q.id, idx)}
          mode={mode}
          revealed={finished}
          checked={checkedSet.has(q.id)}
          onCheck={() => handleCheck(q.id)}
          bookmarked={bookmarks.has(q.id)}
          onToggleBookmark={() => handleBookmark(q.id)}
        />
      ))}

      {!finished && (
        <div className="start-bar">
          <div className="summary">
            <strong>
              {answeredCount} / {questions.length}
            </strong>{' '}
            grile completate
          </div>
          <button className="btn btn-primary btn-lg" onClick={handleFinish}>
            Finalizează →
          </button>
        </div>
      )}
    </>
  )
}
