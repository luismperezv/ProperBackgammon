import { useState, useEffect } from 'react';
import { SpeedDial, SpeedDialAction } from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import BugReportIcon from '@mui/icons-material/BugReport';
import MemoryIcon from '@mui/icons-material/Memory';
import StorageIcon from '@mui/icons-material/Storage';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SaveIcon from '@mui/icons-material/Save';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import axios from 'axios';
import { useGameStore } from '../../store/gameStore';
import { DEBUG_STATE, INITIAL_POSITION } from '../../constants/game';
import { saveCurrentState } from '../../utils/debugStorage';
import SavedStatesDialog from './SavedStatesDialog';

// Create an axios instance for monitoring with proper base URL
const monitoredAxios = axios.create({
  // In development, use relative URLs to leverage Vite's proxy
  baseURL: '',  
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Keep track of recent requests
const requestHistory: any[] = [];

// Intercept requests
monitoredAxios.interceptors.request.use(
  (config) => {
    const request = {
      timestamp: new Date(),
      method: config.method,
      url: config.url,
      headers: config.headers,
      data: config.data,
    };
    requestHistory.push({ ...request, status: 'pending' });
    return config;
  },
  (error) => {
    requestHistory.push({
      timestamp: new Date(),
      error: error,
      status: 'error',
    });
    return Promise.reject(error);
  }
);

// Intercept responses
monitoredAxios.interceptors.response.use(
  (response) => {
    const request = requestHistory.find(
      (req) => req.url === response.config.url && req.status === 'pending'
    );
    if (request) {
      request.status = 'success';
      request.response = {
        status: response.status,
        data: response.data,
        headers: response.headers,
      };
    }
    return response;
  },
  (error) => {
    const request = requestHistory.find(
      (req) => req.url === error.config?.url && req.status === 'pending'
    );
    if (request) {
      request.status = 'error';
      request.error = {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: error.stack,
        config: {
          baseURL: error.config?.baseURL,
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          timeout: error.config?.timeout,
        }
      };
    }
    return Promise.reject(error);
  }
);

const checkEndpoint = async (endpoint: string, method: string = 'GET') => {
  try {
    console.group(`Testing ${method} ${endpoint}`);
    const startTime = performance.now();
    const response = await monitoredAxios({ method, url: endpoint });
    const endTime = performance.now();
    
    console.log('Status:', response.status);
    console.log('Response Time:', Math.round(endTime - startTime), 'ms');
    console.log('Response Headers:', response.headers);
    console.log('Response Data:', response.data);
    console.groupEnd();
    return true;
  } catch (error: any) {
    console.group(`❌ Error testing ${method} ${endpoint}`);
    console.log('Error Type:', error.name);
    console.log('Error Message:', error.message);
    console.log('Status Code:', error.response?.status);
    console.log('Response Data:', error.response?.data);
    console.log('Request Config:', {
      baseURL: error.config?.baseURL,
      url: error.config?.url,
      method: error.config?.method,
      headers: error.config?.headers
    });
    console.groupEnd();
    return false;
  }
};

export const DebugTools = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [networkStatus, setNetworkStatus] = useState<boolean>(navigator.onLine);
  const [isSavedStatesOpen, setIsSavedStatesOpen] = useState(false);
  const updateGameState = useGameStore(state => state.updateGameState);
  const startMatch = useGameStore(state => state.startMatch);
  const gameState = useGameStore(state => state.gameState);

  useEffect(() => {
    const handleOnline = () => setNetworkStatus(true);
    const handleOffline = () => setNetworkStatus(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const debugActions = [
    {
      icon: <SaveIcon />,
      name: 'Save Current State',
      action: () => {
        saveCurrentState(gameState);
        console.log('Game state saved successfully');
      }
    },
    {
      icon: <FolderOpenIcon />,
      name: 'Load Saved State',
      action: () => {
        setIsSavedStatesOpen(true);
      }
    },
    { 
      icon: <BugReportIcon />, 
      name: 'Debug Console', 
      action: () => {
        console.group('Debug Console');
        console.log('Current Route:', window.location.pathname);
        console.log('Local Storage:', { ...localStorage });
        console.log('Session Storage:', { ...sessionStorage });
        console.groupEnd();
      } 
    },
    { 
      icon: <MemoryIcon />, 
      name: 'State Inspector', 
      action: () => {
        console.group('State Inspector');
        console.log('Window Size:', {
          width: window.innerWidth,
          height: window.innerHeight
        });
        console.log('Device Pixel Ratio:', window.devicePixelRatio);
        console.log('User Agent:', navigator.userAgent);
        console.groupEnd();
      } 
    },
    {
      icon: <NetworkCheckIcon />,
      name: 'Network Debug',
      action: async () => {
        console.group('🔍 Network Diagnostics');
        
        // Basic network status
        console.group('1. Network Status');
        console.log('Online Status:', networkStatus ? '🟢 Online' : '🔴 Offline');
        console.log('Network Information:', {
          type: (navigator as any).connection?.type,
          effectiveType: (navigator as any).connection?.effectiveType,
          downlink: (navigator as any).connection?.downlink,
          rtt: (navigator as any).connection?.rtt,
        });
        console.groupEnd();

        // Backend connectivity tests
        console.group('2. Backend Connectivity Tests');
        
        // Test different endpoints
        const endpoints = [
          { url: '/api', method: 'GET' },
          { url: '/api/health', method: 'GET' },
          { url: '/api/game', method: 'GET' }
        ];

        for (const endpoint of endpoints) {
          await checkEndpoint(endpoint.url, endpoint.method);
        }

        console.groupEnd();

        // Request history
        console.group('3. Recent Request History');
        console.table(requestHistory.map(req => ({
          timestamp: req.timestamp,
          method: req.method,
          url: req.url,
          status: req.status,
          error: req.error ? `${req.error.name}: ${req.error.message}` : undefined
        })));
        console.groupEnd();

        // CORS check
        console.group('4. CORS Status');
        try {
          const response = await fetch(monitoredAxios.defaults.baseURL + '/api/health', {
            method: 'OPTIONS'
          });
          console.log('CORS Headers:', {
            'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
            'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
            'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
          });
        } catch (error) {
          console.log('❌ CORS Check Failed:', error);
        }
        console.groupEnd();

        console.groupEnd(); // End Network Diagnostics
      }
    },
    { 
      icon: <StorageIcon />, 
      name: 'Data Explorer', 
      action: () => {
        console.group('Data Explorer');
        console.log('Performance Metrics:', performance.memory);
        console.log('Network Information:', (navigator as any).connection);
        console.groupEnd();
      } 
    },
    {
      icon: <SportsEsportsIcon />,
      name: 'Empty Board (000000)',
      action: () => {
        console.group('Game Debug Tools - Empty Board');
        
        // Set up debug game state
        console.log('Setting up empty board state (000000)...');
        startMatch(5, { // 5-point match
          isCrawfordRule: true,
          isJacobyRule: true,
          automaticDoubles: true,
          maximumCube: 64
        });
        updateGameState(DEBUG_STATE);
        
        console.log('Current Game State:', DEBUG_STATE);
        console.log('Debug state set successfully!');
        console.log('Board is now completely empty.');
        
        console.groupEnd();
      }
    },
    {
      icon: <RestartAltIcon />,
      name: 'Initial Position',
      action: () => {
        console.group('Game Debug Tools - Initial Position');
        
        // Set up initial game state
        console.log('Setting up initial game position...');
        startMatch(5, { // 5-point match
          isCrawfordRule: true,
          isJacobyRule: true,
          automaticDoubles: true,
          maximumCube: 64
        });
        updateGameState(INITIAL_POSITION);
        
        console.log('Current Game State:', INITIAL_POSITION);
        console.log('Initial position set successfully!');
        console.log('Board is now in starting position.');
        
        console.groupEnd();
      }
    },
  ];

  return (
    <>
      <SpeedDial
        ariaLabel="Debug Tools"
        sx={{ 
          position: 'fixed', 
          bottom: 16, 
          right: 16,
          '& .MuiFab-primary': {
            bgcolor: networkStatus ? 'warning.main' : 'error.main',
            '&:hover': {
              bgcolor: networkStatus ? 'warning.dark' : 'error.dark',
            }
          }
        }}
        icon={<BuildIcon />}
        open={isOpen}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
      >
        {debugActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => {
              action.action();
              setIsOpen(false);
            }}
          />
        ))}
      </SpeedDial>

      <SavedStatesDialog
        open={isSavedStatesOpen}
        onClose={() => setIsSavedStatesOpen(false)}
        onLoadState={(state) => {
          updateGameState(state);
          console.log('Loaded saved state:', state);
        }}
      />
    </>
  );
}; 