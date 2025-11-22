// Hero.jsx (updated for GardenWatch AI - Gardener Training & Maintenance Assistant App)
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import {
  VisibilityOffOutlined,
  WarningOutlined,
  LocationOnOutlined,
  NotificationsOutlined,
  SpaOutlined,
  YardOutlined,
  LocalFloristOutlined,
  PestControlOutlined,
} from '@mui/icons-material';

// Styled cards (unchanged)
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

// Updated content for GardenWatch AI
const problems = [
  {
    text: 'Hard to spot weeds, dead plants, or pests early',
    icon: <VisibilityOffOutlined color="error" fontSize="large" />,
    chipLabel: 'Detection',
  },
  {
    text: 'Overgrown paths and unsafe garden areas',
    icon: <WarningOutlined color="error" fontSize="large" />,
    chipLabel: 'Safety',
  },
  {
    text: 'Time-consuming manual inspections of large parks',
    icon: <LocationOnOutlined color="error" fontSize="large" />,
    chipLabel: 'Efficiency',
  },
  {
    text: 'Inconsistent maintenance quality across teams',
    icon: <NotificationsOutlined color="error" fontSize="large" />,
    chipLabel: 'Training',
  },
];

const solutions = [
  {
    text: 'Instant AI analysis of garden & park photos',
    icon: <SpaOutlined color="primary" fontSize="large" />,
    chipLabel: 'AI Scan',
  },
  {
    text: 'Clear priority list of issues + required tools',
    icon: <WarningOutlined color="primary" fontSize="large" />,
    chipLabel: 'Action Plan',
  },
  {
    text: 'Precise location tagging for maintenance crews',
    icon: <LocationOnOutlined color="primary" fontSize="large" />,
    chipLabel: 'Geo-Tagging',
  },
  {
    text: 'Training mode with real-world examples for gardeners',
    icon: <LocalFloristOutlined color="primary" fontSize="large" />,
    chipLabel: 'Education',
  },
];

const features = [
  {
    title: 'Weed & Invasive Plant Detection',
    description: 'Identifies common weeds and invasive species instantly.',
    components: 'Image AI',
    hardware: 'Mobile GPU',
  },
  {
    title: 'Plant Health Assessment',
    description: 'Detects dead leaves, disease, pests, and nutrient deficiency.',
    components: 'Multimodal AI',
    hardware: 'CPU/GPU',
  },
  {
    title: 'Path & Infrastructure Check',
    description: 'Spots overgrown paths, litter, broken benches, and debris.',
    components: 'Object Detection',
    hardware: 'GPU',
  },
  {
    title: 'Tool Recommendation Engine',
    description: 'Suggests exact tools needed: pruners, mower, rake, etc.',
    components: 'Reasoning Layer',
    hardware: 'CPU/GPU',
  },
];

export default function Hero() {
  return (
    <>
      <title>GardenWatch AI | AI Garden & Park Maintenance Assistant</title>
      <meta
        name="description"
        content="GardenWatch AI – Upload a photo of any garden or park and get instant maintenance analysis: weeds, dead plants, litter, required tools, and prioritized actions."
      />
      <meta
        name="keywords"
        content="GardenWatch AI, garden maintenance, park assistant, weed detection, plant health, landscaping AI, gardener training, lawn care"
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://gardenwatch.ai" />

      <Box
        id="hero"
        role="banner"
        sx={(theme) => ({
          width: '100%',
          backgroundRepeat: 'no-repeat',
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(140, 70%, 85%), transparent)',
          ...theme.applyStyles('dark', {
            backgroundImage:
              'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(140, 70%, 20%), transparent)',
          }),
          py: { xs: 8, sm: 12 },
        })}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: { xs: 10, sm: 16 },
            pb: { xs: 6, sm: 10 },
          }}
        >
          <Stack
            spacing={3}
            useFlexGap
            sx={{ alignItems: 'center', width: { xs: '100%', sm: '80%', md: '60%' } }}
          >
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: 'clamp(2.5rem, 7vw, 3.75rem)',
                fontWeight: 'bold',
                color: 'primary.main',
                textAlign: 'center',
              }}
            >
              GardenWatch AI
            </Typography>

            <Typography
              variant="h6"
              component="h2"
              sx={{
                textAlign: 'center',
                color: 'text.secondary',
                fontWeight: 'medium',
              }}
            >
              Your AI Assistant for Garden & Park Maintenance
            </Typography>

            <Divider sx={{ width: '60%', mx: 'auto', my: 2 }} />

            <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary' }}>
              Upload a photo → Get instant analysis of weeds, dead plants, litter, and the exact tools needed.
            </Typography>

            <Button
              variant="contained"
              color="success"
              href="https://watch.dwani.ai/dashboard"
              target="_blank"
              size="large"
              sx={{ mt: 2, px: 5, py: 1.5, borderRadius: 2 }}
              aria-label="Open GardenWatch AI App"
            >
              Open the App
            </Button>

            <Divider sx={{ width: '60%', mx: 'auto', my: 2 }} />

            {/* Problems */}
            <Stack spacing={4} useFlexGap sx={{ alignItems: 'center', width: '100%', mt: 8 }}>
              <Typography variant="h4" component="h3" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                Common Garden & Park Maintenance Challenges
              </Typography>
              <Grid container spacing={3}>
                {problems.map((problem, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                    <ProblemSolutionCard tabIndex={0}>
                      <Box sx={{ mb: 2 }}>{problem.icon}</Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                        {problem.text}
                      </Typography>
                      <Chip label={problem.chipLabel} color="error" variant="outlined" size="small" />
                    </ProblemSolutionCard>
                  </Grid>
                ))}
              </Grid>
            </Stack>

            {/* Solutions */}
            <Stack spacing={4} useFlexGap sx={{ alignItems: 'center', width: '100%', mt: 6 }}>
              <Typography variant="h4" component="h3" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                GardenWatch AI Makes It Simple
              </Typography>
              <Grid container spacing={3}>
                {solutions.map((solution, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                    <ProblemSolutionCard tabIndex={0}>
                      <Box sx={{ mb: 2 }}>{solution.icon}</Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                        {solution.text}
                      </Typography>
                      <Chip label={solution.chipLabel} color="primary" variant="outlined" size="small" />
                    </ProblemSolutionCard>
                  </Grid>
                ))}
              </Grid>
            </Stack>

            {/* Features */}
            <Stack spacing={4} useFlexGap sx={{ alignItems: 'center', width: '100%', mt: 8 }}>
              <Typography variant="h4" component="h2" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                Core Detection & Training Modules
              </Typography>
              <Grid container spacing={3}>
                {features.map((feature, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                    <FeatureCard tabIndex={0}>
                      <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                        {feature.description}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 2, justifyContent: 'center' }}>
                        <Chip label={feature.components} color="primary" variant="outlined" size="small" />
                        <Chip label={feature.hardware} color="secondary" variant="outlined" size="small" />
                      </Stack>
                    </FeatureCard>
                  </Grid>
                ))}
              </Grid>
            </Stack>

            {/* Contact */}
            <Stack spacing={2} useFlexGap sx={{ alignItems: 'center', width: '100%', mt: 8 }}>
              <Divider sx={{ width: '60%', mx: 'auto', my: 2 }} />
              <Typography variant="h4" component="h2" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                Ready to Keep Gardens Beautiful?
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary' }}>
                Join our community of gardeners and park managers.<br />
                <Link href="https://discord.gg/9Fq8J9Gnz3" target="_blank" color="primary">
                  Discord Community
                </Link>{' '}
                •{' '}
                <Link href="https://calendar.app.google/j1L2Sh6sExfWpUTZ7" target="_blank" color="primary">
                  Book a Demo
                </Link>
              </Typography>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
}