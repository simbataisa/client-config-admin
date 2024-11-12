// src/components/ClientConfigDashboard.tsx
import React, { useState, useEffect } from 'react';
import {
    Table,
    Card,
    Button,
    Input,
    Select,
    Space,
    Tag,
    Modal,
    Form,
    message,
    Row,
    Col,
    Tooltip,
    Typography,
} from 'antd';
import {
    PlusOutlined,
    ReloadOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    SyncOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    CopyOutlined,
} from '@ant-design/icons';
import { ClientConfig, ClientConfigCreateDto } from '../types/clientConfig';
import { clientConfigApi } from '../api/clientConfigApi';

const { Option } = Select;

interface SecureField {
    id: number;
    field: 'client_secret_key' | 'client_access_token' | 'client_shared_key';
    visible: boolean;
}

const ClientConfigDashboard: React.FC = () => {
    const [configs, setConfigs] = useState<ClientConfig[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingConfig, setEditingConfig] = useState<ClientConfig | null>(null);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [visibleFields, setVisibleFields] = useState<SecureField[]>([]);

    const toggleFieldVisibility = (configId: number, field: SecureField['field']) => {
        setVisibleFields(prev => {
            const existingField = prev.find(f => f.id === configId && f.field === field);
            if (existingField) {
                return prev.map(f =>
                    f.id === configId && f.field === field
                        ? { ...f, visible: !f.visible }
                        : f
                );
            }
            return [...prev, { id: configId, field, visible: true }];
        });
    };

    const isFieldVisible = (configId: number, field: SecureField['field']) => {
        return visibleFields.find(f => f.id === configId && f.field === field)?.visible || false;
    };

    const copyToClipboard = async (text: string, fieldName: string) => {
        try {
            await navigator.clipboard.writeText(text);
            message.success(`${fieldName} copied to clipboard`);
        } catch (err) {
            message.error('Failed to copy text');
        }
    };

    const maskSensitiveData = (text: string) => {
        return '•'.repeat(text.length);
    };

    // Function to truncate masked data
    const truncateMaskedData = (text: string, visibleChars: number = 8) => {
        if (text.length <= visibleChars * 2) return '•'.repeat(text.length);
        return `${'•'.repeat(visibleChars)}....${'•'.repeat(visibleChars)}`;
    };

    const renderSecureField = (text: string, record: ClientConfig, field: SecureField['field']) => {
        const isVisible = isFieldVisible(record.id, field);
        let displayText = '';

        if (isVisible) {
            // Show first 8 and last 8 characters when visible
            displayText = text.length > 16
                ? `${text.slice(0, 8)}....${text.slice(-8)}`
                : text;
        } else {
            displayText = truncateMaskedData(text);
        }

        return (
            <Space size="small">
                <div style={{
                    fontFamily: 'monospace',
                    maxWidth: '200px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}>
                    {displayText}
                </div>
                <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                    <Tooltip title={isVisible ? "Hide" : "Show"}>
                        <Button
                            type="text"
                            size="small"
                            icon={isVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                            onClick={() => toggleFieldVisibility(record.id, field)}
                        />
                    </Tooltip>
                    <Tooltip title="Copy full value">
                        <Button
                            type="text"
                            size="small"
                            icon={<CopyOutlined />}
                            onClick={() => copyToClipboard(text, field)}
                            disabled={!isVisible}
                        />
                    </Tooltip>
                </div>
            </Space>
        );
    };

    const fetchConfigs = async () => {
        try {
            setLoading(true);
            const data = await clientConfigApi.getConfigs({
                status: statusFilter || undefined,
                search: searchText || undefined,
            });
            setConfigs(data);
        } catch (error) {
            message.error('Failed to fetch configurations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchConfigs();
        }, 300);

        return () => clearTimeout(timer);
    }, [searchText, statusFilter]);

    const handleEdit = (config: ClientConfig) => {
        setEditingConfig(config);
        form.setFieldsValue(config);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this configuration?',
            content: 'This action cannot be undone.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await clientConfigApi.deleteConfig(id);
                    message.success('Configuration deleted successfully');
                    fetchConfigs();
                } catch (error) {
                    message.error('Failed to delete configuration');
                }
            },
        });
    };

    const handleRotateKeys = async (id: number) => {
        try {
            await clientConfigApi.rotateKeys(id);
            message.success('Keys rotated successfully');
            fetchConfigs();
        } catch (error) {
            message.error('Failed to rotate keys');
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            if (editingConfig) {
                await clientConfigApi.updateConfig(editingConfig.id, values);
                message.success('Configuration updated successfully');
            } else {
                await clientConfigApi.createConfig(values);
                message.success('Configuration created successfully');
            }
            setIsModalOpen(false);
            form.resetFields();
            setEditingConfig(null);
            fetchConfigs();
        } catch (error) {
            message.error('Operation failed');
        }
    };

    const columns = [
        {
            title: 'Client ID',
            dataIndex: 'client_id',
            key: 'client_id',
            width: 150,
            ellipsis: true,
            fixed: 'left',
        },
        {
            title: 'Secret Key',
            dataIndex: 'client_secret_key',
            key: 'client_secret_key',
            width: 300,
            ellipsis: true,
            render: (text: string, record: ClientConfig) =>
                renderSecureField(text, record, 'client_secret_key'),
        },
        {
            title: 'Access Token',
            dataIndex: 'client_access_token',
            key: 'client_access_token',
            width: 300,
            ellipsis: true,
            render: (text: string, record: ClientConfig) =>
                renderSecureField(text, record, 'client_access_token'),
        },
        {
            title: 'Shared Key',
            dataIndex: 'client_shared_key',
            key: 'client_shared_key',
            width: 300,
            ellipsis: true,
            render: (text: string, record: ClientConfig) =>
                renderSecureField(text, record, 'client_shared_key'),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            fixed: 'right',
            render: (status: string) => (
                <Tag color={
                    status === 'ACTIVE' ? 'success' :
                        status === 'INACTIVE' ? 'error' :
                            'warning'
                }>
                    {status}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 150,
            fixed: 'right',
            render: (_: any, record: ClientConfig) => (
                <Space size="small">
                    <Tooltip title="Edit">
                        <Button
                            type="text"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Rotate Keys">
                        <Button
                            type="text"
                            size="small"
                            icon={<SyncOutlined />}
                            onClick={() => handleRotateKeys(record.id)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button
                            type="text"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(record.id)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            <Card title="Client Configurations">
                <Row gutter={[16, 16]} className="mb-4">
                    <Col span={8}>
                        <Input
                            placeholder="Search by Client ID"
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </Col>
                    <Col span={6}>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Filter by Status"
                            value={statusFilter}
                            onChange={setStatusFilter}
                            allowClear
                        >
                            <Option value="ACTIVE">Active</Option>
                            <Option value="INACTIVE">Inactive</Option>
                            <Option value="PENDING">Pending</Option>
                        </Select>
                    </Col>
                    <Col span={10} style={{ textAlign: 'right' }}>
                        <Space>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => {
                                    setEditingConfig(null);
                                    form.resetFields();
                                    setIsModalOpen(true);
                                }}
                            >
                                New Configuration
                            </Button>
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={() => fetchConfigs()}
                            >
                                Refresh
                            </Button>
                        </Space>
                    </Col>
                </Row>

                <Table
                    columns={columns}
                    dataSource={configs}
                    loading={loading}
                    rowKey="id"
                    scroll={{ x: 1500 }}
                    pagination={{
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} items`,
                    }}
                />

                <Modal
                    title={editingConfig ? "Edit Configuration" : "Create New Configuration"}
                    open={isModalOpen}
                    onCancel={() => {
                        setIsModalOpen(false);
                        setEditingConfig(null);
                        form.resetFields();
                    }}
                    footer={null}
                    width={800}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                    >
                        <Form.Item
                            name="client_id"
                            label="Client ID"
                            rules={[{ required: true, message: 'Please input client ID' }]}
                        >
                            <Input />
                        </Form.Item>

                        {editingConfig && (
                            <>
                                <Form.Item
                                    name="client_secret_key"
                                    label="Client Secret Key"
                                >
                                    <Input.Password />
                                </Form.Item>

                                <Form.Item
                                    name="client_access_token"
                                    label="Client Access Token"
                                >
                                    <Input.Password />
                                </Form.Item>

                                <Form.Item
                                    name="client_shared_key"
                                    label="Client Shared Key"
                                >
                                    <Input.Password />
                                </Form.Item>
                            </>
                        )}

                        <Form.Item
                            name="status"
                            label="Status"
                            rules={[{ required: true, message: 'Please select status' }]}
                        >
                            <Select>
                                <Option value="ACTIVE">Active</Option>
                                <Option value="INACTIVE">Inactive</Option>
                                <Option value="PENDING">Pending</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item>
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    {editingConfig ? 'Update' : 'Create'}
                                </Button>
                                <Button onClick={() => {
                                    setIsModalOpen(false);
                                    setEditingConfig(null);
                                    form.resetFields();
                                }}>
                                    Cancel
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Modal>
            </Card>
        </div>
    );
};

export default ClientConfigDashboard;