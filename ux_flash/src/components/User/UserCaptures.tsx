import React from 'react';
import Box from '@mui/material/Box';
import { Button, Typography, TextField, CircularProgress, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  useGridApiContext,
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
  image: string; // Base64 data URL
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

const columns: GridColDef<UserCapture>[] = [
  { field: 'id', headerName: 'ID', flex: 0.5, minWidth: 80 },
  { field: 'userId', headerName: 'User ID', flex: 1, minWidth: 150 },
  {
    field: 'queryText',
    headerName: 'Query Text',
    flex: 2,
    minWidth: 250,
    editable: false,
  },
  {
    field: 'latitude',
    headerName: 'Latitude',
    flex: 0.8,
    minWidth: 100,
    editable: false,
  },
  {
    field: 'longitude',
    headerName: 'Longitude',
    flex: 0.8,
    minWidth: 100,
    editable: false,
  },
  {
    field: 'aiResponse',
    headerName: 'AI Response',
    flex: 2,
    minWidth: 250,
    editable: false,
  },
  {
    field: 'createdAt',
    headerName: 'Created At',
    flex: 1,
    minWidth: 150,
    editable: false,
  },
  {
    field: 'image',
    headerName: 'Image',
    flex: 0.5,
    minWidth: 100,
    sortable: false,
    renderCell: (params) => (
      <ViewImageButton imageUrl={params.value as string} />
    ),
  },
];

interface ViewImageButtonProps {
  imageUrl: string;
}

const ViewImageButton: React.FC<ViewImageButtonProps> = ({ imageUrl }) => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        onClick={handleOpen}
        disabled={!imageUrl}
      >
        View
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="image-modal-title"
        aria-describedby="image-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            height: '80%',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography id="image-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
            Image Preview
          </Typography>
          {imageUrl && (
            <img
              src={imageUrl}
              alt="User Capture"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                borderRadius: 1,
              }}
            />
          )}
        </Box>
      </Modal>
    </>
  );
};

function CustomExportButton() {
  const apiRef = useGridApiContext();

  const handleExport = () => {
    apiRef.current.exportDataAsCsv({
      fileName: 'user-captures',
    });
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

const UserCaptures: React.FC<UserCapturesProps> = ({ captures }) => {
  const originalData = captures;
  const [filteredData, setFilteredData] = React.useState<UserCapture[]>([]);
  const [searchResults, setSearchResults] = React.useState<SearchResult[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [naturalResponse, setNaturalResponse] = React.useState('');

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

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    setNaturalResponse('');
    setFilteredData([]);
    setSearchResults([]);
    try {
      const url = `${API_URL}/v1/user-captures/natural-query`;
      console.log('Querying natural language search:', url, searchQuery);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_query: searchQuery, table_name: "user_captures" }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Query HTTP ${response.status}: ${response.statusText} - Body: ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Query response:', data);

      setNaturalResponse(data.natural_response || '');

      if (data.results && Array.isArray(data.results)) {
        const camelized = camelizeKeys(data.results);
        if (camelized.length > 0 && camelized[0].id) {
          setFilteredData(camelized as UserCapture[]);
        } else {
          setSearchResults(camelized as SearchResult[]);
        }
      } else {
        setFilteredData(originalData);
      }
    } catch (error) {
      console.error('Error querying user captures:', error);
      setFilteredData(originalData);
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
    <Box sx={{ height: '100%', width: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        User Captures
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'end', flexWrap: 'wrap' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask a question about user captures, e.g., Show me all captures from a specific location"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          disabled={searchLoading}
          sx={{ 
            '& .MuiOutlinedInput-root': { backgroundColor: '#1e2d4a' },
            flex: 1,
            minWidth: 300,
          }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={searchLoading || !searchQuery.trim()}
          sx={{ minWidth: 100 }}
        >
          {searchLoading ? <CircularProgress size={20} color="inherit" /> : 'Query'}
        </Button>
        {(filteredData.length > 0 || hasSearchResults) && (
          <Button
            variant="outlined"
            onClick={handleClear}
            disabled={searchLoading}
            sx={{ minWidth: 80, color: '#a8b2d1', borderColor: '#1e2d4a' }}
          >
            Clear
          </Button>
        )}
      </Box>

      {naturalResponse && (
        <Box
          sx={{
            mb: 2,
            p: 2,
            backgroundColor: '#1e2d4a',
            border: '1px solid #2a3b5a',
            borderRadius: 1,
          }}
        >
          <Typography sx={{ whiteSpace: 'pre-line', color: 'grey.300', fontSize: '0.875rem' }}>
            {naturalResponse}
          </Typography>
        </Box>
      )}

      {hasSearchResults && (
        <Box
          sx={{
            mb: 2,
            p: 2,
            backgroundColor: '#1e2d4a',
            border: '1px solid #2a3b5a',
            borderRadius: 1,
            maxHeight: 400,
            overflowY: 'auto',
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1, color: 'grey.400' }}>
            Search Results:
          </Typography>
          {searchResults.map((item, index) => (
            <Typography key={index} variant="body2" sx={{ color: 'grey.300', mb: 0.5 }}>
              {item.queryText}
            </Typography>
          ))}
        </Box>
      )}

      {showGrid && (
        <DataGrid
          rows={displayData}
          columns={columns}
          getRowId={(row) => row.id}
          slots={{
            toolbar: CustomToolbar,
          }}
          loading={searchLoading}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
                page: 0,
              },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          checkboxSelection
          disableRowSelectionOnClick
          sx={{
            height: 500,
            '& .MuiDataGrid-cell': {
              fontSize: '0.875rem',
            },
            backgroundColor: '#112240',
            border: '1px solid #1e2d4a',
            color: 'grey.200',
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#1e2d4a',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#1e2d4a',
              color: 'grey.400',
            },
            '& .MuiDataGrid-virtualScroller': {
              overflowX: 'auto',
            },
          }}
        />
      )}

      {!showGrid && !hasSearchResults && !searchLoading && displayData.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4, color: 'grey.500' }}>
          <Typography>No data available.</Typography>
        </Box>
      )}
    </Box>
  );
};

export default UserCaptures;