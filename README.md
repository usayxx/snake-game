# 🐍 贪吃蛇游戏 - 自定义蛇头

一个可上传自定义蛇头图片的贪吃蛇游戏，支持PC和手机双端操作。

## ✨ 功能特点

- 📷 **自定义蛇头** - 上传任意图片作为蛇头
- 🖥️ **PC控制** - 使用方向键或WASD控制
- 📱 **手机控制** - 方向按钮或滑动屏幕控制
- 🎯 **分数系统** - 实时显示分数和蛇长度
- 🎨 **精美UI** - 现代化界面设计

## 🚀 快速开始

### 本地运行

直接在浏览器中打开 `index.html` 即可开始游戏。

或者使用HTTP服务器：

```bash
# 使用Python
python -m http.server 8000

# 使用Node.js
npx serve .

# 然后访问 http://localhost:8000
```

## 🎮 操作说明

### PC端
- **方向键** ↑↓←→ 控制方向
- **WASD** 键也可控制方向

### 手机端
- **方向按钮** 点击四个方向按钮控制
- **滑动屏幕** 在游戏区域滑动控制方向

## 📁 项目结构

```
├── index.html      # 游戏主页面
├── snake.js        # 游戏核心逻辑
├── style.css       # 样式文件
└── .github/
    └── workflows/
        └── deploy.yml  # GitHub Pages 部署配置
```

## 🌐 部署到 GitHub Pages

### 步骤

1. **创建GitHub仓库**
   - 访问 [GitHub](https://github.com/) 创建新仓库
   - 仓库名建议使用 `snake-game` 或类似名称

2. **上传文件**
   - 将以下文件上传到仓库：
     - `index.html`
     - `snake.js`
     - `style.css`
     - `.github/workflows/deploy.yml`

3. **启用GitHub Pages**
   - 进入仓库 → Settings → Pages
   - 在 Source 部分选择 `GitHub Actions`
   - 等待自动部署完成

4. **访问游戏**
   - 部署完成后访问 `https://<你的用户名>.github.io/<仓库名>/`

## 📝 License

MIT License