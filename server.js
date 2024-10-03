const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
app.use(bodyParser.json());

// Подключение к MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Модель пользователя
const UserSchema = new mongoose.Schema({
    telegramId: String,
    subscription: String, // 'monthly' or 'yearly'
    code: String,
});
const User = mongoose.model('User', UserSchema);

// Эндпоинт для обработки запросов к OpenAI
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-4",
            messages: [{ role: "user", content: message }],
        }, {
            headers: {
                'Authorization': Bearer ${process.env.OPENAI_API_KEY},
                'Content-Type': 'application/json',
            },
        });

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка сервера');
    }
});

// Эндпоинт для проверки кода подписки
app.post('/api/verify-code', async (req, res) => {
    const { code, telegramId } = req.body;

    // Здесь реализуйте логику проверки кода из вашей базы данных
    // Например:
    const user = await User.findOne({ code: code });

    if (user) {
        user.telegramId = telegramId;
        // Установите тип подписки в зависимости от кода
        user.subscription = code.startsWith('M') ? 'monthly' : 'yearly';
        await user.save();
        res.json({ success: true, subscription: user.subscription });
    } else {
        res.json({ success: false, message: 'Неверный код' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
