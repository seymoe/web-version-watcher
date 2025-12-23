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
| container.className | string | - | 自定义通知容器的CSS类名（会追加到默认类名后） |
| container.style | string | - | 自定义通知容器的样式字符串（会追加到默认样式后） |
| position | 'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right' | 'bottom-right' | 通知显示位置 |
| closable | boolean | true | 是否显示关闭按钮 |

## 工作原理

web-version-watcher 通过定期检查页面的 ETag 或 Last-Modified 头信息来检测应用是否有更新。当检测到更新时，会在页面指定位置（默认右下角）显示一个通知，用户可以选择立即刷新页面或稍后再说。

## 样式自定义

### CSS 变量

通知的所有样式都支持通过 CSS 变量进行自定义。所有变量都有默认值，你可以通过覆盖这些变量来定制通知的外观。

#### 容器变量

| 变量名 | 默认值 | 描述 |
|--------|--------|------|
| --wvw-background | white | 容器背景色 |
| --wvw-text-color | inherit | 容器文字颜色 |
| --wvw-border-radius | 4px | 容器圆角 |
| --wvw-padding | 16px | 容器内边距 |
| --wvw-box-shadow | 0 2px 12px 0 rgba(0,0,0,.1) | 容器阴影 |
| --wvw-width | 330px | 容器宽度 |
| --wvw-z-index | 9999 | 容器层级 |

#### 标题变量

| 变量名 | 默认值 | 描述 |
|--------|--------|------|
| --wvw-title-font-weight | bold | 标题字重 |
| --wvw-title-margin-bottom | 8px | 标题下边距 |
| --wvw-title-color | #333 | 标题颜色 |

#### 消息变量

| 变量名 | 默认值 | 描述 |
|--------|--------|------|
| --wvw-message-color | #666 | 消息文字颜色 |
| --wvw-message-margin-bottom | 12px | 消息下边距 |

#### 按钮变量

| 变量名 | 默认值 | 描述 |
|--------|--------|------|
| --wvw-button-bg | #225ED1 | 按钮背景色 |
| --wvw-button-color | white | 按钮文字颜色 |
| --wvw-button-padding | 8px 15px | 按钮内边距 |
| --wvw-button-border-radius | 3px | 按钮圆角 |
| --wvw-button-font-size | 12px | 按钮字体大小 |

#### 关闭按钮变量

| 变量名 | 默认值 | 描述 |
|--------|--------|------|
| --wvw-close-color | #909399 | 关闭按钮颜色 |
| --wvw-close-size | 16px | 关闭按钮大小 |

### 固定类名

所有通知元素都使用固定的类名，方便通过 CSS 选择器进行样式覆盖：

- `wvw_container` - 通知容器
- `wvw_title` - 标题
- `wvw_message` - 消息内容
- `wvw_button-container` - 按钮容器
- `wvw_button` - 刷新按钮
- `wvw_close-button` - 关闭按钮

### 样式自定义示例

#### 示例 1：通过 CSS 变量自定义

```css
/* 在你的 CSS 文件中 */
.wvw_container {
  --wvw-background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --wvw-text-color: white;
  --wvw-border-radius: 8px;
  --wvw-button-bg: #ff6b6b;
  --wvw-button-border-radius: 20px;
}

.wvw_title {
  font-size: 18px;
}
```

#### 示例 2：通过自定义类名和样式

```javascript
const watcher = new VersionWatcher({
  container: {
    className: 'my-custom-notification',
    style: 'border: 2px solid #3498db;'
  }
});
```

```css
/* 通过类名覆盖子元素样式 */
.my-custom-notification .wvw_button {
  background: #e74c3c !important;
  border-radius: 20px;
}
```

#### 示例 3：设置通知位置和关闭按钮

```javascript
const watcher = new VersionWatcher({
  position: 'top-right',  // 显示在右上角
  closable: false         // 隐藏关闭按钮
});
```

#### 示例 4：混合使用

```javascript
const watcher = new VersionWatcher({
  position: 'bottom-left',
  closable: true,
  container: {
    className: 'dark-theme',
    style: '--wvw-background: #2c3e50; --wvw-text-color: white;'
  }
});
```

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

6. **测试位置配置**：
   ```javascript
   const watcher = new VersionWatcher({
     position: 'top-left'  // 可选: 'top-left', 'top-right', 'bottom-left', 'bottom-right'
   });
   ```

7. **测试关闭按钮配置**：
   ```javascript
   const watcher = new VersionWatcher({
     closable: false  // 隐藏关闭按钮
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
