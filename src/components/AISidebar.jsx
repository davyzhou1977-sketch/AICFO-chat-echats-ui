import React, { useRef, useEffect, useState } from 'react';
import { Drawer, Button, Input, List, Avatar, Space, Typography } from 'antd';
import { MessageOutlined, SendOutlined, LoadingOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Text } = Typography;
const BASE_URL = 'https://api.x.ant.design/api/big_model_glm-4.5-flash';
// const MODEL = 'glm-4.5-flash';
const MODEL = 'THUDM/glm-4-9b-chat';

const AISidebar = ({ visible, onClose }) => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([
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
  ]);
  const [isRequesting, setIsRequesting] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (inputValue.trim() && !isRequesting) {
      const userMessage = {
        id: Date.now().toString(),
        message: { role: 'user', content: inputValue },
        status: 'success',
      };

      const loadingMessage = {
        id: (Date.now() + 1).toString(),
        message: { role: 'assistant', content: '' },
        status: 'loading',
      };

      setMessages(prev => [...prev, userMessage, loadingMessage]);
      setIsRequesting(true);
      setInputValue('');

      try {
        const response = await fetch(BASE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            frequency_penalty: 0,
            max_tokens: 1024,
            model: MODEL,
            messages: [
              ...messages.map(msg => msg.message),
              { role: 'user', content: inputValue }
            ],
            stream: true,
            thinking: { type: "disabled" }
          }),
        });

        if (!response.ok) {
          throw new Error(`API response error: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedContent = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.substring(6);
              if (dataStr === '[DONE]') {
                break;
              }
              try {
                const data = JSON.parse(dataStr);
                if (data.choices && data.choices[0] && data.choices[0].delta) {
                  const delta = data.choices[0].delta;
                  if (delta.content) {
                    accumulatedContent += delta.content;
                    // 更新UI，显示累积的内容
                    setMessages(prev => {
                      const newMessages = [...prev];
                      newMessages[newMessages.length - 1] = {
                        ...newMessages[newMessages.length - 1],
                        message: {
                          role: 'assistant',
                          content: accumulatedContent
                        },
                        status: 'updating'
                      };
                      return newMessages;
                    });
                  }
                }
              } catch (e) {
                console.error('Error parsing stream data:', e);
              }
            }
          }
        }

        // 流式结束，更新状态为success
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            ...newMessages[newMessages.length - 1],
            status: 'success'
          };
          return newMessages;
        });
      } catch (error) {
        console.error('Error calling AI API:', error);
        const errorMessage = {
          id: (Date.now() + 1).toString(),
          message: {
            role: 'assistant',
            content: '抱歉，API调用失败，请稍后重试。'
          },
          status: 'error',
        };

        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = errorMessage;
          return newMessages;
        });
      } finally {
        setIsRequesting(false);
      }
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
        {formattedMessages.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              marginBottom: '16px',
              flexDirection: item.type === 'user' ? 'row-reverse' : 'row'
            }}
          >
            <div style={{ margin: '0 8px' }}>
              <Avatar
                icon={item.type === 'ai' ? <MessageOutlined /> : null}
                style={{
                  backgroundColor: item.type === 'user' ? '#1890ff' : '#8c8c8c',
                  color: '#fff'
                }}
              >
                {item.type === 'user' ? '我' : 'AI'}
              </Avatar>
            </div>
            <div style={{ flex: 1, maxWidth: '75%' }}>
              <Text style={{
                marginBottom: 4,
                display: 'block',
                textAlign: item.type === 'user' ? 'right' : 'left'
              }}>
                {item.type === 'user' ? '我' : 'AI'}
              </Text>
              <div
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: item.type === 'user' ? '#e6f7ff' : '#f5f5f5',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                  borderTopLeftRadius: item.type === 'user' ? '8px' : '0',
                  borderTopRightRadius: item.type === 'user' ? '0' : '8px'
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
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ padding: '16px', borderTop: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', width: '100%', gap: '8px', alignItems: 'center' }}>
          <TextArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="请输入您的问题..."
            onPressEnter={handleSend}
            style={{ flex: 1, resize: 'none', height: '40px' }}
            rows={1}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            disabled={isRequesting}
            style={{ height: '40px', minWidth: '80px' }}
          >
            发送
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default AISidebar;