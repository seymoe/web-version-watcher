interface WatcherOptions {
  checkInterval?: number;
  messages?: {
    title?: string;
    message?: string;
    buttonText?: string;
  };
  disableInLocalhost?: boolean;
}

interface NotificationOptions {
  title: string;
  message: string;
  buttonText: string;
  onClose?: () => void;
}

class VersionWatcher {
  private versionTag: string | null = null;
  private timer: number | undefined;
  private checkInterval: number;
  private messages: {
    title: string;
    message: string;
    buttonText: string;
  };
  private disableInLocalhost: boolean;

  constructor(options: WatcherOptions = {}) {
    this.checkInterval = options.checkInterval || 60000;
    this.messages = {
      title: options.messages?.title ?? 'New Version Available',
      message: options.messages?.message ?? 'A new version of the application is available.',
      buttonText: options.messages?.buttonText ?? 'Refresh'
    };
    this.disableInLocalhost = options.disableInLocalhost ?? true;
  }

  private createNotificationElement(options: NotificationOptions): HTMLElement {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: white;
      border-radius: 4px;
      padding: 16px;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
      min-width: 300px;
      z-index: 9999;
    `;

    const title = document.createElement('div');
    title.style.cssText = 'font-weight: bold; margin-bottom: 8px;';
    title.textContent = options.title;

    const message = document.createElement('div');
    message.style.cssText = 'margin-bottom: 12px;';
    message.textContent = options.message;

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'text-align: right;';

    const button = document.createElement('button');
    button.style.cssText = `
      background-color: #409eff;
      color: white;
      border: none;
      padding: 7px 15px;
      border-radius: 3px;
      cursor: pointer;
      font-size: 12px;
    `;
    button.textContent = options.buttonText;
    button.onclick = () => window.location.reload();

    const closeButton = document.createElement('span');
    closeButton.style.cssText = `
      position: absolute;
      top: 8px;
      right: 8px;
      cursor: pointer;
      color: #909399;
      font-size: 16px;
    `;
    closeButton.innerHTML = '×';
    closeButton.onclick = () => {
      document.body.removeChild(notification);
      if (options.onClose) {
        options.onClose();
      }
    };

    buttonContainer.appendChild(button);
    notification.appendChild(closeButton);
    notification.appendChild(title);
    notification.appendChild(message);
    notification.appendChild(buttonContainer);

    return notification;
  }

  private async getVersionTag(): Promise<string | null> {
    try {
      const response = await fetch(window.location.pathname, {
        cache: 'no-cache',
      });
      return response.headers.get('etag') || response.headers.get('last-modified');
    } catch (error) {
      console.error('Failed to get version tag:', error);
      return null;
    }
  }

  private showNotification(newTag: string): void {
    const notification = this.createNotificationElement({
      title: this.messages.title,
      message: this.messages.message,
      buttonText: this.messages.buttonText,
      onClose: () => {
        this.timer = window.setTimeout(() => this.compareTag(), this.checkInterval);
        this.versionTag = newTag;
      }
    });

    document.body.appendChild(notification);
  }

  private async compareTag(): Promise<void> {
    try {
      if (this.disableInLocalhost && ['localhost', '127.0.0.1'].includes(window.location.hostname)) {
        window.clearTimeout(this.timer);
        return;
      }

      const newVersionTag = await this.getVersionTag();
      
      if (!newVersionTag) {
        this.timer = window.setTimeout(() => this.compareTag(), this.checkInterval);
        return;
      }

      if (this.versionTag === null) {
        this.versionTag = newVersionTag;
        this.timer = window.setTimeout(() => this.compareTag(), this.checkInterval);
      } else if (this.versionTag !== newVersionTag) {
        console.info(`Version update detected. Current: ${this.versionTag}, New: ${newVersionTag}`);
        window.clearTimeout(this.timer);
        this.showNotification(newVersionTag);
      } else {
        console.info(`No version update. Current: ${this.versionTag}`);
        this.timer = window.setTimeout(() => this.compareTag(), this.checkInterval);
      }
    } catch (error) {
      console.error('Version check failed:', error);
      this.timer = window.setTimeout(() => this.compareTag(), this.checkInterval);
    }
  }

  public start(): void {
    this.compareTag();
  }

  public stop(): void {
    if (this.timer) {
      window.clearTimeout(this.timer);
    }
  }
}

export default VersionWatcher; 