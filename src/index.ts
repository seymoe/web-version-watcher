type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface WatcherOptions {
  checkInterval?: number;
  messages?: {
    title?: string;
    message?: string;
    buttonText?: string;
  };
  disableInLocalhost?: boolean;
  container?: {
    className?: string;
    style?: string;
  };
  position?: Position;
  closable?: boolean;
  showButton?: boolean;
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
  private containerClassName?: string;
  private containerStyle?: string;
  private position: Position;
  private closable: boolean;
  private showButton: boolean;

  constructor(options: WatcherOptions = {}) {
    this.checkInterval = options.checkInterval || 60000;
    this.messages = {
      title: options.messages?.title ?? 'New Version Available',
      message: options.messages?.message ?? 'A new version of the application is available.',
      buttonText: options.messages?.buttonText ?? 'Refresh'
    };
    this.disableInLocalhost = options.disableInLocalhost ?? true;
    this.containerClassName = options.container?.className;
    this.containerStyle = options.container?.style;
    this.position = options.position || 'bottom-right';
    this.closable = options.closable ?? true;
    this.showButton = options.showButton ?? true;
  }

  private getPositionStyles(): string {
    const offset = '16px';
    switch (this.position) {
      case 'top-left':
        return `top: ${offset}; left: ${offset};`;
      case 'top-right':
        return `top: ${offset}; right: ${offset};`;
      case 'bottom-left':
        return `bottom: ${offset}; left: ${offset};`;
      case 'bottom-right':
      default:
        return `bottom: ${offset}; right: ${offset};`;
    }
  }

  private createNotificationElement(options: NotificationOptions): HTMLElement {
    const notification = document.createElement('div');
    
    // 设置固定类名
    notification.className = 'wvw_container';
    if (this.containerClassName) {
      notification.className += ` ${this.containerClassName}`;
    }
    
    // 设置容器样式，使用 CSS 变量
    let containerStyle = `
      position: fixed;
      ${this.getPositionStyles()}
      background: var(--wvw-background, white);
      color: var(--wvw-text-color, inherit);
      border-radius: var(--wvw-border-radius, 8px);
      padding: var(--wvw-padding, 16px);
      box-shadow: var(--wvw-box-shadow, 0px 0px 12px rgba(0, 0, 0, 0.12));
      width: var(--wvw-width, 330px);
      z-index: var(--wvw-z-index, 9999);
    `;
    
    // 追加自定义样式
    if (this.containerStyle) {
      containerStyle += this.containerStyle;
    }
    
    notification.style.cssText = containerStyle;

    // 标题
    const title = document.createElement('div');
    title.className = 'wvw_title';
    title.style.cssText = `
      font-weight: var(--wvw-title-font-weight, bold);
      margin-bottom: var(--wvw-title-margin-bottom, 8px);
      font-size: var(--wvw-title-font-size, 16px);
      color: var(--wvw-title-color, #333);
    `;
    title.textContent = options.title;

    // 消息
    const message = document.createElement('div');
    message.className = 'wvw_message';
    message.style.cssText = `
      font-size: var(--wvw-message-font-size, 14px);
      color: var(--wvw-message-color, #666);
      margin-bottom: var(--wvw-message-margin-bottom, 12px);
    `;
    message.textContent = options.message;

    notification.appendChild(title);
    notification.appendChild(message);

    // 刷新按钮（仅在 showButton 为 true 时显示）
    if (this.showButton) {
      // 按钮容器
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'wvw_button-container';
      buttonContainer.style.cssText = 'text-align: right;';

      // 刷新按钮
      const button = document.createElement('button');
      button.className = 'wvw_button';
      button.style.cssText = `
        background-color: var(--wvw-button-bg, #225ED1);
        color: var(--wvw-button-color, white);
        border: none;
        padding: var(--wvw-button-padding, 7px 15px);
        border-radius: var(--wvw-button-border-radius, 4px);
        cursor: pointer;
        font-size: var(--wvw-button-font-size, 12px);
      `;
      button.textContent = options.buttonText;
      button.onclick = () => window.location.reload();

      buttonContainer.appendChild(button);
      notification.appendChild(buttonContainer);
    }

    // 关闭按钮（仅在 closable 为 true 时显示）
    if (this.closable) {
      const closeButton = document.createElement('span');
      closeButton.className = 'wvw_close-button';
      closeButton.style.cssText = `
        position: absolute;
        top: 16px;
        right: 16px;
        cursor: pointer;
        color: var(--wvw-close-color, #909399);
        width: var(--wvw-close-size, 16px);
        height: var(--wvw-close-size, 16px);
        display: inline-flex;
        align-items: center;
        justify-content: center;
      `;
      closeButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" style="width: 100%; height: 100%;"><path fill="currentColor" d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"></path></svg>';
      closeButton.onclick = () => {
        document.body.removeChild(notification);
        if (options.onClose) {
          options.onClose();
        }
      };
      notification.appendChild(closeButton);
    }

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

  /**
   * 手动显示通知（用于测试）
   * 这个方法可以让你在本地开发时方便地测试通知的样式和功能
   */
  public show(): void {
    const notification = this.createNotificationElement({
      title: this.messages.title,
      message: this.messages.message,
      buttonText: this.messages.buttonText,
      onClose: () => {
        // 测试模式下关闭后不继续检查
      }
    });

    document.body.appendChild(notification);
  }
}

export default VersionWatcher; 