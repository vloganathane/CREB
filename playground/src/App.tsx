import { useState } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Chip,
  Box,
  IconButton,
  useMediaQuery,
  Drawer,
  Fab,
} from '@mui/material';
import {
  Science as ScienceIcon,
  BugReport as BugIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import ExamplesGalleryMUI from './components/ExamplesGalleryMUI';
import ResizableLayout from './components/ResizableLayout';
import { examples } from './examples';

// Dynamic theme creation for dark/light mode
const createAppTheme = (darkMode: boolean) => createTheme({
  palette: {
    mode: darkMode ? 'dark' : 'light',
    primary: {
      main: '#2196f3', // Blue for chemistry
    },
    secondary: {
      main: '#ff9800', // Orange for reactions
    },
    background: {
      default: darkMode ? '#0a0a0a' : '#f5f5f5',
      paper: darkMode ? '#1e1e1e' : '#ffffff',
    },
    success: {
      main: '#4caf50',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

function App() {
  const [currentCode, setCurrentCode] = useState(examples[0].code);
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Check if screen is mobile
  const isMobile = useMediaQuery('(max-width:900px)');
  const theme = createAppTheme(darkMode);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, minHeight: '100vh' }}>
        {/* App Bar */}
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <ScienceIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              CREB-JS Playground
            </Typography>
            
            {/* Desktop view - show description */}
            {!isMobile && (
              <Typography variant="body2" sx={{ mr: 2, opacity: 0.8 }}>
                Interactive Chemical Computation Platform
              </Typography>
            )}
            
            {/* Dark mode toggle */}
            <IconButton
              color="inherit"
              onClick={toggleDarkMode}
              sx={{ mr: 1 }}
            >
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            
            <Chip
              icon={<BugIcon />}
              label="Material UI + Sandpack"
              color="secondary"
              variant="outlined"
              size="small"
            />
            
            {/* Mobile menu button */}
            {isMobile && (
              <IconButton
                color="inherit"
                onClick={toggleSidebar}
                sx={{ ml: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>

        {/* Main Layout */}
        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden', height: 'calc(100vh - 64px)' }}>
          {/* Desktop Sidebar */}
          {!isMobile && (
            <Box
              sx={{
                width: 300,
                minWidth: 300,
                borderRight: 1,
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <ExamplesGalleryMUI
                onLoadExample={(code: string) => {
                  setCurrentCode(code);
                }}
              />
            </Box>
          )}

          {/* Mobile Drawer */}
          {isMobile && (
            <Drawer
              anchor="left"
              open={sidebarOpen}
              onClose={toggleSidebar}
              ModalProps={{
                keepMounted: true, // Better performance on mobile
              }}
              sx={{
                '& .MuiDrawer-paper': {
                  width: 280,
                  maxWidth: '80vw',
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    borderBottom: 1,
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="h6">Examples</Typography>
                  <IconButton onClick={toggleSidebar}>
                    <CloseIcon />
                  </IconButton>
                </Box>
                <ExamplesGalleryMUI
                  onLoadExample={(code: string) => {
                    setCurrentCode(code);
                    toggleSidebar(); // Auto-close on mobile after selection
                  }}
                />
              </Box>
            </Drawer>
          )}

          {/* Main Content Area */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Enhanced Resizable Layout */}
            <ResizableLayout
              code={currentCode}
              onCodeChange={setCurrentCode}
              theme={darkMode ? 'dark' : 'light'}
              title="CREB-JS Enhanced Chemistry Playground"
            />
          </Box>
        </Box>

        {/* Mobile FAB for quick access */}
        {isMobile && !sidebarOpen && (
          <Fab
            color="primary"
            sx={{
              position: 'fixed',
              bottom: 16,
              left: 16,
            }}
            onClick={toggleSidebar}
          >
            <MenuIcon />
          </Fab>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
