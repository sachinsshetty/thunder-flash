import React from 'react';
import Box from '@mui/material/Box';
import {
  Button,
  Typography,
  TextField,
  CircularProgress,
  Modal,
  IconButton,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  useGridApiContext,
  GridRenderCellParams,
} from '@mui/x-data-grid';

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

const API_URL = getApiBaseUrl();

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

interface SearchResult {
  queryText: string;
}

interface UserCapturesProps {
  captures: UserCapture[];
}

// Safe tool parser
const parseToolsFromAIResponse = (
  aiResponse: string | any
): { names: string; details: Array<{ name: string; purpose: string; priority: string }> } => {
  if (!aiResponse) return { names: '—', details: [] };

  try {
    const parsed = typeof aiResponse === 'string' ? JSON.parse(aiResponse) : aiResponse;
    const tools = parsed?.required_tools;

    if (Array.isArray(tools) && tools.length > 0) {
      const details = tools.map((t: any) => ({
        name: t.tool_name || t.name || 'Unknown Tool',
        purpose: t.purpose || 'No purpose',
        priority: t.priority || 'normal',
      }));
      const names = details.map(d => d.name).join(', ');
      return { names, details };
    }
    return { names: 'None', details: [] };
  } catch (err) {
    console.warn('Parse error:', err);
    return { names: 'Error', details: [] };
  }
};

// Only 4 columns: ID, AI Response, Required Tools, Image
const columns: GridColDef<UserCapture>[] = [
  {
    field: 'id',
    headerName: 'ID',
    width: 90,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'aiResponse',
    headerName: 'AI Response',
    flex: 2,
    minWidth: 300,
  },
  {
    field: 'tools',
    headerName: 'Required Tools',
    flex: 1.8,
    minWidth: 240,
    sortable: true,
    valueGetter: (params: any) => {
      if (!params?.row?.aiResponse) return '—';
      return parseToolsFromAIResponse(params.row.aiResponse).names;
    },
    renderCell: (params: GridRenderCellParams<any, UserCapture>) => {
      if (!params.row) return <Typography color="text.secondary">—</Typography>;

      const { names, details } = parseToolsFromAIResponse(params.row.aiResponse);

      if (names === 'None')
        return <Typography color="text.secondary" fontStyle="italic">None</Typography>;
      if (names === 'Error')
        return <Typography color="error" fontSize="0.875rem">Parse Error</Typography>;
      if (names === '—')
        return <Typography color="text.secondary">—</Typography>;

      const tooltip = details.length > 0 && (
        <Box sx={{ p: 1.5, maxWidth: 400 }}>
          {details.map((tool, i) => (
            <Box key={i} sx={{ mb: 2 }}>
              <Typography fontWeight="bold" fontSize="0.95em">
                {tool.name}
              </Typography>
              <Typography fontSize="0.85em" color="text.secondary">
                {tool.purpose}
              </Typography>
              <Typography fontSize="0.8em" color="text.secondary" fontStyle="italic">
                Priority: {tool.priority}
              </Typography>
            </Box>
          ))}
        </Box>
      );

      return (
        <Tooltip title={tooltip || ''} arrow placement="top">
          <Typography
            sx={{
              fontWeight: 500,
              cursor: details.length > 0 ? 'help' : 'default',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {names}
          </Typography>
        </Tooltip>
      );
    },
  },
  {
    field: 'image',
    headerName: 'Image',
    width: 110,
    align: 'center',
    sortable: false,
    renderCell: (params) => <ViewImageButton imageUrl={params.value as string} />,
  },
];

// Image Modal Component
const ViewImageButton: React.FC<{ imageUrl: string }> = ({ imageUrl }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        onClick={() => setOpen(true)}
        disabled={!imageUrl}
        sx={{ minWidth: 70 }}
      >
        View
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '95%', sm: '80%' },
            maxHeight: '90vh',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            outline: 'none',
          }}
        >
          <IconButton
            onClick={() => setOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" gutterBottom textAlign="center">
            Image Preview
          </Typography>
          {imageUrl && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <img
                src={imageUrl}
                alt="Capture"
                style={{
                  maxWidth: '100%',
                  maxHeight: '70vh',
                  objectFit: 'contain',
                  borderRadius: 8,
                }}
              />
            </Box>
          )}
        </Box>
      </Modal>
    </>
  );
};

// CSV Export Button
function CustomExportButton() {
  const apiRef = useGridApiContext();
  const handleExport = () => {
    apiRef.current.exportDataAsCsv({ fileName: 'user-captures' });
  };
  return (
    <Button onClick={handleExport} variant="outlined" size="small">
      Download CSV
    </Button>
  );
}

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <CustomExportButton />
    </GridToolbarContainer>
  );
}

// Main Component
const UserCaptures: React.FC<UserCapturesProps> = ({ captures }) => {
  const originalData = captures;
  const [filteredData, setFilteredData] = React.useState<UserCapture[]>([]);
  const [searchResults, setSearchResults] = React.useState<SearchResult[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [naturalResponse, setNaturalResponse] = React.useState('');

  const camelizeKeys = (obj: any): any => {
    const camelize = (str: string) => str.replace(/_([a-z])/g, (_, l) => l.toUpperCase());
    if (Array.isArray(obj)) return obj.map(camelizeKeys);
    if (obj && typeof obj === 'object') {
      return Object.keys(obj).reduce((acc, key) => {
        acc[camelize(key)] = camelizeKeys(obj[key]);
        return acc;
      }, {} as any);
    }
    return obj;
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    setNaturalResponse('');
    setFilteredData([]);
    setSearchResults([]);

    try {
      const res = await fetch(`${API_URL}/v1/user-captures/natural-query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_query: searchQuery, table_name: 'user_captures' }),
      });

      if (!res.ok) throw new Error('Query failed');

      const data = await res.json();
      setNaturalResponse(data.natural_response || '');

      if (data.results && Array.isArray(data.results)) {
        const camelized = camelizeKeys(data.results);
        if (camelized.length > 0 && camelized[0].id) {
          setFilteredData(camelized as UserCapture[]);
        } else {
          setSearchResults(camelized as SearchResult[]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleClear = () => {
    setFilteredData([]);
    setSearchResults([]);
    setNaturalResponse('');
    setSearchQuery('');
  };

  const displayData = filteredData.length > 0 ? filteredData : originalData;
  const hasSearchResults = searchResults.length > 0;
  const showGrid = !hasSearchResults && (displayData.length > 0 || searchLoading);

  return (
    <Box sx={{ height: '100%', width: '100%', p: 3 }}>
      <Typography variant="h5" gutterBottom>
        User Captures
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'end' }}>
        <TextField
          fullWidth
          label="Natural Language Search"
          placeholder="e.g., Show captures that need a trimmer"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          disabled={searchLoading}
          sx={{ flex: 1, minWidth: 300 }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={searchLoading || !searchQuery.trim()}
        >
          {searchLoading ? <CircularProgress size={20} /> : 'Search'}
        </Button>
        {(filteredData.length > 0 || hasSearchResults) && (
          <Button variant="outlined" onClick={handleClear} disabled={searchLoading}>
            Clear
          </Button>
        )}
      </Box>

      {naturalResponse && (
        <Box sx={{ mb: 3, p: 3, bgcolor: '#1e2d4a', borderRadius: 2 }}>
          <Typography color="grey.300" sx={{ whiteSpace: 'pre-line' }}>
            {naturalResponse}
          </Typography>
        </Box>
      )}

      {showGrid && (
        <DataGrid
          rows={displayData}
          columns={columns}
          getRowId={(row) => row.id}
          slots={{ toolbar: CustomToolbar }}
          loading={searchLoading}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[10, 25, 50]}
          checkboxSelection
          sx={{
            bgcolor: '#112240',
            border: '1px solid #1e2d4a',
            color: 'grey.200',
            '& .MuiDataGrid-columnHeaders': { bgcolor: '#1e2d4a', color: 'grey.400' },
            '& .MuiDataGrid-row:hover': { bgcolor: '#1e2d4a' },
          }}
        />
      )}
    </Box>
  );
};

export default UserCaptures;