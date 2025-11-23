// src/components/AlkoLiveDashboard.tsx
import React, { useState, useEffect } from 'react'
import {
  Box, Paper, Typography, Chip, LinearProgress, Button, Divider, Switch, Alert, Grid
} from '@mui/material'
import {
  Bluetooth,
  BluetoothConnected,
  BluetoothDisabled,
  Speed,
  BatteryChargingFull,
  Timer,
  Grass,
  Warning,
  EnergySavingsLeaf   // ← Official MUI eco icon (replaces non-existent "Eco")
} from '@mui/icons-material'
import { motion } from 'framer-motion'

const AlkoLiveDashboard: React.FC = () => {
  const [connected, setConnected] = useState(false)
  const [battery, setBattery] = useState(78)
  const [speed, setSpeed] = useState(0)
  const [efficiency, setEfficiency] = useState(92)
  const [tilt, setTilt] = useState(0)
  const [deckOn, setDeckOn] = useState(false)
  const [ecoMode, setEcoMode] = useState(true)
  const [remainingTime, setRemainingTime] = useState(47)
  const [mowedArea, setMowedArea] = useState(312)

  // Simulate connection after mount
  useEffect(() => {
    const timer = setTimeout(() => setConnected(true), 1800)
    return () => clearTimeout(timer)
  }, [])

  // Simulate live data when connected and mowing
  useEffect(() => {
    if (!connected || !deckOn) return

    const interval = setInterval(() => {
      setBattery(prev => Math.max(3, prev - 0.07 - Math.random() * 0.05))
      setSpeed(3.1 + Math.random() * 1.9)
      setEfficiency(84 + Math.random() * 13)
      setTilt(Math.sin(Date.now() / 1200) * 14)
      setRemainingTime(prev => Math.max(0, prev - 0.015))
      setMowedArea(prev => prev + 0.75)
    }, 800)

    return () => clearInterval(interval)
  }, [connected, deckOn])

  const isDangerTilt = Math.abs(tilt) > 28

  return (
    <Paper elevation={6} sx={{ p: 4, bgcolor: '#112240', borderRadius: 4, border: '1px solid #334466' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#64ffda' }}>
          {connected ? <BluetoothConnected color="success" /> : <BluetoothDisabled color="error" />}
          AL-KO Robolinho® 1200 W – Live
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={connected ? <BluetoothConnected /> : <Bluetooth />}
          onClick={() => setConnected(c => !c)}
          color={connected ? "success" : "error"}
        >
          {connected ? 'Connected' : 'Connect'}
        </Button>
      </Box>

      <Divider sx={{ mb: 3, bgcolor: '#334466' }} />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} md={3}>
          <Typography variant="body2" color="grey.400">Battery</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BatteryChargingFull color={battery > 20 ? "success" : "error"} />
            <Typography variant="h5">{battery.toFixed(0)}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={battery} sx={{ mt: 1, height: 10, borderRadius: 5 }}
            color={battery > 20 ? "success" : "error"} />
        </Grid>

        <Grid item xs={6} md={3}>
          <Typography variant="body2" color="grey.400">Speed</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Speed />
            <Typography variant="h5">{deckOn ? speed.toFixed(1) : 0} km/h</Typography>
          </Box>
          <Chip label={`${efficiency.toFixed(0)}% eff.`} color="success" size="small" sx={{ mt: 1 }} />
        </Grid>

        <Grid item xs={6} md={3}>
          <Typography variant="body2" color="grey.400">Tilt</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isDangerTilt ? <Warning color="error" /> : <Grass color="success" />}
            <Typography variant="h5" color={isDangerTilt ? "error.main" : "inherit"}>
              {tilt.toFixed(1)}°
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={6} md={3}>
          <Typography variant="body2" color="grey.400">Time Left</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Timer />
            <Typography variant="h5">{remainingTime.toFixed(0)} min</Typography>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography>Mowing Deck</Typography>
          <Switch
            checked={deckOn && !isDangerTilt}
            onChange={() => setDeckOn(!deckOn)}
            disabled={isDangerTilt}
            color="success"
          />
          <Typography color={deckOn && !isDangerTilt ? "success.main" : "error.main"}>
            {isDangerTilt ? "STOPPED" : deckOn ? "ON" : "OFF"}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EnergySavingsLeaf color={ecoMode ? "success" : "disabled"} />
          <Typography>Eco Mode</Typography>
          <Switch checked={ecoMode} onChange={() => setEcoMode(!ecoMode)} />
        </Box>
      </Box>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="subtitle1" color="#64ffda" gutterBottom>
          Mowed Area: {mowedArea.toFixed(0)} m²
        </Typography>

        <svg width="100%" height="240" viewBox="0 0 420 240" style={{ background: '#0a1929', borderRadius: 16, border: '2px solid #334466' }}>
          <rect x="0" y="0" width="420" height="240" fill="#0a1929" />
          <rect x="40" y="40" width="340" height="160" rx="16" fill="none" stroke="#334466" strokeWidth="5" />

          <motion.path
            d="M 80 120 Q 210 70, 340 120 T 340 180 L 80 180"
            fill="none"
            stroke="#64ffda"
            strokeWidth="32"
            strokeLinecap="round"
            initial={{ pathLength: 0.05 }}
            animate={{ pathLength: deckOn && connected && !isDangerTilt ? 1 : 0.3 }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          />

          {(deckOn && connected && !isDangerTilt) && (
            <circle r="16" fill="#64ffda">
              <animateMotion dur="28s" repeatCount="indefinite" path="M 80 120 Q 210 70, 340 120 T 340 180" />
            </circle>
          )}
        </svg>
      </Box>

      {isDangerTilt && (
        <Alert severity="error" sx={{ mt: 3 }}>
          Safety Stop: Slope too steep! Mower halted.
        </Alert>
      )}
    </Paper>
  )
}

export default AlkoLiveDashboard;