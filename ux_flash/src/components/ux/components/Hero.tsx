// Hero.jsx (updated for WeaponWatch AI - English version)
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
} from '@mui/icons-material';

// Styled FeatureCard (unchanged from your original code)
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
  '&:focus-within': {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[4],
    outline: `2px solid ${theme.palette.primary.main}`,
  },
}));

// Styled Problem/Solution Card
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

// Data for Problem and Solution sections (adapted for WeaponWatch AI - English)
const problems = [
  {
    text: 'Difficulties in quickly detecting suspicious military items',
    icon: <VisibilityOffOutlined color="error" fontSize="large" />,
    chipLabel: 'Detection',
  },
  {
    text: 'High risk from unidentified threats in the civilian population',
    icon: <WarningOutlined color="error" fontSize="large" />,
    chipLabel: 'Security',
  },
  {
    text: 'Delayed responses to suspicious sightings on-site',
    icon: <LocationOnOutlined color="error" fontSize="large" />,
    chipLabel: 'Response',
  },
  {
    text: 'Lack of public awareness and coordination in threats',
    icon: <NotificationsOutlined color="error" fontSize="large" />,
    chipLabel: 'Awareness',
  },
];

const solutions = [
  {
    text: 'From passive observation to active citizen watch: Instant AI identification',
    icon: <VisibilityOffOutlined color="primary" fontSize="large" />,
    chipLabel: 'For Civilians',
  },
  {
    text: 'Secure notifications and real-time alerts for maximum safety',
    icon: <WarningOutlined color="primary" fontSize="large" />,
    chipLabel: 'Notifications',
  },
  {
    text: 'Community network for reporting and rapid escalation',
    icon: <LocationOnOutlined color="primary" fontSize="large" />,
    chipLabel: 'Network',
  },
  {
    text: 'Educational resources and training modules for proactive threat recognition',
    icon: <NotificationsOutlined color="primary" fontSize="large" />,
    chipLabel: 'Education',
  },
];

const features = [
  {
    title: 'Small Arms Detection',
    description: 'AI Model: Instant classification and risk assessment for common firearms.',
    components: 'Image Analysis',
    hardware: 'Mobile GPU',
  },
  {
    title: 'Explosives Identification',
    description: 'Detection of potential explosive devices through visual and contextual analysis.',
    components: 'Sensor Integration',
    hardware: 'CPU/GPU',
  },
  {
    title: 'Vehicle & Drone Surveillance',
    description: 'Scalable alerts for military vehicles and UAVs in civilian areas.',
    components: 'Real-Time Dashboard',
    hardware: 'GPU',
  },
  {
    title: 'Advanced Threat Modules',
    description: 'Customizable for additional categories with community feedback and ML training.',
    components: 'Multimodal AI',
    hardware: 'CPU/GPU',
  },
];

// Main Hero Component (now for WeaponWatch AI informational content - English)
export default function Hero() {
  return (
    <>
      <title>WeaponWatch AI | Civilian Weapons Identification System</title>
      <meta
        name="description"
        content="Discover WeaponWatch AI, powered by dwani.ai – an AI platform for civilians to identify suspicious military items, send notifications, and exchange information. From small arms to drones: Stay safe and informed."
      />
      <meta
        name="keywords"
        content="WeaponWatch AI, dwani.ai, weapons detection, suspicious military items, civilian safety, AI alerts, small arms, explosives, drone surveillance"
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://uberWatch" />

      <Box
        id="hero"
        role="banner"
        sx={(theme) => ({
          width: '100%',
          backgroundRepeat: 'no-repeat',
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
          ...theme.applyStyles('dark', {
            backgroundImage:
              'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)',
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
              WeaponWatch AI
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
              Powered by dwani.ai
            </Typography>

            <Divider sx={{ width: '60%', mx: 'auto', my: 2 }} />

            <Typography
              variant="body1"
              sx={{ textAlign: 'center', color: 'text.secondary' }}
            >
              Civilian Weapons Identification: From Uncertainty to Collective Vigilance
            </Typography>

            <Divider sx={{ width: '60%', mx: 'auto', my: 2 }} />

            <Typography
              variant="body1"
              sx={{ textAlign: 'center', color: 'text.secondary' }}
            >
              From sighting to secure reporting in seconds. Explore the{' '}
              <Link
                href="https://watch.dwani.ai/dashboard"
                target="_blank"
                color="primary"
                aria-label="dwani.ai WeaponWatch Dashboard"
              >
                AI Workflow
              </Link>.
            </Typography>

            <Button
              variant="contained"
              color="primary"
              href="https://watch.dwani.ai/dashboard"
              target="_blank"
              size="large"
              sx={{ mt: 2, px: 4, py: 1.5, borderRadius: 2 }}
              aria-label="Try Weapon Identification App"
            >
              Try the App
            </Button>

            <Divider sx={{ width: '60%', mx: 'auto', my: 2 }} />

            {/* Problem Section */}
            <Stack
              spacing={4}
              useFlexGap
              sx={{ alignItems: 'center', width: '100%', mt: 8 }}
            >
              <Typography
                variant="h4"
                component="h3"
                sx={{ textAlign: 'center', fontWeight: 'bold' }}
              >
                Threats from undetected weapons are an everyday risk factor
              </Typography>
              <Grid container spacing={3}>
                {problems.map((problem, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                    <ProblemSolutionCard tabIndex={0}>
                      <Box sx={{ mb: 2 }}>{problem.icon}</Box>
                      <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary', mb: 1 }}
                      >
                        {problem.text}
                      </Typography>
                      <Chip
                        label={problem.chipLabel}
                        color="error"
                        variant="outlined"
                        size="small"
                      />
                    </ProblemSolutionCard>
                  </Grid>
                ))}
              </Grid>
            </Stack>

            {/* Solution Section */}
            <Stack
              spacing={4}
              useFlexGap
              sx={{ alignItems: 'center', width: '100%', mt: 6 }}
            >
              <Typography
                variant="h4"
                component="h3"
                sx={{ textAlign: 'center', fontWeight: 'bold' }}
              >
                The Protective Solution for Civilians
              </Typography>
              <Grid container spacing={3}>
                {solutions.map((solution, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                    <ProblemSolutionCard tabIndex={0}>
                      <Box sx={{ mb: 2 }}>{solution.icon}</Box>
                      <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary', mb: 1 }}
                      >
                        {solution.text}
                      </Typography>
                      <Chip
                        label={solution.chipLabel}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    </ProblemSolutionCard>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </Stack>

          {/* Features Section */}
          <Stack
            spacing={4}
            useFlexGap
            sx={{ alignItems: 'center', width: '100%', mt: 8 }}
          >
            <Typography
              variant="h4"
              component="h2"
              sx={{ textAlign: 'center', fontWeight: 'bold' }}
            >
              Expandable Modules & Notification Workflow
            </Typography>
            <Grid container spacing={3}>
              {features.map((feature, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                  <FeatureCard tabIndex={0}>
                    <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary', mt: 1 }}
                    >
                      {feature.description}
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ mt: 2, justifyContent: 'center' }}
                    >
                      <Chip
                        label={feature.components}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                      <Chip
                        label={feature.hardware}
                        color="secondary"
                        variant="outlined"
                        size="small"
                      />
                    </Stack>
                  </FeatureCard>
                </Grid>
              ))}
            </Grid>
          </Stack>

          {/* Contact Section */}
          <Stack
            spacing={2}
            useFlexGap
            sx={{ alignItems: 'center', width: '100%', mt: 8 }}
          >
            <Divider sx={{ width: '60%', mx: 'auto', my: 2 }} />
            <Typography
              variant="h4"
              component="h2"
              sx={{ textAlign: 'center', fontWeight: 'bold' }}
            >
              Contact Us
            </Typography>
            <Typography
              variant="body1"
              sx={{ textAlign: 'center', color: 'text.secondary' }}
            >
              Join our{' '}
              <Link
                href="https://discord.gg/9Fq8J9Gnz3"
                target="_blank"
                color="primary"
                aria-label="Join dwani.ai Discord community"
              >
                Discord Community
              </Link>{' '}
              for collaborations and feedback.
              <br />
              Have questions?{' '}
              <Link
                href="https://calendar.app.google/j1L2Sh6sExfWpUTZ7"
                target="_blank"
                color="primary"
                aria-label="Schedule a demo with dwani.ai"
              >
                Schedule a Meeting
              </Link>.
            </Typography>
          </Stack>
        </Container>
      </Box>
    </>
  );
}