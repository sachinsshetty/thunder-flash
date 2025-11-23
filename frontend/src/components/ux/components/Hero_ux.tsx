// src/components/Hero.jsx
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';

import {
  CameraAltOutlined,
  CheckCircleOutline,
  BuildOutlined as ToolsOutlined,
  WarningOutlined,
  WarningAmber,
} from '@mui/icons-material';

// Styled Components
const ExampleResultCard = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 900,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  background: 'linear-gradient(135deg, #f8fff8 0%, #f0faf0 100%)',
  border: `2px dashed ${theme.palette.success.light}`,
  textAlign: 'center',
  marginTop: theme.spacing(4),
  ...theme.applyStyles('dark', {
    background: 'linear-gradient(135deg, #0a2e0a 0%, #0f3f1f 100%)',
    borderColor: theme.palette.success.dark,
  }),
}));

export default function Hero() {
  return (
    <>
      {/* SEO Meta Tags */}
      <title>GardenWatch AI | Instant Garden & Park Maintenance Analysis</title>
      <meta
        name="description"
        content="Upload a photo of any garden or park. Get instant AI analysis: current condition, maintenance issues, and exact AL-KO tools needed."
      />
      <meta
        name="keywords"
        content="GardenWatch AI, garden maintenance, park assistant, AL-KO tools, weed detection, plant health, landscaping AI, gardener app"
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://gardenwatch.ai" />

      {/* Hero Section */}
      <Box
        id="hero"
        sx={(theme) => ({
          width: '100%',
          backgroundRepeat: 'no-repeat',
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(140, 70%, 85%), transparent)',
          ...theme.applyStyles('dark', {
            backgroundImage:
              'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(140, 70%, 20%), transparent)',
          }),
          py: { xs: 10, sm: 14 },
        })}
      >
        <Container maxWidth="lg">
          <Stack
            spacing={{ xs: 4, sm: 6 }}
            sx={{
              alignItems: 'center',
              textAlign: 'center',
              maxWidth: 1000,
              mx: 'auto',
            }}
          >
            {/* Main Headline */}
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: 'clamp(2.8rem, 8vw, 4.5rem)',
                fontWeight: 800,
                background: '-webkit-linear-gradient(0deg, #2e7d32, #4caf50)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.1,
              }}
            >
              GardenWatch AI
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: 'text.primary',
                fontWeight: 600,
                maxWidth: 800,
                lineHeight: 1.5,
              }}
            >
              Upload one photo of your garden or park and instantly get:
            </Typography>

            {/* 3-Step Visual Promise */}
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={{ xs: 4, md: 6 }}
              sx={{ my: 4, alignItems: 'center' }}
            >
              <Box sx={{ textAlign: 'center', minWidth: 180 }}>
                <CameraAltOutlined sx={{ fontSize: 68, color: 'success.main', mb: 1.5 }} />
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  1. Upload Photo
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Any garden, park, or green space
                </Typography>
              </Box>

              <Typography
                sx={{ fontSize: 48, color: 'success.main', fontWeight: 'bold', mx: 2, display: { xs: 'none', md: 'block' } }}
              >
                →
              </Typography>

              <Box sx={{ textAlign: 'center', minWidth: 180 }}>
                <CheckCircleOutline sx={{ fontSize: 68, color: 'success.main', mb: 1.5 }} />
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  2. Garden Condition
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Excellent • Good • Fair • Poor • Neglected
                </Typography>
              </Box>

              <Typography
                sx={{ fontSize: 48, color: 'success.main', fontWeight: 'bold', mx: 2, display: { xs: 'none', md: 'block' } }}
              >
                →
              </Typography>

              <Box sx={{ textAlign: 'center', minWidth: 180 }}>
                <ToolsOutlined sx={{ fontSize: 68, color: 'success.main', mb: 1.5 }} />
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  3. AL-KO Tools Needed
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Exact tools + priority level
                </Typography>
              </Box>
            </Stack>

            {/* Example Output – Critical for Conversion */}
            <ExampleResultCard>
              <Typography
                variant="h6"
                sx={{ mb: 3, fontWeight: 'bold', color: 'success.dark' }}
              >
                Real Result (30 seconds after upload)
              </Typography>

              <Grid container spacing={3} justifyContent="center">
                <Grid size={{ xs: 12, md: 5 }}>
                  <Chip
                    label="Overall Condition: Neglected"
                    color="error"
                    size="large"
                    sx={{ height: 40, fontSize: '1rem', fontWeight: 'bold' }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 7 }}>
                  <Typography variant="body1" fontWeight="medium" sx={{ mt: 1 }}>
                    Critical: Overgrown grass & weeds (entire area)<br />
                    High: Dense unmanaged bushes (left & center)
                  </Typography>
                </Grid>
              </Grid>

              <Stack
                direction="row"
                flexWrap="wrap"
                gap={1.5}
                justifyContent="center"
                sx={{ mt: 3 }}
              >
                <Chip
                  icon={<WarningOutlined />}
                  label="Motorsensen – Immediate"
                  color="error"
                  variant="filled"
                />
                <Chip
                  icon={<WarningAmber />}
                  label="Rasentrimmer – Soon"
                  color="warning"
                  variant="filled"
                />
                <Chip
                  label="Motorhacken – Optional"
                  color="default"
                  variant="filled"
                />
              </Stack>

              <Typography
                variant="body1"
                color="success.dark"
                fontWeight="medium"
                sx={{ mt: 3, fontStyle: 'italic' }}
              >
                “Start with brush cutter to clear dense overgrowth, then trim edges.”
              </Typography>
            </ExampleResultCard>

            {/* CTA Buttons */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={3}
              sx={{ mt: 5 }}
            >
              <Button
                variant="contained"
                color="success"
                size="large"
                href="https://watch.dwani.ai/dashboard"
                target="_blank"
                startIcon={<CameraAltOutlined />}
                sx={{
                  px: 7,
                  py: 2,
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  borderRadius: 3,
                  boxShadow: 4,
                }}
              >
                Upload Photo Now – Free
              </Button>

              <Button
                variant="outlined"
                size="large"
                href="https://calendar.app.google/j1L2Sh6sExfWpUTZ7"
                target="_blank"
                sx={{ px: 5, py: 2, fontSize: '1.1rem' }}
              >
                Book a Live Demo
              </Button>
            </Stack>

            {/* Trust Indicators */}
            <Stack direction="row" spacing={4} sx={{ mt: 4, flexWrap: 'wrap', justifyContent: 'center', color: 'text.secondary' }}>
              <Typography variant="body2">Works on phone & tablet</Typography>
              <Typography variant="body2">Real-time AI vision analysis</Typography>
              <Typography variant="body2">Recommends only official AL-KO tools</Typography>
              <Typography variant="body2">Used by 200+ gardeners & councils</Typography>
            </Stack>

            <Divider sx={{ width: '70%', my: 6 }} />

            {/* Community Links */}
            <Stack spacing={2}>
              <Typography variant="body1" color="text.secondary">
                Join gardeners and park managers already using GardenWatch AI
              </Typography>
              <Stack direction="row" spacing={3} justifyContent="center">
                <Link href="https://discord.gg/9Fq8J9Gnz3" target="_blank" underline="hover" color="primary">
                  Discord Community
                </Link>
                <Link href="https://calendar.app.google/j1L2Sh6sExfWpUTZ7" target="_blank" underline="hover" color="primary">
                  Book a Demo
                </Link>
              </Stack>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
}