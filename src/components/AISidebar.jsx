import React, { useRef, useEffect, useState } from 'react';
import { Drawer, Button, Input, List, Avatar, Space, Typography } from 'antd';
import { MessageOutlined, SendOutlined, LoadingOutlined } from '@ant-design/icons';
import { XRequest, OpenAIChatProvider, useXChat } from '@ant-design/x-sdk';

const { TextArea } = Input;
const { Text } = Typography;
const BASE_URL = 'https://api.x.ant.design/api/big_model_glm-4.5-flash'
const MODEL = 'THUDM/glm-4-9b-chat';
const AISidebar = ({ visible, onClose }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  // 创建 DefaultChatProvider
  const [provider] = useState(
    new OpenAIChatProvider({
      request: XRequest(BASE_URL, {
        manual: true,
        params: {
          model: MODEL,
          stream: true,
        },
      }),
    }),
  );

  // 使用 useXChat
  const {
    onRequest,
    messages,
    isRequesting,
  } = useXChat({
    provider,
    defaultMessages: [
      {
        id: '1',
        message: { role: 'user', content: '你好' },
        status: 'success',
      },
      {
        id: '2',
        message: { role: 'assistant', content: '你好！我是智能AI助手，有什么可以帮您的吗？' },
        status: 'success',
      },
    ],
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim() && !isRequesting) {
      onRequest({
        messages: [
          {
            role: 'user',
            content: inputValue,
          },
        ],
        frequency_penalty: 0,
        max_tokens: 1024,
        thinking: {
          type: 'disabled',
        },
      });
      setInputValue('');
    }
  };

  // 转换消息格式
  const formattedMessages = messages.map(msg => {
    const messageData = msg.message || msg;
    return {
      id: msg.id,
      content: messageData.content,
      type: messageData.role === 'user' ? 'user' : 'ai',
      loading: msg.status === 'loading' || msg.status === 'updating',
    };
  });

  return (
    <Drawer
      title="智能AI问答"
      placement="right"
      width={400}
      onClose={onClose}
      visible={visible}
      bodyStyle={{
        display: 'flex',
        flexDirection: 'column',
        padding: 0
      }}
    >
      <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        <List
          dataSource={formattedMessages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={(item) => (
            <List.Item style={{ padding: '8px 0' }}>
              <List.Item.Meta
                avatar={
                  <Avatar icon={item.type === 'ai' ? <MessageOutlined /> : null}>
                    {item.type === 'user' ? '我' : 'AI'}
                  </Avatar>
                }
                title={
                  <Text style={{ marginBottom: 8, display: 'block' }}>
                    {item.type === 'user' ? '我' : 'AI'}
                  </Text>
                }
                description={
                  <div
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: item.type === 'user' ? '#e6f7ff' : '#f5f5f5',
                      maxWidth: '80%',
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {item.loading ? (
                      <Space>
                        <LoadingOutlined />
                        <span style={{ color: '#999' }}>AI 正在思考...</span>
                      </Space>
                    ) : (
                      item.content
                    )}
                  </div>
                }
              />
            </List.Item>
          )}
        />
        <div ref={messagesEndRef} />
      </div>
      <div style={{ padding: '16px', borderTop: '1px solid #f0f0f0' }}>
        <Space style={{ width: '100%' }}>
          <TextArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="请输入您的问题..."
            onPressEnter={handleSend}
            style={{ flex: 1, resize: 'none' }}
          />
          <Button type="primary" icon={<SendOutlined />} onClick={handleSend} disabled={isRequesting}>
            发送
          </Button>
        </Space>
      </div>
    </Drawer>
  );
};

export default AISidebar;