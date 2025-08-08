import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import AdminLayout from '@/components/AdminLayout'

interface ThemeSettings {
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  headerBackground: string
  footerBackground: string
  buttonStyle: string
  fontFamily: string
  logoUrl: string
  heroTitle: string
  heroSubtitle: string
  customCSS: string
}

const defaultTheme: ThemeSettings = {
  primaryColor: '#dc2626',
  secondaryColor: '#991b1b',
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  headerBackground: '#ffffff',
  footerBackground: '#1f2937',
  buttonStyle: 'rounded',
  fontFamily: 'Inter',
  logoUrl: '',
  heroTitle: 'Godless America',
  heroSubtitle: 'Premium merchandise for the rebellious spirit',
  customCSS: ''
}

export default function AdminAppearance() {
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchThemeSettings()
  }, [])

  const fetchThemeSettings = async () => {
    try {
      const response = await fetch('/api/admin/theme', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setTheme({ ...defaultTheme, ...data })
      }
    } catch (error) {
      console.error('Failed to fetch theme settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')

    try {
      const response = await fetch('/api/admin/theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(theme)
      })

      if (response.ok) {
        setMessage('Theme settings saved successfully!')
        // Generate CSS file
        await generateCSSFile()
      } else {
        setMessage('Failed to save theme settings')
      }
    } catch (error) {
      setMessage('Failed to save theme settings')
    } finally {
      setSaving(false)
    }
  }

  const generateCSSFile = async () => {
    const css = generateCustomCSS(theme)
    
    try {
      await fetch('/api/admin/generate-css', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ css })
      })
    } catch (error) {
      console.error('Failed to generate CSS file:', error)
    }
  }

  const generateCustomCSS = (settings: ThemeSettings) => {
    return `
/* Auto-generated theme CSS */
:root {
  --primary-color: ${settings.primaryColor};
  --secondary-color: ${settings.secondaryColor};
  --background-color: ${settings.backgroundColor};
  --text-color: ${settings.textColor};
  --header-background: ${settings.headerBackground};
  --footer-background: ${settings.footerBackground};
}

body {
  background-color: var(--background-color);
  color: var(--text-color);
  font-family: ${settings.fontFamily}, sans-serif;
}

.btn-primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  ${settings.buttonStyle === 'rounded' ? 'border-radius: 0.375rem;' : ''}
  ${settings.buttonStyle === 'square' ? 'border-radius: 0;' : ''}
  ${settings.buttonStyle === 'pill' ? 'border-radius: 9999px;' : ''}
}

.btn-primary:hover {
  background-color: var(--secondary-color);
  border-color: var(--secondary-color);
}

header {
  background-color: var(--header-background);
}

footer {
  background-color: var(--footer-background);
}

.text-primary {
  color: var(--primary-color);
}

.bg-primary {
  background-color: var(--primary-color);
}

.border-primary {
  border-color: var(--primary-color);
}

/* Custom CSS */
${settings.customCSS}
`
  }

  const previewTheme = () => {
    const css = generateCustomCSS(theme)
    const newWindow = window.open('/', 'preview', 'width=1200,height=800')
    if (newWindow) {
      newWindow.onload = () => {
        const style = newWindow.document.createElement('style')
        style.textContent = css
        newWindow.document.head.appendChild(style)
      }
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <Head>
        <title>Store Appearance - Admin - Godless America</title>
        <meta name="description" content="Customize store appearance and theme" />
      </Head>

      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Store Appearance</h1>
            <p className="text-gray-600">Customize your store's look and feel</p>
          </div>
          <div className="space-x-3">
            <button
              onClick={previewTheme}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium"
            >
              Preview Changes
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {message && (
          <div className={`px-4 py-3 rounded ${
            message.includes('success') 
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Colors Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Colors</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={theme.primaryColor}
                    onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                    className="h-10 w-20 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={theme.primaryColor}
                    onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                    className="input-field flex-1"
                    placeholder="#dc2626"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={theme.secondaryColor}
                    onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                    className="h-10 w-20 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={theme.secondaryColor}
                    onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                    className="input-field flex-1"
                    placeholder="#991b1b"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={theme.backgroundColor}
                    onChange={(e) => setTheme({ ...theme, backgroundColor: e.target.value })}
                    className="h-10 w-20 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={theme.backgroundColor}
                    onChange={(e) => setTheme({ ...theme, backgroundColor: e.target.value })}
                    className="input-field flex-1"
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={theme.textColor}
                    onChange={(e) => setTheme({ ...theme, textColor: e.target.value })}
                    className="h-10 w-20 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={theme.textColor}
                    onChange={(e) => setTheme({ ...theme, textColor: e.target.value })}
                    className="input-field flex-1"
                    placeholder="#1f2937"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Typography & Style */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Typography & Style</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Family
                </label>
                <select
                  value={theme.fontFamily}
                  onChange={(e) => setTheme({ ...theme, fontFamily: e.target.value })}
                  className="input-field"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Lato">Lato</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Poppins">Poppins</option>
                  <option value="Arial">Arial</option>
                  <option value="Georgia">Georgia</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button Style
                </label>
                <select
                  value={theme.buttonStyle}
                  onChange={(e) => setTheme({ ...theme, buttonStyle: e.target.value })}
                  className="input-field"
                >
                  <option value="rounded">Rounded</option>
                  <option value="square">Square</option>
                  <option value="pill">Pill</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo URL
                </label>
                <input
                  type="url"
                  value={theme.logoUrl}
                  onChange={(e) => setTheme({ ...theme, logoUrl: e.target.value })}
                  className="input-field"
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>
          </div>

          {/* Hero Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Hero Section</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hero Title
                </label>
                <input
                  type="text"
                  value={theme.heroTitle}
                  onChange={(e) => setTheme({ ...theme, heroTitle: e.target.value })}
                  className="input-field"
                  placeholder="Godless America"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hero Subtitle
                </label>
                <textarea
                  value={theme.heroSubtitle}
                  onChange={(e) => setTheme({ ...theme, heroSubtitle: e.target.value })}
                  className="input-field"
                  rows={3}
                  placeholder="Premium merchandise for the rebellious spirit"
                />
              </div>
            </div>
          </div>

          {/* Custom CSS */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Custom CSS</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional CSS
              </label>
              <textarea
                value={theme.customCSS}
                onChange={(e) => setTheme({ ...theme, customCSS: e.target.value })}
                className="input-field font-mono text-sm"
                rows={10}
                placeholder="/* Add your custom CSS here */
.custom-class {
  /* Your styles */
}"
              />
              <p className="text-xs text-gray-500 mt-2">
                Add custom CSS to further customize your store's appearance
              </p>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Live Preview</h3>
          <div 
            className="border-2 border-gray-200 rounded-lg p-8 text-center"
            style={{
              backgroundColor: theme.backgroundColor,
              color: theme.textColor,
              fontFamily: theme.fontFamily
            }}
          >
            <h2 
              className="text-3xl font-bold mb-4"
              style={{ color: theme.primaryColor }}
            >
              {theme.heroTitle}
            </h2>
            <p className="text-lg mb-6">{theme.heroSubtitle}</p>
            <button
              className="px-6 py-3 text-white font-medium"
              style={{
                backgroundColor: theme.primaryColor,
                borderRadius: theme.buttonStyle === 'rounded' ? '0.375rem' :
                             theme.buttonStyle === 'pill' ? '9999px' : '0'
              }}
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
