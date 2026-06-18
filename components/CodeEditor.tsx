"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightSpecialChars, drawSelection, rectangularSelection } from "@codemirror/view"
import { EditorState } from "@codemirror/state"
import { javascript } from "@codemirror/lang-javascript"
import { html } from "@codemirror/lang-html"
import { css } from "@codemirror/lang-css"
import { oneDark } from "@codemirror/theme-one-dark"
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands"
import { syntaxHighlighting, defaultHighlightStyle } from "@codemirror/language"

interface CodeEditorProps {
  value: string
  onChange?: (value: string) => void
  readOnly?: boolean
  height?: string
  placeholder?: string
  onRun?: () => void
  language?: "javascript" | "html" | "css"
}

const AUTO_SAVE_KEY = "editor-draft"

export function CodeEditor({ value, onChange, readOnly, height, placeholder, onRun, language = "javascript" }: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || !editorRef.current) return

    if (viewRef.current) {
      viewRef.current.destroy()
    }

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged && onChange) {
        const novo = update.state.doc.toString()
        onChange(novo)
        try { localStorage.setItem(AUTO_SAVE_KEY, novo) } catch {}
      }
    })

    const runKeymap = keymap.of([
      {
        key: "Ctrl-Enter",
        run: () => { onRun?.(); return true },
      },
    ])

    const startState = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        highlightSpecialChars(),
        drawSelection(),
        rectangularSelection(),
        syntaxHighlighting(defaultHighlightStyle),
        language === "html" ? html() :
          language === "css" ? css() :
          javascript({ typescript: false, jsx: false }),
        oneDark,
        history(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        runKeymap,
        updateListener,
        EditorView.editable.of(!readOnly),
        ...(placeholder ? [EditorView.contentAttributes.of({ "aria-placeholder": placeholder })] : []),
      ],
    })

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    })

    viewRef.current = view

    return () => {
      view.destroy()
      viewRef.current = null
    }
  }, [isMounted])

  useEffect(() => {
    const view = viewRef.current
    if (!view || !isMounted) return

    const currentDoc = view.state.doc.toString()
    if (currentDoc !== value) {
      view.dispatch({
        changes: {
          from: 0,
          to: currentDoc.length,
          insert: value,
        },
      })
    }
  }, [value, isMounted])

  return (
    <div
      ref={editorRef}
      className="border border-gray-700 rounded-xl overflow-hidden text-sm"
      style={{ height: height ?? "200px" }}
    />
  )
}

export function useAutoSave(codigo: string, exemplos: { nome: string; codigo: string }[]) {
  const [origem, setOrigem] = useState<string | null>(null)

  const restaurar = useCallback(() => {
    const draft = localStorage.getItem(AUTO_SAVE_KEY)
    if (draft) {
      const match = exemplos.find(e => e.codigo === draft)
      if (match) return draft
      return draft
    }
    return codigo
  }, [codigo, exemplos])

  return { restaurar }
}
