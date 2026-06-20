import { useMemo, useRef, useState } from 'react'
import './App.css'

function App() {
  const [photo, setPhoto] = useState<File | null>(null)
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const photoPreview = useMemo(() => {
    if (!photo) return null
    return URL.createObjectURL(photo)
  }, [photo])

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    setPhoto(file)
  }

  const handleDrag = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    if (event.type === 'dragenter' || event.type === 'dragover') {
      setDragActive(true)
    } else if (event.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setDragActive(false)
    const file = event.dataTransfer.files?.[0] ?? null
    if (file) {
      setPhoto(file)
      setSubmitted(false)
    }
  }

  const bmi = useMemo(() => {
    const h = Number(height)
    const w = Number(weight)
    if (!h || !w) return null
    return Number((w / ((h / 100) ** 2)).toFixed(1))
  }, [height, weight])

  const resultLabel = useMemo(() => {
    if (bmi === null) return ''
    if (bmi < 18.5) return '저체중'
    if (bmi < 23) return '정상 체중'
    if (bmi < 25) return '과체중'
    return '비만'
  }, [bmi])

  const resultMessage = useMemo(() => {
    if (bmi === null) return ''
    if (bmi < 18.5) return '약간 더 풍성한 실루엣을 연출하는 스타일이 잘 어울립니다.'
    if (bmi < 23) return '균형 잡힌 체형이므로 다양한 스타일에 도전해보세요.'
    if (bmi < 25) return '선택하는 실루엣을 깔끔하게 정리하는 스타일을 추천합니다.'
    return '편안하면서도 세련된 레이어드 스타일이 잘 어울립니다.'
  }, [bmi])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  const handleReset = () => {
    setSubmitted(false)
  }

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Personal Stylist</p>
          <h1>
            나만의 스타일 분석을<br />
            <strong>시작하세요</strong>
          </h1>
          <p className="lead">
            사진과 키, 몸무게를 입력하면<br />
            <strong>스타일을 추천합니다</strong>
          </p>
        </div>
        <div className="card">
          {!submitted ? (
            <form className="input-form" onSubmit={handleSubmit}>
              <div
                className={`drop-zone ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {photoPreview ? (
                  <img src={photoPreview} alt="Uploaded preview" />
                ) : (
                  <div className="drop-hint">
                    <strong>사진을 드래그하거나 클릭</strong>
                    <span>jpg, png 형식 이미지 가능</span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                hidden
              />
              <div className="field-row">
                <label>
                  키 (cm)
                  <input
                    type="number"
                    min="0"
                    placeholder="170"
                    value={height}
                    onChange={(event) => setHeight(event.target.value)}
                    required
                  />
                </label>
                <label>
                  몸무게 (kg)
                  <input
                    type="number"
                    min="0"
                    placeholder="65"
                    value={weight}
                    onChange={(event) => setWeight(event.target.value)}
                    required
                  />
                </label>
              </div>
              <button type="submit" className="primary-button">
                분석하기
              </button>
            </form>
          ) : (
            <div className="result-screen">
              <div className="result-top">
                <div>
                  <p className="eyebrow">분석 결과</p>
                  <h2>당신에게 어울리는 스타일</h2>
                  <p className="lead">
                    아래 정보는 입력한 키와 몸무게를 기반으로 산출된 빠른 예측 결과입니다.
                  </p>
                </div>
                <button type="button" className="secondary-button" onClick={handleReset}>
                  다시 입력하기
                </button>
              </div>
              <div className="result-grid">
                <div className="result-card result-summary">
                  <p className="summary-label">BMI 지수</p>
                  <strong>{bmi ?? '--'}</strong>
                  <span>{resultLabel}</span>
                </div>
                <div className="result-card result-detail">
                  <p className="summary-label">추천 스타일</p>
                  <p>{resultMessage}</p>
                </div>
              </div>
              <div className="result-card result-advice">
                <p className="summary-label">스타일 팁</p>
                <ul>
                  <li>깔끔한 라인을 강조한 상의로 세련된 느낌을 살리세요.</li>
                  <li>밝은 블루와 네이비 톤으로 시원한 이미지를 더해보세요.</li>
                  <li>레이어드 아이템으로 안정감 있는 실루엣을 완성하세요.</li>
                </ul>
              </div>
              <div className="result-image-preview">
                {photoPreview ? (
                  <img src={photoPreview} alt="Uploaded preview" />
                ) : (
                  <div className="preview placeholder">업로드된 사진이 없습니다</div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default App
