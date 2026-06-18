"use client"

import { useMemo } from "react"

interface LivePreviewProps {
  html: string
  css: string
  js: string
  height?: string
}

export function LivePreview({ html, css, js, height = "300px" }: LivePreviewProps) {
  const srcDoc = useMemo(() => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>${js}<\/script>
      </body>
      </html>
    `
  }, [html, css, js])

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-700" style={{ height }}>
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 border-b border-gray-200">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
        <span className="text-[10px] text-gray-400 ml-2 uppercase tracking-wider">Preview</span>
      </div>
      <iframe
        srcDoc={srcDoc}
        className="w-full h-[calc(100%-28px)] bg-white"
        title="Live Preview"
        sandbox="allow-scripts"
      />
    </div>
  )
}
