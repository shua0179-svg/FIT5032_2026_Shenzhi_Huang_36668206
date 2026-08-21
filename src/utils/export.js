const escapeCsvValue = (value) => {
  const text = String(value ?? '').replace(/"/g, '""')
  return `"${text}"`
}

export const downloadFile = (filename, content, mimeType) => {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = filename
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export const downloadCsv = (filename, headers, rows) => {
  const csv = [headers, ...rows]
    .map((row) => row.map(escapeCsvValue).join(','))
    .join('\r\n')

  // The byte-order mark keeps non-English book data readable in spreadsheet apps.
  downloadFile(filename, `\uFEFF${csv}`, 'text/csv')
}

export const downloadJson = (filename, data) => {
  downloadFile(filename, JSON.stringify(data, null, 2), 'application/json')
}
