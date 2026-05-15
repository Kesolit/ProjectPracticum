export type SanitizeMultilineOptions = {
  /** Общий лимит длины строки (UTF-16) */
  maxLength?: number
  /** Не больше столько переводов строк в тексте (защита от «простыней» из Enter) */
  maxTotalNewlines?: number
  /**
   * Подряд идущих переводов строк не больше этого числа (2 = максимум одна пустая строка между абзацами).
   * Схлопывает \n\n\n+ в \n\n
   */
  maxConsecutiveNewlines?: number
}

/**
 * Нормализует переносы (\r\n → \n), ограничивает «простыни» пустых строк и длину.
 * Одиночные переносы строк сохраняются для отображения через white-space: pre-line.
 */
export function sanitizeMultilineText(
  raw: string,
  opts: SanitizeMultilineOptions = {}
): string {
  const maxLength = opts.maxLength ?? 8000
  const maxTotalNewlines = opts.maxTotalNewlines ?? 80
  const maxRun = Math.max(2, opts.maxConsecutiveNewlines ?? 2)

  let s = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  const runPattern = new RegExp(`\\n{${maxRun + 1},}`, 'g')
  s = s.replace(runPattern, '\n'.repeat(maxRun))

  let lines = 0
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '\n') lines++
  }
  if (lines > maxTotalNewlines) {
    let cut = s.length
    let seen = 0
    for (let i = 0; i < s.length; i++) {
      if (s[i] === '\n') {
        seen++
        if (seen > maxTotalNewlines) {
          cut = i
          break
        }
      }
    }
    s = s.slice(0, cut)
  }

  if (s.length > maxLength) {
    s = s.slice(0, maxLength)
  }

  return s
}
