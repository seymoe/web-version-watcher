# web-version-watcher

A lightweight utility for automatically detecting and notifying web application updates using ETag/Last-Modified headers.

[简体中文](./README_zh.md) | English

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
```

## Configuration Options

### WatcherOptions

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| checkInterval | number | 60000 | Check interval in milliseconds |
| messages.title | string | 'New Version Available' | Notification title |
| messages.message | string | 'A new version of the application is available.' | Notification message |
| messages.buttonText | string | 'Refresh' | Refresh button text |
| disableInLocalhost | boolean | true | When true, version checks are disabled in localhost environment |

## How It Works

web-version-watcher periodically checks the page's ETag or Last-Modified headers to detect application updates. When an update is detected, it displays a notification in the bottom-right corner of the page, allowing users to refresh immediately or postpone the update.

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