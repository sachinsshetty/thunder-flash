// src/components/Hero.jsx – FULLY WORKING + NEW LAWN CARE GUIDE ADDED
import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';
import {
  VisibilityOffOutlined,
  WarningOutlined,
  LocationOnOutlined,
  NotificationsOutlined,
  SpaOutlined,
  LocalFloristOutlined,
  PestControlOutlined,
  CloudUploadOutlined,
  CameraAltOutlined,
  WarningAmberOutlined,
} from '@mui/icons-material';

// === Original Styled Components (unchanged) ===
const FeatureCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  textAlign: 'center',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[4],
  },
}));

const ProblemSolutionCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[6],
  },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minHeight: '200px',
  textAlign: 'center',
}));

// === Upload & Result Styling ===
const UploadZone = styled(Box)(({ theme }) => ({
  border: `3px dashed ${theme.palette.success.main}`,
  borderRadius: 20,
  padding: theme.spacing(6),
  textAlign: 'center',
  cursor: 'pointer',
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(76, 175, 80, 0.06)',
  transition: 'all 0.3s',
  '&:hover': {
    backgroundColor: theme.palette.success.main + '20',
  },
}));

const ResultCard = styled(Box)(({ theme }) => ({
  mt: 4,
  p: 4,
  borderRadius: 20,
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #0a2e0a, #0f3f1f)'
    : 'linear-gradient(135deg, #f8fff8, #f0faf0)',
  border: `2px solid ${theme.palette.success.main}`,
  maxWidth: 960,
  mx: 'auto',
}));

// === NEW: Lawn Care Guide Styling ===
const LawnUploadZone = styled(UploadZone)(({ theme }) => ({
  borderColor: theme.palette.info.main,
  '&:hover': {
    backgroundColor: theme.palette.info.main + '20',
  },
}));

const LawnResultCard = styled(ResultCard)(({ theme }) => ({
  borderColor: theme.palette.info.main,
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #0a1e2e, #0f2f3f)'
    : 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
}));

// === Original Data (100% unchanged) ===
const problems = [
  { text: 'Hard to spot weeds, dead plants, or pests early', icon: <VisibilityOffOutlined color="error" fontSize="large" />, chipLabel: 'Detection' },
  { text: 'Overgrown paths and unsafe garden areas', icon: <WarningOutlined color="error" fontSize="large" />, chipLabel: 'Safety' },
  { text: 'Time-consuming manual inspections of large parks', icon: <LocationOnOutlined color="error" fontSize="large" />, chipLabel: 'Efficiency' },
  { text: 'Inconsistent maintenance quality across teams', icon: <NotificationsOutlined color="error" fontSize="large" />, chipLabel: 'Training' },
];

const solutions = [
  { text: 'Instant AI analysis of garden & park photos', icon: <SpaOutlined color="primary" fontSize="large" />, chipLabel: 'AI Scan' },
  { text: 'Clear priority list of issues + required tools', icon: <WarningOutlined color="primary" fontSize="large" />, chipLabel: 'Action Plan' },
  { text: 'Precise location tagging for maintenance crews', icon: <LocationOnOutlined color="primary" fontSize="large" />, chipLabel: 'Geo-Tagging' },
  { text: 'Training mode with real-world examples for gardeners', icon: <LocalFloristOutlined color="primary" fontSize="large" />, chipLabel: 'Education' },
];

const features = [
  { title: 'Weed & Invasive Plant Detection', description: 'Identifies common weeds and invasive species instantly.', components: 'Image AI', hardware: 'Mobile GPU' },
  { title: 'Plant Health Assessment', description: 'Detects dead leaves, disease, pests, and nutrient deficiency.', components: 'Multimodal AI', hardware: 'CPU/GPU' },
  { title: 'Path & Infrastructure Check', description: 'Spots overgrown paths, litter, broken benches, and debris.', components: 'Object Detection', hardware: 'GPU' },
  { title: 'Tool Recommendation Engine', description: 'Suggests exact tools needed: pruners, mower, rake, etc.', components: 'Reasoning Layer', hardware: 'CPU/GPU' },
];

const SYSTEM_PROMPT = `You are GardenWatchAI, a Garden/Park Maintenance Assistant. You analyze photos of gardens, parks, or green spaces and instantly report maintenance issues, required tools from AL-KO's smart garden tools, and prioritized actions. When recommending tools, use ONLY the following AL-KO garden tools:

- Rasenmäher (Lawn mowers): For mowing lawns to maintain a healthy, well-groomed lawn.
- Rasentraktoren (Ride-on mowers): For mowing larger or uneven lawns.
- Vertikutierer (Aerators): For aerating lawns to improve health and growth.
- Motorsensen (Brush cutters): For trimming grass, weeds, or rough areas.
- Rasentrimmer (Grass trimmers): For precise trimming around edges or obstacles.
- Mähroboter (Robotic mowers): For automated lawn mowing using modern technology.
- Multitool: Versatile tool for performing various garden tasks with one device.
- Combigerät (Multi-tool device): For loosening soil and other ground maintenance.
- Motorhacken (Motor hoe): For tilling and cultivating soil to prepare garden beds.

Output Format: STRICT JSON ONLY – no extra text, no markdown, no code blocks.

JSON Schema:
{
  "overall_condition": "excellent | good | fair | poor | neglected | not_applicable",
  "maintenance_issues": [
    {
      "issue": "string",
      "location_description": "string",
      "severity": "low | medium | high | critical",
      "recommended_action": "string"
    }
  ],
  "required_tools": [
    {
      "tool_name": "string",
      "purpose": "string",
      "priority": "

immediate | soon | optional"
    }
  ],
  "general_advice": "string (max 120 characters)",
  "confidence": 0.0
}`;

export default function Hero() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // NEW: States for Lawn Care Guide
  const [uploadingLawn, setUploadingLawn] = useState(false);
  const [resultLawn, setResultLawn] = useState(null);

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('text', 'Analyze this garden or park photo');
    formData.append('system_prompt', SYSTEM_PROMPT);
    formData.append('lat', '52.52');
    formData.append('lon', '13.405');

    try {
      const response = await fetch('https://xr.dwani.ai/upload_image_query', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      const parsed = JSON.parse(data.response);
      setResult(parsed);
    } catch (err) {
      setError('Failed to analyze image. Please try again or use the full app.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  // NEW: Lawn Care Guide Handler
  const handleLawnAnalysis = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingLawn(true);
    setError('');
    setResultLawn(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://xr.dwani.ai/analyze-lawn', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Lawn analysis failed');

      const data = await response.json();
      setResultLawn(data);
    } catch (err) {
      setError('Failed to generate lawn care guide. Please try again.');
      console.error(err);
    } finally {
      setUploadingLawn(false);
    }
  };

  return (
    <>
      <title>GardenWatch AI | AI Garden & Park Maintenance Assistant</title>
      <meta name="description" content="Upload a photo of any garden or park and get instant maintenance analysis: weeds, dead plants, litter, required tools, and prioritized actions." />
      <meta name="keywords" content="GardenWatch AI, garden maintenance, park assistant, weed detection, plant health, landscaping AI, gardener training, lawn care" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://gardenwatch.ai" />

      <Box
        id="hero"
        sx={(theme) => ({
          width: '100%',
          backgroundRepeat: 'no-repeat',
          backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(140, 70%, 85%), transparent)',
          ...theme.applyStyles('dark', {
            backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(140, 70%, 20%), transparent)',
          }),
          py: { xs: 8, sm: 12 },
        })}
      >
        <Container maxWidth="lg" sx={{ pt: { xs: 10, sm: 16 }, pb: { xs: 6, sm: 10 } }}>
          <Stack spacing={3} sx={{ alignItems: 'center', width: { xs: '100%', sm: '80%', md: '60%' } }}>

            {/* Original Header */}
            <Typography variant="h1" sx={{ fontSize: 'clamp(2.5rem, 7vw, 3.75rem)', fontWeight: 'bold', color: 'primary.main', textAlign: 'center' }}>
              GardenWatch AI
            </Typography>
            <Typography variant="h6" sx={{ textAlign: 'center', color: 'text.secondary', fontWeight: 'medium' }}>
              Your AI Assistant for Garden & Park Maintenance
            </Typography>
            <Divider sx={{ width: '60%', mx: 'auto', my: 2 }} />
            <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary' }}>
              Upload a photo → Get instant analysis of weeds, dead plants, litter, and the exact tools needed.
            </Typography>

            <Button variant="contained" color="success" href="https://watch.dwani.ai/dashboard" target="_blank" size="large" sx={{ mt: 2, px: 5, py: 1.5, borderRadius: 2 }}>
              Open Full App
            </Button>

            <Divider sx={{ width: '60%', mx: 'auto', my: 2 }} />

            {/* Problems */}
            <Stack spacing={4} sx={{ width: '100%', mt: 8 }}>
              <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold' }}>Common Garden & Park Maintenance Challenges</Typography>
              <Grid container spacing={3}>
                {problems.map((p, i) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                    <ProblemSolutionCard>
                      <Box sx={{ mb: 2 }}>{p.icon}</Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>{p.text}</Typography>
                      <Chip label={p.chipLabel} color="error" variant="outlined" size="small" />
                    </ProblemSolutionCard>
                  </Grid>
                ))}
              </Grid>
            </Stack>

            {/* Solutions */}
            <Stack spacing={4} sx={{ width: '100%', mt: 6 }}>
              <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold' }}>GardenWatch AI Makes It Simple</Typography>
              <Grid container spacing={3}>
                {solutions.map((s, i) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                    <ProblemSolutionCard>
                      <Box sx={{ mb: 2 }}>{s.icon}</Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>{s.text}</Typography>
                      <Chip label={s.chipLabel} color="primary" variant="outlined" size="small" />
                    </ProblemSolutionCard>
                  </Grid>
                ))}
              </Grid>
            </Stack>

            {/* Features */}
            <Stack spacing={4} sx={{ width: '100%', mt: 8 }}>
              <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold' }}>Core Detection & Training Modules</Typography>
              <Grid container spacing={3}>
                {features.map((f, i) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                    <FeatureCard>
                      <Typography variant="h6" sx={{ fontWeight: 'medium' }}>{f.title}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>{f.description}</Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 2, justifyContent: 'center' }}>
                        <Chip label={f.components} color="primary" variant="outlined" size="small" />
                        <Chip label={f.hardware} color="secondary" variant="outlined" size="small" />
                      </Stack>
                    </FeatureCard>
                  </Grid>
                ))}
              </Grid>
            </Stack>

            {/* LIVE UPLOAD & RESULT SECTION */}
            <Stack spacing={6} sx={{ width: '100%', mt: 10 }}>
              <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                Try GardenWatch AI Right Now
              </Typography>

              <UploadZone component="label">
                <input type="file" accept="image/*" hidden onChange={handleUpload} />
                {uploading ? (
                  <CircularProgress size={64} thickness={5} />
                ) : (
                  <>
                    <CloudUploadOutlined sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                    <Typography variant="h6" fontWeight="bold">Click or Drop a Garden Photo Here</Typography>
                    <Typography variant="body2" color="text.secondary">Works instantly on mobile too!</Typography>
                  </>
                )}
              </UploadZone>

              {error && <Alert severity="error">{error}</Alert>}

              {result && (
                <ResultCard>
                  <Typography variant="h5" gutterBottom fontWeight="bold" color="success.dark">
                    AI Analysis Complete
                  </Typography>

                  <Chip
                    label={`Condition: ${result.overall_condition.replace('_', ' ')}`}
                    color={['excellent', 'good'].includes(result.overall_condition) ? 'success' : 'error'}
                    size="large"
                    sx={{ mb: 3, height: 44, fontSize: '1.1rem' }}
                  />

                  {result.maintenance_issues?.length > 0 && (
                    <Stack spacing={1} sx={{ mb: 3 }}>
                      {result.maintenance_issues.map((issue, i) => (
                        <Typography key={i}>
                          • <strong>{issue.issue}</strong> ({issue.severity}) — {issue.location_description}
                        </Typography>
                      ))}
                    </Stack>
                  )}

                  <Stack direction="row" flexWrap="wrap" gap={2} justifyContent="center" sx={{ my: 3 }}>
                    {result.required_tools?.map((tool, i) => (
                      <Chip
                        key={i}
                        icon={tool.priority === 'immediate' ? <WarningOutlined /> : <WarningAmberOutlined />}
                        label={`${tool.tool_name} – ${tool.priority}`}
                        color={tool.priority === 'immediate' ? 'error' : tool.priority === 'soon' ? 'warning' : 'default'}
                        variant="filled"
                      />
                    ))}
                  </Stack>

                  <Typography variant="body1" fontStyle="italic" color="success.dark">
                    "{result.general_advice}"
                  </Typography>
                </ResultCard>
              )}

              {/* NEW: Detailed Lawn Care Guide */}
              <Stack spacing={4} sx={{ mt: 10 }}>
                <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 'bold', color: 'info.main' }}>
                  Or Get a Complete Lawn Care Guide
                </Typography>

                <LawnUploadZone component="label">
                  <input type="file" accept="image/*" hidden onChange={handleLawnAnalysis} />
                  {uploadingLawn ? (
                    <CircularProgress size={64} thickness={5} color="info" />
                  ) : (
                    <>
                      <CameraAltOutlined sx={{ fontSize: 80, color: 'info.main', mb: 2 }} />
                      <Typography variant="h6" fontWeight="bold">Upload Lawn Photo</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Step-by-step fertilizing, aeration, overseeding & mowing plan
                      </Typography>
                    </>
                  )}
                </LawnUploadZone>

                {resultLawn && (
                  <LawnResultCard>
                    <Typography variant="h5" gutterBottom fontWeight="bold" color="info.dark">
                      Your Personalized Lawn Care Plan
                    </Typography>

                    <Typography variant="body1" paragraph color="text.secondary">
                      {resultLawn.overall_assessment}
                    </Typography>

                    <Typography variant="h6" sx={{ mt: 4, mb: 3, fontWeight: 'bold' }}>
                      Recommended Actions
                    </Typography>

                    <Stack spacing={3}>
                      {resultLawn.recommended_actions.map((action) => (
                        <Box
                          key={action.step_number}
                          sx={{
                            borderLeft: 6,
                            borderColor: 'info.main',
                            bgcolor: 'background.paper',
                            p: 3,
                            borderRadius: 2,
                            boxShadow: 1,
                          }}
                        >
                          <Typography variant="h6" color="primary" gutterBottom>
                            {action.step_number}. {action.title}
                          </Typography>
                          <Typography variant="body2" paragraph><strong>Why:</strong> {action.why}</Typography>
                          <Typography variant="body2" paragraph><strong>How to do it:</strong> {action.how_to_do_it}</Typography>

                          <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 2 }}>
                            <strong>Tools & Materials:</strong>
                            {action.tools_and_materials.map((item) => (
                              <Chip key={item} label={item} size="small" color="info" variant="outlined" />
                            ))}
                          </Stack>

                          {action.best_timing && (
                            <Typography variant="body2" sx={{ mt: 1, color: 'success.dark' }}>
                              Best timing: {action.best_timing}
                            </Typography>
                          )}

                          {action.notes && (
                            <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                              Note: {action.notes}
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </Stack>

                    <Box sx={{ mt: 5, p: 3, bgcolor: 'info.main', color: 'white', borderRadius: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold">Ongoing Maintenance</Typography>
                      <Typography variant="body2">{resultLawn.ongoing_maintenance}</Typography>
                    </Box>
                  </LawnResultCard>
                )}
              </Stack>
            </Stack>

            {/* Original Footer */}
            <Stack spacing={2} sx={{ width: '100%', mt: 8 }}>
              <Divider sx={{ width: '60%', mx: 'auto' }} />
              <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                Ready to Keep Gardens Beautiful?
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary' }}>
                Join our community of gardeners and park managers.<br />
                <Link href="https://discord.gg/9Fq8J9Gnz3" target="_blank" color="primary">Discord Community</Link> •{' '}
                <Link href="https://calendar.app.google/j1L2Sh6sExfWpUTZ7" target="_blank" color="primary">Book a Demo</Link>
              </Typography>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
}