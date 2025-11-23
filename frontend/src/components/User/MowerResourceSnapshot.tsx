// src/components/MowerResourceSnapshot.tsx
import React from 'react'
import {
  Box, Paper, Typography, Chip, LinearProgress, Grid, Divider
} from '@mui/material'
import {
  BatteryChargingFull, BatteryStd, Timer, SquareFoot,
  EnergySavingsLeaf, WarningAmber, CheckCircle
} from '@mui/icons-material'
import { motion } from 'framer-motion'

interface MowerPlan {
  estimated_area_m2: number
  estimated_mowing_time_minutes: number
  estimated_battery_usage_percent: number
  recommended_eco_mode: boolean
  obstacles_detected: boolean
  slope_warning: boolean
  best_mowing_window: string
}

interface MowerResourceSnapshotProps {
  mowerPlan: MowerPlan | null
}

const MowerResourceSnapshot: React.FC<MowerResourceSnapshotProps> = ({ mowerPlan }) => {
  if (!mowerPlan) {
    return (
      <Paper sx={{ p: 4, bgcolor: '#112240', borderRadius: 4, textAlign: 'center', border: '1px dashed #334466' }}>
        <Typography color="grey.500">Upload a lawn photo to see energy & resource requirements</Typography>
      </Paper>
    )
  }

  const {
    estimated_area_m2,
    estimated_mowing_time_minutes,
    estimated_battery_usage_percent,
    recommended_eco_mode,
    obstacles_detected,
    slope_warning,
    best_mowing_window
  } = mowerPlan

  // AL-KO Robolinho® 1200 W specs
  const BATTERY_CAPACITY_WH = 300
  const POWER_DRAW_NORMAL_WH_PER_H = 220
  const POWER_DRAW_ECO_WH_PER_H = 160

  const powerDraw = recommended_eco_mode ? POWER_DRAW_ECO_WH_PER_H : POWER_DRAW_NORMAL_WH_PER_H
  const energyRequiredWh = Math.round((estimated_area_m2 / 300) * powerDraw)
  const batteryRemainingPercent = 100 - estimated_battery_usage_percent
  const energyRemainingWh = Math.round((batteryRemainingPercent / 100) * BATTERY_CAPACITY_WH)

  const CircularProgressRing = ({ value, max, label, color }: any) => (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <motion.div
        initial={{ background: `conic-gradient(${color} 0%, #334466 0%)` }}
        animate={{ background: `conic-gradient(${color} ${value}%, #334466 ${value}%)` }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        style={{
          width: 140,
          height: 140,
          borderRadius: '50%',
          background: `conic-gradient(${color} ${value}%, #334466 ${value}%)`,
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column'
        }}
      >
        <Typography variant="h5" component="div" color="#64ffda" fontWeight="bold">
          {value}%
        </Typography>
        <Typography variant="caption" color="grey.400">{label}</Typography>
      </Box>
    </Box>
  )

  return (
    <Paper elevation={6} sx={{ p: 4, bgcolor: '#112240', borderRadius: 4, border: '1px solid #334466' }}>
      <Typography variant="h6" sx={{ mb: 3, color: '#64ffda', display: 'flex', alignItems: 'center', gap: 1 }}>
        <EnergySavingsLeaf color="success" />
        Smart Mower Resource Snapshot
      </Typography>

      <Grid container spacing={3} alignItems="center">
        {/* Energy Required */}
        <Grid item xs={12} md={4} textAlign="center">
          <Typography variant="body2" color="grey.400" gutterBottom>
            Energy Required
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h4" color="#00bfa5" fontWeight="bold">
              {energyRequiredWh} Wh
            </Typography>
            <Typography variant="body2" color="grey.300">
              ~{(energyRequiredWh / 300 * 100).toFixed(0)}% of full battery
            </Typography>
            {recommended_eco_mode && (
              <Chip
                icon={<EnergySavingsLeaf fontSize="small" />}
                label="Eco Mode Recommended"
                size="small"
                color="success"
                sx={{ mt: 1 }}
              />
            )}
          </Box>
        </Grid>

        {/* Battery After Job */}
        <Grid item xs={12} md={4}>
          <CircularProgressRing
            value={batteryRemainingPercent}
            label="Battery Left"
            color={batteryRemainingPercent > 30 ? "#64ffda" : batteryRemainingPercent > 10 ? "#ffa726" : "#f44336"}
          />
        </Grid>

        {/* Key Stats */}
        <Grid item xs={12} md={4}>
          <Box sx={{ spaceY: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <SquareFoot color="primary" />
              <Box>
                <Typography variant="body2" color="grey.400">Area to Mow</Typography>
                <Typography variant="h6" color="white">{estimated_area_m2} m²</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Timer color="info" />
              <Box>
                <Typography variant="body2" color="grey.400">Est. Mowing Time</Typography>
                <Typography variant="h6" color="white">
                  {Math.floor(estimated_mowing_time_minutes / 60)}h {estimated_mowing_time_minutes % 60}m
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <BatteryChargingFull color="success" />
              <Box>
                <Typography variant="body2" color="grey.400">Remaining After Job</Typography>
                <Typography variant="h6" color="white">{energyRemainingWh} Wh</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3, bgcolor: '#334466' }} />

      {/* Warnings & Tips */}
      <Grid container spacing={2}>
        {slope_warning && (
          <Grid item xs={12}>
            <Chip
              icon={<WarningAmber />}
              label="Slope detected – reduce speed for safety"
              color="warning"
              variant="outlined"
              sx={{ width: '100%' }}
            />
          </Grid>
        )}
        {obstacles_detected && (
          <Grid item xs={12}>
            <Chip
              icon={<WarningAmber />}
              label="Obstacles detected – manual path planning advised"
              color="warning"
              variant="outlined"
              sx={{ width: '100%' }}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <Chip
            icon={<CheckCircle color="success" />}
            label={`Best time: ${best_mowing_window}`}
            color="success"
            variant="outlined"
            sx={{ width: '100%' }}
          />
        </Grid>
      </Grid>

      <Typography variant="caption" sx={{ mt: 3, display: 'block', color: 'grey.500', textAlign: 'center' }}>
        Based on AL-KO Robolinho® 1200 W • 300 Wh battery • Real-time AI analysis
      </Typography>
    </Paper>
  )
}

export default MowerResourceSnapshot