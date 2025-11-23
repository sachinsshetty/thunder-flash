// src/UserApp.tsx
import React, { useState, useEffect } from 'react'
import {
  Container, Box, Typography, CircularProgress, Alert, Button,
  Paper, Grid, Card, CardContent, CardMedia,
  Chip, Divider, List, ListItem, ListItemText, ListItemIcon
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ScheduleIcon from '@mui/icons-material/Schedule'
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull'
import BluetoothIcon from '@mui/icons-material/Bluetooth'
import SpeedIcon from '@mui/icons-material/Speed'
import AlkoLiveDashboard from './AlkoLiveDashboard'
import UserCaptures from './UserCaptures'

interface UserCapture {
  id: number
  userId: string
  queryText: string
  image: string
  latitude: number
  longitude: number
  aiResponse: string
  createdAt: string
}

const camelizeKeys = (obj: any): any => {
  const camelize = (str: string) => str.replace(/_([a-z])/g, g => g[1].toUpperCase())
  if (Array.isArray(obj)) return obj.map(camelizeKeys)
  if (obj && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      acc[camelize(key)] = camelizeKeys(obj[key])
      return acc
    }, {} as any)
  }
  return obj
}

const getApiBaseUrl = (): string => {
  let base = import.meta.env.VITE_DWANI_API_BASE_URL || 'http://localhost:8000'
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    base = base.replace(/^http:/, 'https:')
    if (base.includes('localhost')) base = 'https://localhost:8000'
  }
  return base
}

const UserApp: React.FC = () => {
  const [captures, setCaptures] = useState<UserCapture[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Lawn AI states
  const [uploading, setUploading] = useState(false)
  const [lawnAnalysis, setLawnAnalysis] = useState<any>(null)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const fetchCaptures = async (retries = 3) => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/v1/user-captures`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setCaptures(camelizeKeys(data))
      setError(null)
    } catch (err) {
      if (retries > 0) setTimeout(() => fetchCaptures(retries - 1), 1500)
      else setError('Failed to load captures')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCaptures() }, [])

  const handleLawnUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadedFile(file)
    setUploading(true)
    setAnalysisError(null)
    setLawnAnalysis(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('https://xr.dwani.ai/analyze-lawn', {
        method: 'POST',
        headers: { accept: 'application/json' },
        body: formData,
      })
      if (!res.ok) throw new Error(`Analysis failed: ${res.status}`)
      const result = await res.json()
      setLawnAnalysis(result)
    } catch (err) {
      setAnalysisError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setUploading(false)
    }
  }

  if (loading) return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', bgcolor: '#0a1929' }}>
      <CircularProgress size={80} thickness={6} color="primary" />
      <Typography variant="h6" sx={{ mt: 4, color: 'grey.300' }}>Loading your lawn data...</Typography>
    </Box>
  )

  if (error) return (
    <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
      <Alert severity="error" action={<Button onClick={() => { setLoading(true); fetchCaptures() }}>Retry</Button>}>
        {error}
      </Alert>
    </Container>
  )

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0a1929', color: 'grey.200', p: { xs: 2, md: 4 } }}>
      <Container maxWidth="xl">

        {/* Your Captures */}
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, color: '#64ffda' }}>
          Your Captures
        </Typography>
        <UserCaptures captures={captures} />

        {/* Main Section: AI + Live Dashboard Side-by-Side */}
        <Box sx={{ mt: 12 }}>
          <Typography variant="h3" fontWeight="bold" sx={{ mb: 6, color: '#64ffda', textAlign: 'center' }}>
            AL-KO Smart Lawn Advisor <BluetoothIcon fontSize="large" sx={{ ml: 2, verticalAlign: 'middle', color: '#00bfa5' }} />
          </Typography>

          {/* Upload + AI Result + Live Dashboard */}
          <Grid container spacing={4} alignItems="start">

            {/* LEFT: Upload + AI Result */}
            <Grid item xs={12} md={6}>
              {/* Upload Zone */}
              <Paper
                sx={{
                  p: 6,
                  textAlign: 'center',
                  bgcolor: '#112240',
                  border: '3px dashed #64ffda',
                  borderRadius: 4,
                  cursor: 'pointer',
                  transition: '0.3s',
                  mb: 4,
                  '&:hover': { bgcolor: '#1a3a6e', transform: 'translateY(-4px)' }
                }}
                onClick={() => document.getElementById('lawn-upload')?.click()}
              >
                <input id="lawn-upload" type="file" accept="image/*" hidden onChange={handleLawnUpload} />
                {uploading ? (
                  <Box>
                    <CircularProgress size={70} thickness={6} />
                    <Typography sx={{ mt: 3, fontSize: '1.2rem' }}>AI is analyzing your lawn...</Typography>
                  </Box>
                ) : (
                  <>
                    <Typography variant="h5" color="#64ffda" gutterBottom>Upload Lawn Photo</Typography>
                    <Typography color="grey.400">
                      Get instant AI diagnosis + live AL-KO recommendations
                    </Typography>
                  </>
                )}
              </Paper>
              {analysisError && <Alert severity="error" sx={{ mb: 3 }}>{analysisError}</Alert>}

              {/* AI Analysis Result */}
              {lawnAnalysis && uploadedFile && (
                <Card sx={{ bgcolor: '#112240', color: 'white', borderRadius: 4, overflow: 'hidden' }}>
                  <CardMedia
                    component="img"
                    height="300"
                    image={URL.createObjectURL(uploadedFile)}
                    alt="Your lawn"
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="h5" gutterBottom color="#64ffda">
                      AI Assessment
                    </Typography>
                    <Typography paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
                      {lawnAnalysis.overall_assessment}
                    </Typography>

                    <Divider sx={{ my: 3, bgcolor: '#334466' }} />

                    <Typography variant="h6" gutterBottom color="#00bfa5">
                      <SpeedIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Top Recommendations
                    </Typography>
                    <List dense>
                      {lawnAnalysis.recommended_actions.slice(0, 4).map((action: any, i: number) => (
                        <ListItem key={i} sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            {i === 0 && <CheckCircleIcon fontSize="small" color="success" />}
                            {i === 1 && <ScheduleIcon fontSize="small" color="primary" />}
                            {i === 2 && <BatteryChargingFullIcon fontSize="small" color="secondary" />}
                            {i >= 3 && <BluetoothIcon fontSize="small" color="info" />}
                          </ListItemIcon>
                          <ListItemText
                            primary={<strong>{action.title}</strong>}
                            secondary={
                              <>
                                {action.why}
                                <Chip label={`Step ${action.step_number}`} size="small" sx={{ ml: 1 }} />
                              </>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>

                    <Typography variant="body2" color="grey.400" sx={{ mt: 3, fontStyle: 'italic' }}>
                      {lawnAnalysis.ongoing_maintenance}
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Grid>

            {/* RIGHT: Live AL-KO Dashboard */}
            <Grid item xs={12} md={6}>
              <AlkoLiveDashboard />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  )
}

export default UserApp