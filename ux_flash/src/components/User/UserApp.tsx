import { useState, useEffect, useMemo } from 'react';
import { Container, Grid, Typography, Card, CardContent, Button, Box, CircularProgress, Alert, Avatar, Divider, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import UserCaptures from './UserCaptures';
import RegulatoryFeed from './RegulatoryFeed';

interface UserCapture {
  id: number;
  userId: string;
  queryText: string;
  image: string;
  latitude: number;
  longitude: number;
  aiResponse: string;
  createdAt: string;
}

const camelizeKeys = (obj: any): any => {
  const camelize = (str: string): string => str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  
  if (Array.isArray(obj)) {
    return obj.map(camelizeKeys);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result: Record<string, any>, key: string) => {
      result[camelize(key)] = camelizeKeys(obj[key]);
      return result;
    }, {} as Record<string, any>);
  }
  return obj;
};

const getApiBaseUrl = (): string => {
  let baseUrl = import.meta.env.VITE_DWANI_API_BASE_URL || 'http://localhost:8000';
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    baseUrl = baseUrl.replace(/^http:/, 'https:');
    if (baseUrl.includes('localhost')) {
      baseUrl = 'https://localhost:8000';
    }
  }
  return baseUrl;
};

const UserApp = () => {
  const [captures, setCaptures] = useState<UserCapture[]>([]);
  const [regulatoryFeed, setRegulatoryFeed] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [errorRegulatory, setErrorRegulatory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingRegulatory, setLoadingRegulatory] = useState(true);
 
  const fetchCaptures = async (retries = 3) => {
    try {
      const DWANI_API_BASE_URL = getApiBaseUrl();
      const apiUrl = `${DWANI_API_BASE_URL}/v1/user-captures`;

      console.log('Fetching from:', apiUrl);
      
      const res = await fetch(apiUrl);
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`HTTP ${res.status}: ${res.statusText} - Body: ${errorText}`);
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      const camelCasedData = camelizeKeys(data);
      setCaptures(camelCasedData);
      setError(null);
      console.log('Fetched captures:', camelCasedData);
    } catch (err) {
      console.error('Error fetching captures:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      if (retries > 0) {
        console.log(`Retrying in 1s... (${retries} left)`);
        setTimeout(() => fetchCaptures(retries - 1), 1000);
      } else {
        setError(`Failed to load captures: ${errorMessage}. Check backend (port 8000) & Docker network.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRegulatory = async (retries = 3) => {
    try {
      const DWANI_API_BASE_URL = getApiBaseUrl();
      const apiUrl = `${DWANI_API_BASE_URL}/api/countries/regulatory-feed`;

      console.log('Fetching regulatory feed from:', apiUrl);
      
      const res = await fetch(apiUrl);
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`HTTP ${res.status}: ${res.statusText} - Body: ${errorText}`);
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      const camelCasedData = camelizeKeys(data);
      setRegulatoryFeed(camelCasedData);
      setErrorRegulatory(null);
      console.log('Fetched regulatory feed:', camelCasedData);
    } catch (err) {
      console.error('Error fetching regulatory feed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      if (retries > 0) {
        console.log(`Retrying in 1s... (${retries} left)`);
        setTimeout(() => fetchRegulatory(retries - 1), 1000);
      } else {
        setErrorRegulatory(`Failed to load regulatory feed: ${errorMessage}. Check backend (port 8000) & Docker network.`);
      }
    } finally {
      setLoadingRegulatory(false);
    }
  };

  useEffect(() => {
    fetchCaptures();
    fetchRegulatory();
  }, []);

 
  const totalCaptures = captures.length;
  const uniqueUsers = useMemo(() => new Set(captures.map(c => c.userId)).size, [captures]);
  const recentCaptures = useMemo(
    () => captures.filter(c => new Date(c.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length,
    [captures]
  );
  const percentageRecent = totalCaptures > 0 ? (recentCaptures / totalCaptures) : 0;

  const currentDate = new Date();
  let activityLevel = 'LOW';
  let activityColor = 'green';
  if (totalCaptures > 0) {
    const latestCapture = captures.reduce((latest, current) =>
      new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
    );
    const daysSinceLast = (currentDate.getTime() - new Date(latestCapture.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceLast <= 1) {
      activityLevel = 'HIGH';
      activityColor = 'red';
    } else if (daysSinceLast <= 7) {
      activityLevel = 'MEDIUM';
      activityColor = 'orange';
    }
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }} action={
          <Button color="inherit" size="small" onClick={() => { setLoading(true); setError(null); fetchCaptures(); }}>
            Retry
          </Button>
        }>
          {error}
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>Loading captures...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: 'grey.600', mr: 2 }}>
            <Typography variant="h4" fontWeight="bold">AS</Typography>
          </Avatar>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" fontWeight="bold" color="grey.200">
            Juris-Diction(AI)ry
          </Typography>
          <Typography variant="body2" color="cyan.400">
            powered by dwani
          </Typography>
        </Box>
        <Box sx={{ width: 64 }} />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ mb: 3, backgroundColor: '#112240', border: '1px solid #1e2d4a' }}>
            <CardContent>
              <Typography variant="h5" fontWeight="600" sx={{ mb: 2, color: 'grey.400' }}>Overview</Typography>
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress variant="determinate" value={100} size={120} thickness={4} sx={{ color: '#3b82f6' }} />
                    <Typography variant="h4" fontWeight="bold" color="blue.400" sx={{ mt: 1 }}>
                      {totalCaptures}
                    </Typography>
                    <Typography variant="body2" color="grey.500" sx={{ mt: 1 }}>TOTAL USER CAPTURES</Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress variant="determinate" value={100} size={120} thickness={4} sx={{ color: '#10b981' }} />
                    <Typography variant="h4" fontWeight="bold" color="green.400" sx={{ mt: 1 }}>
                      {uniqueUsers}
                    </Typography>
                    <Typography variant="body2" color="grey.500" sx={{ mt: 1 }}>UNIQUE USERS</Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress variant="determinate" value={activityLevel === 'HIGH' ? 100 : activityLevel === 'MEDIUM' ? 50 : 0} size={120} thickness={4} sx={{ color: activityColor }} />
                    <Typography variant="h5" fontWeight="bold" sx={{ mt: 1, color: activityColor === 'red' ? 'red.500' : activityColor === 'orange' ? 'orange.500' : 'success.main' }}>
                      {activityLevel}
                    </Typography>
                    <Typography variant="body2" color="grey.500" sx={{ mt: 1 }}>ACTIVITY LEVEL</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Accordion sx={{ mb: 3, backgroundColor: '#112240', border: '1px solid #1e2d4a', boxShadow: 'none' }} defaultExpanded={true}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'grey.400' }} />}>
              <Typography variant="h6" fontWeight="600" sx={{ color: 'grey.400' }}>User Captures</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <UserCaptures captures={captures} />
            </AccordionDetails>
          </Accordion>
          <Divider sx={{ my: 1, borderColor: '#1e2d4a' }} />

          <Accordion sx={{ mb: 3, backgroundColor: '#112240', border: '1px solid #1e2d4a', boxShadow: 'none' }} defaultExpanded={false}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'grey.400' }} />}>
              <Typography variant="h6" fontWeight="600" sx={{ color: 'grey.400' }}>Country Profiles</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
            </AccordionDetails>
          </Accordion>

          <Divider sx={{ my: 1, borderColor: '#1e2d4a' }} />

          <Card sx={{ backgroundColor: '#112240', border: '1px solid #1e2d4a' }}>
            <CardContent>
              <Accordion defaultExpanded={false} sx={{ boxShadow: 'none' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'grey.400' }} />}>
                  <Typography variant="h5" fontWeight="600" sx={{ color: 'grey.400', flexGrow: 1 }}>Regulatory Feed</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0 }}>
                  {errorRegulatory && (
                    <Alert severity="error" sx={{ mb: 2 }} action={
                      <Button color="inherit" size="small" onClick={() => { setLoadingRegulatory(true); setErrorRegulatory(null); fetchRegulatory(); }}>
                        Retry
                      </Button>
                    }>
                      {errorRegulatory}
                    </Alert>
                  )}
                  {loadingRegulatory ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress />
                      <Typography variant="body1" sx={{ ml: 2 }}>Loading regulatory feed...</Typography>
                    </Box>
                  ) : (
                    <RegulatoryFeed feed={regulatoryFeed} />
                  )}
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>
        </Grid>
        <div style={{ display: 'none' }}>
          <Grid item xs={12} lg={4}>
            <Card sx={{ backgroundColor: '#112240', border: '1px solid #1e2d4a', mb: 3 }}>
              <CardContent>
                <Typography variant="h5" fontWeight="600" sx={{ mb: 2, color: 'grey.400' }}>Quick Actions</Typography>
                <Button fullWidth variant="outlined" sx={{ mb: 1, color: '#a8b2d1', borderColor: '#1e2d4a', '&:hover': { bgcolor: '#1e2d4a', color: '#64ffda' } }}>
                  Run New Scan
                </Button>
                <Button fullWidth variant="outlined" sx={{ mb: 1, color: '#a8b2d1', borderColor: '#1e2d4a', '&:hover': { bgcolor: '#1e2d4a', color: '#64ffda' } }}>
                  Generate Report
                </Button>
                <Button fullWidth variant="outlined" sx={{ mb: 1, color: '#a8b2d1', borderColor: '#1e2d4a', '&:hover': { bgcolor: '#1e2d4a', color: '#64ffda' } }}>
                  Client Database
                </Button>
                <Button fullWidth variant="outlined" sx={{ color: '#a8b2d1', borderColor: '#1e2d4a', '&:hover': { bgcolor: '#1e2d4a', color: '#64ffda' } }}>
                  Settings
                </Button>
              </CardContent>
            </Card>
            <Card sx={{ backgroundColor: '#112240', border: '1px solid #1e2d4a', mb: 3, textAlign: 'center' }}>
              <CardContent>
                <Typography variant="body2" color="grey.500">
                  USER: <Typography component="span" variant="body2" fontWeight="600" color="grey.200">TAX_ADVISOR/USERNAME</Typography>
                </Typography>
                <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>LAST UPDATE: JUST NOW</Typography>
              </CardContent>
            </Card>
            <Card sx={{ backgroundColor: '#112240', border: '1px solid #1e2d4a', opacity: 0.2, minHeight: 200 }} />
          </Grid>
        </div>
      </Grid>
    </Container>
  );
};

export default UserApp;