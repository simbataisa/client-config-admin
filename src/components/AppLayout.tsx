import React from 'react';
import { Layout, Menu } from 'antd';
import {
    DashboardOutlined,
    SettingOutlined,
    TeamOutlined,
    KeyOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider theme="light" width={250}>
                <div style={{ padding: 16, textAlign: 'center' }}>
                    <h1>Admin Portal</h1>
                </div>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={[
                        {
                            key: '1',
                            icon: <DashboardOutlined />,
                            label: 'Dashboard',
                        },
                        {
                            key: '2',
                            icon: <KeyOutlined />,
                            label: 'Client Configs',
                        },
                        {
                            key: '3',
                            icon: <TeamOutlined />,
                            label: 'Users',
                        },
                        {
                            key: '4',
                            icon: <SettingOutlined />,
                            label: 'Settings',
                        },
                    ]}
                />
            </Sider>
            <Layout>
                <Header style={{ background: '#fff', padding: '0 16px' }}>
                    <h2>Client Configurations</h2>
                </Header>
                <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default AppLayout;