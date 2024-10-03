import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');
    const [code, setCode] = useState('');
    const [subscription, setSubscription] = useState(null);

    const sendMessage = async () => {
        try {
            const res = await axios.post('/api/chat', { message });
            setResponse(res.data.choices[0].message.content);
        } catch (error) {
            console.error(error);
        }
    };

    const verifyCode = async () => {
        try {
            const res = await axios.post('/api/verify-code', { code, telegramId: 'your_telegram_id' });
            if (res.data.success) {
                setSubscription(res.data.subscription);
            } else {
                alert(res.data.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="app">
            <h1>MMU PIRATES</h1>
            {subscription ? (
                <div className="chat-container">
                    <div className="messages">
                        <p><strong>Вы:</strong> {message}</p>
                        <p><strong>MMU PIRATES:</strong> {response}</p>
                    </div>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Введите ваш вопрос..."
                    />
                    <button onClick={sendMessage}>Отправить</button>
                </div>
            ) : (
                <div className="subscription">
                    <h2>Введите код подписки</h2>
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Введите код..."
                    />
                    <button onClick={verifyCode}>Подтвердить</button>
                </div>
            )}
        </div>
    );
}

export default App;