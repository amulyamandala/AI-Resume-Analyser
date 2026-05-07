import React from 'react'
import { footer } from '../styles/common'
import { footerLink } from '../styles/common'
function Footer() {
  return (
    <footer className={footer}>
      <div className="max-w-5xl mx-auto px-6 py-6 text-center">
        <p className={footerLink}> 2026 AI-RESUME-ANALYSER</p>
      </div>
    </footer>
  )
}

export default Footer