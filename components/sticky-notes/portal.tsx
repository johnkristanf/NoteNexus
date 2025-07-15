// components/StickyNotePortal.tsx
'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export default function StickyNotePortal({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const target = document.getElementById('sticky-note-root')
    if (!target) return null

    return createPortal(children, target)
}
