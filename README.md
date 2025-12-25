# web-version-watcher

A lightweight utility for automatically detecting and notifying web application updates using ETag/Last-Modified headers.

[简体中文](https://github.com/seymoe/web-version-watcher/blob/master/README_zh.md) | English

## Features

- 🔄 Automatic update detection
- 🚀 Zero dependencies
- 💡 Customizable notification content and style
- 🌐 Support for ETag and Last-Modified headers
- 🔧 Configurable check interval
- 📱 Responsive notification UI

## Installation

```bash
npm install web-version-watcher
```

or

```bash
yarn add web-version-watcher
```

## Usage

```javascript
import VersionWatcher from 'web-version-watcher';

// Create instance
const watcher = new VersionWatcher({
  // Optional configuration
  checkInterval: 60000, // Check interval in milliseconds, default: 60s
  messages: {
    title: 'New Version Available',
    message: 'A new version of the application is available',
    buttonText: 'Refresh'
  }
});

// Start monitoring
watcher.start();

// Stop monitoring (if needed)
// watcher.stop();

// Manually show notification (for testing styles and functionality)
// watcher.show();
```

## Configuration Options

### WatcherOptions

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| checkInterval | number | 60000 | Check interval in milliseconds |
| messages | object \| function | - | Notification messages configuration, can be an object or a function that returns a messages object (supports dynamic multilingual content) |
| messages.title | string | 'New Version Available' | Notification title (when messages is an object) |
| messages.message | string | 'A new version of the application is available.' | Notification message (when messages is an object) |
| messages.buttonText | string | 'Refresh' | Refresh button text (when messages is an object) |
| disableInLocalhost | boolean | true | When true, version checks are disabled in localhost environment |
| container.className | string | - | Custom CSS class name for notification container (appended to default class) |
| container.style | string | - | Custom style string for notification container (appended to default styles) |
| position | 'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right' | 'bottom-right' | Notification position |
| closable | boolean | true | Whether to show the close button |
| showButton | boolean | true | Whether to show the refresh button |
| onUpdate | (newTag: string, currentTag: string \| null) => void | - | Update callback function. If provided, it will be called when an update is detected, and the default UI will not be shown. Users can completely customize UI and behavior in the callback |

## API Methods

### start()
Start monitoring for version updates.

### stop()
Stop monitoring for version updates.

### show()
Manually show the notification (for testing). This method allows you to easily test the notification styles and functionality during local development without waiting for version checks or modifying files.

```javascript
const watcher = new VersionWatcher({
  messages: {
    title: 'Test Notification',
    message: 'This is a test notification'
  }
});

// Show notification immediately for testing
watcher.show();
```

## Completely Custom UI

Through the `onUpdate` callback function, you can completely customize the update notification UI and behavior. When an `onUpdate` callback is provided, the library will no longer display the default UI, but instead call your provided callback function.

### Use Cases

#### 1. Completely Custom UI
```javascript
const watcher = new VersionWatcher({
  onUpdate: (newTag, currentTag) => {
    // Create custom modal
    const modal = document.createElement('div');
    modal.className = 'my-custom-modal';
    modal.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      z-index: 10000;
    `;
    modal.innerHTML = `
      <h2>New Version Detected</h2>
      <p>Current version: ${currentTag || 'unknown'}</p>
      <p>New version: ${newTag}</p>
      <div style="margin-top: 20px; text-align: right;">
        <button onclick="window.location.reload()" style="margin-right: 10px;">Update Now</button>
        <button onclick="this.parentElement.parentElement.remove()">Later</button>
      </div>
    `;
    document.body.appendChild(modal);
  }
});
```

#### 2. Using Third-party UI Library
```javascript
import { ElNotification } from 'element-plus';
// or import { message } from 'antd';

const watcher = new VersionWatcher({
  onUpdate: (newTag) => {
    // Using Element Plus
    ElNotification({
      title: 'New Version Available',
      message: 'A new version is available, please refresh the page',
      type: 'info',
      duration: 0,
      onClick: () => window.location.reload()
    });
    
    // Or using Ant Design
    // message.info('New version available, please refresh', 0, () => {
    //   window.location.reload();
    // });
  }
});
```

#### 3. Notification Only, No UI
```javascript
const watcher = new VersionWatcher({
  onUpdate: (newTag) => {
    // Only log
    console.log('New version detected:', newTag);
    
    // Or send to analytics platform
    // analytics.track('version_update_detected', { newTag });
    
    // Or use browser native notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('New Version Available', {
        body: 'A new version is available',
        icon: '/icon.png'
      });
    }
  }
});
```

#### 4. Custom Refresh Logic
```javascript
const watcher = new VersionWatcher({
  onUpdate: (newTag) => {
    if (confirm('New version detected, update now?')) {
      // Refresh immediately
      window.location.reload();
    } else {
      // Refresh after 5 seconds
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    }
  }
});
```

## How It Works

web-version-watcher periodically checks the page's ETag or Last-Modified headers to detect application updates. When an update is detected:
- If an `onUpdate` callback is provided, it will be called (default UI will not be shown)
- If no `onUpdate` callback is provided, it displays a notification at the specified position (default: bottom-right) of the page, allowing users to refresh immediately or postpone the update

## Style Customization

### CSS Variables

All notification styles can be customized using CSS variables. All variables have default values, and you can override them to customize the notification appearance.

#### Container Variables

| Variable | Default | Description |
|----------|---------|-------------|
| --wvw-background | white | Container background color |
| --wvw-text-color | inherit | Container text color |
| --wvw-border-radius | 4px | Container border radius |
| --wvw-padding | 16px | Container padding |
| --wvw-box-shadow | 0 2px 12px 0 rgba(0,0,0,.1) | Container box shadow |
| --wvw-width | 330px | Container width |
| --wvw-z-index | 9999 | Container z-index |

#### Title Variables

| Variable | Default | Description |
|----------|---------|-------------|
| --wvw-title-font-weight | bold | Title font weight |
| --wvw-title-margin-bottom | 8px | Title bottom margin |
| --wvw-title-color | #333 | Title color |

#### Message Variables

| Variable | Default | Description |
|----------|---------|-------------|
| --wvw-message-color | #666 | Message text color |
| --wvw-message-margin-bottom | 12px | Message bottom margin |

#### Button Variables

| Variable | Default | Description |
|----------|---------|-------------|
| --wvw-button-bg | #225ED1 | Button background color |
| --wvw-button-color | white | Button text color |
| --wvw-button-padding | 8px 15px | Button padding |
| --wvw-button-border-radius | 3px | Button border radius |
| --wvw-button-font-size | 12px | Button font size |

#### Close Button Variables

| Variable | Default | Description |
|----------|---------|-------------|
| --wvw-close-color | #909399 | Close button color |
| --wvw-close-size | 16px | Close button size |

### Fixed Class Names

All notification elements use fixed class names for easy CSS selector targeting:

- `wvw_container` - Notification container
- `wvw_title` - Title
- `wvw_message` - Message content
- `wvw_button-container` - Button container
- `wvw_button` - Refresh button
- `wvw_close-button` - Close button

### Style Customization Examples

#### Example 1: Customize via CSS Variables

```css
/* In your CSS file */
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

#### Example 2: Customize via Class Name and Style

```javascript
const watcher = new VersionWatcher({
  container: {
    className: 'my-custom-notification',
    style: 'border: 2px solid #3498db;'
  }
});
```

```css
/* Override child element styles via class name */
.my-custom-notification .wvw_button {
  background: #e74c3c !important;
  border-radius: 20px;
}
```

#### Example 3: Set Position and Button Display

```javascript
const watcher = new VersionWatcher({
  position: 'top-right',  // Display at top-right corner
  closable: false,         // Hide close button
  showButton: false        // Hide refresh button
});
```

#### Example 4: Mixed Usage

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

## Local Development

### Setup

1. Clone the repository and install dependencies:
```bash
git clone <repository-url>
cd web-version-watcher
npm install
```

2. Start the development build (watches for changes):
```bash
npm run dev
```

### Running Examples

1. Build the project first:
```bash
npm run build
```

2. Start the local server:
```bash
npm run serve:example
```

3. Open your browser and navigate to:
```
http://localhost:3000/examples/basic/
```

### Testing Different Scenarios

1. **Testing Version Updates**:
   - Open the example in your browser
   - Modify `examples/basic/index.html` (e.g., change some text)
   - Save the file
   - Wait for the check interval (default: 60 seconds)
   - You should see an update notification

2. **Testing Custom Messages**:
   ```javascript
   const watcher = new VersionWatcher({
     messages: {
       title: 'Custom Title',
       message: 'Custom Message',
       buttonText: 'Custom Button Text'
     }
   });
   ```

   Or use function form (supports dynamic multilingual content):
   ```javascript
   const watcher = new VersionWatcher({
     messages: () => {
       // Get current language from external source
       const lang = getCurrentLanguage(); // Your language getter function
       const i18n = {
         'zh-CN': {
           title: '发现新版本',
           message: '应用有新版本可用',
           buttonText: '立即刷新'
         },
         'en-US': {
           title: 'New Version Available',
           message: 'A new version of the application is available.',
           buttonText: 'Refresh'
         }
       };
       return i18n[lang] || i18n['en-US'];
     }
   });
   ```

6. **Testing Position Configuration**:
   ```javascript
   const watcher = new VersionWatcher({
     position: 'top-left'  // Options: 'top-left', 'top-right', 'bottom-left', 'bottom-right'
   });
   ```

7. **Testing Close Button Configuration**:
   ```javascript
   const watcher = new VersionWatcher({
     closable: false  // Hide close button
   });
   ```

8. **Testing Refresh Button Configuration**:
   ```javascript
   const watcher = new VersionWatcher({
     showButton: false  // Hide refresh button
   });
   ```

9. **Completely Custom UI (using onUpdate callback)**:
   ```javascript
   const watcher = new VersionWatcher({
     onUpdate: (newTag, currentTag) => {
       // Completely custom UI
       const modal = document.createElement('div');
       modal.className = 'my-custom-modal';
       modal.innerHTML = `
         <h2>New Version Detected</h2>
         <p>Current version: ${currentTag || 'unknown'}</p>
         <p>New version: ${newTag}</p>
         <button onclick="window.location.reload()">Update Now</button>
         <button onclick="this.parentElement.remove()">Later</button>
       `;
       document.body.appendChild(modal);
     }
   });
   ```

10. **Using Third-party UI Library**:
    ```javascript
    import { ElNotification } from 'element-plus';
    
    const watcher = new VersionWatcher({
      onUpdate: (newTag) => {
        ElNotification({
          title: 'New Version Available',
          message: 'A new version is available, please refresh the page',
          type: 'info',
          duration: 0,
          onClick: () => window.location.reload()
        });
      }
    });
    ```

11. **Notification Only, No UI**:
    ```javascript
    const watcher = new VersionWatcher({
      onUpdate: (newTag) => {
        // Only log, no UI
        console.log('New version detected:', newTag);
        // Or send to analytics platform
        analytics.track('version_update_detected', { newTag });
      }
    });
    ```

3. **Testing Different Intervals**:
   ```javascript
   const watcher = new VersionWatcher({
     checkInterval: 10000, // 10 seconds
   });
   ```

4. **Local Environment Behavior**:
   - By default, version checks are disabled in localhost environment
   - This prevents unnecessary notifications during local development
   - To enable version checks in localhost:
     ```javascript
     const watcher = new VersionWatcher({
       disableInLocalhost: false // Enable version checks in localhost
     });
     ```

5. **Testing Error Handling**:
   - Try disconnecting from the network
   - Test with invalid response headers
   - Check the console for error messages

## Browser Compatibility

Supports all modern browsers, including:

- Chrome
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

See [LICENSE](./LICENSE) for more details. 