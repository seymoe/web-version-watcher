# web-version-watcher

一个轻量级的Web应用版本监控工具，使用ETag/Last-Modified头信息自动检测应用更新。

简体中文 | [English](./README.md)

## 特性

- 🔄 自动检测应用更新
- 🚀 零依赖
- 💡 可自定义通知内容和样式
- 🌐 支持ETag和Last-Modified头信息
- 🔧 可配置检查间隔
- 📱 响应式通知UI

## 安装

```bash
npm install web-version-watcher
```

或

```bash
yarn add web-version-watcher
```

## 使用方法

```javascript
import VersionWatcher from 'web-version-watcher';

// 创建实例
const watcher = new VersionWatcher({
  // 可选配置
  checkInterval: 60000, // 检查间隔，默认60秒
  messages: {
    title: '发现新版本',
    message: '应用有新版本可用',
    buttonText: '立即刷新'
  }
});

// 开始监控
watcher.start();

// 停止监控（如果需要）
// watcher.stop();
```

## 配置选项

### WatcherOptions

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| checkInterval | number | 60000 | 检查更新的时间间隔（毫秒） |
| messages.title | string | 'New Version Available' | 通知标题 |
| messages.message | string | 'A new version of the application is available.' | 通知内容 |
| messages.buttonText | string | 'Refresh' | 刷新按钮文本 |
| disableInLocalhost | boolean | true | 设置为true时，在localhost环境下禁用版本检查 |

## 工作原理

web-version-watcher 通过定期检查页面的 ETag 或 Last-Modified 头信息来检测应用是否有更新。当检测到更新时，会在页面右下角显示一个通知，用户可以选择立即刷新页面或稍后再说。

## 本地开发

### 环境设置

1. 克隆仓库并安装依赖：
```bash
git clone <repository-url>
cd web-version-watcher
npm install
```

2. 启动开发构建（监听文件变化）：
```bash
npm run dev
```

### 运行示例

1. 首先构建项目：
```bash
npm run build
```

2. 启动本地服务器：
```bash
npm run serve:example
```

3. 在浏览器中访问：
```
http://localhost:3000/examples/basic/
```

### 测试不同场景

1. **测试版本更新**：
   - 在浏览器中打开示例页面
   - 修改 `examples/basic/index.html`（例如，更改一些文本）
   - 保存文件
   - 等待检查间隔时间（默认：60秒）
   - 你应该会看到更新通知

2. **测试自定义消息**：
   ```javascript
   const watcher = new VersionWatcher({
     messages: {
       title: '自定义标题',
       message: '自定义消息',
       buttonText: '自定义按钮文本'
     }
   });
   ```

3. **测试不同的检查间隔**：
   ```javascript
   const watcher = new VersionWatcher({
     checkInterval: 10000, // 10秒
   });
   ```

4. **本地环境行为**：
   - 默认情况下，在localhost环境中禁用版本检查
   - 这可以防止在本地开发时出现不必要的通知
   - 要在localhost中启用版本检查：
     ```javascript
     const watcher = new VersionWatcher({
       disableInLocalhost: false // 在localhost中启用版本检查
     });
     ```

5. **测试错误处理**：
   - 尝试断开网络连接
   - 测试无效的响应头
   - 查看控制台的错误信息

## 浏览器兼容性

支持所有现代浏览器，包括：

- Chrome
- Firefox
- Safari
- Edge

## 贡献指南

1. Fork 这个仓库
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的修改 (`git commit -m '添加一些很棒的特性'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启一个 Pull Request

## 许可证

MIT

查看 [LICENSE](./LICENSE) 文件了解更多详情。
