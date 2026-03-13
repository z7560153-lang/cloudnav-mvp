// api/deepseek.js
export default async function handler(req, res) {
    // 只允许 POST 请求
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 从前端接收聊天记录和设定的角色提示词 (System Prompt)
    const { messages } = req.body;

    try {
        // 请求 DeepSeek 官方接口
        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}` // 这里的秘钥我们稍后在 Vercel 网页上配置，绝不写死在代码里！
            },
            body: JSON.stringify({
                model: 'deepseek-chat', // 使用 DeepSeek 的通用模型
                messages: messages,
                temperature: 0.7
            })
        });

        const data = await response.json();
        
        // 把 DeepSeek 的回答返回给前端
        res.status(200).json({ text: data.choices[0].message.content });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'AI 请求失败' });
    }
}
