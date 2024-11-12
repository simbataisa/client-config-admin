import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import ClientConfigDashboard from './components/ClientConfigDashboard';
import { ConfigProvider } from 'antd';

// You can customize the theme here
const theme = {
    token: {
        colorPrimary: '#1890ff',
        borderRadius: 4,
    },
};

const App = () => {
    return (
        <ConfigProvider theme={theme}>
            <Router>
                <AppLayout>
                    <Routes>
                        <Route path="/" element={<Navigate to="/client-configs" replace />} />
                        <Route path="/client-configs" element={<ClientConfigDashboard />} />
                        {/* Add more routes as needed */}
                        <Route path="*" element={<Navigate to="/client-configs" replace />} />
                    </Routes>
                </AppLayout>
            </Router>
        </ConfigProvider>
    );
};

export default App;