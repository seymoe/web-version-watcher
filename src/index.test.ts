import VersionWatcher from './index';

declare global {
  namespace NodeJS {
    interface Global {
      fetch: jest.Mock;
    }
  }
}

describe('VersionWatcher', () => {
  let watcher: VersionWatcher;
  
  beforeEach(() => {
    // 清除DOM
    document.body.innerHTML = '';
    
    // 重置fetch mock
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        redirected: false,
        status: 200,
        statusText: 'OK',
        headers: new Headers({
          'etag': 'W/"123"'
        }),
        body: null,
        bodyUsed: false,
        url: '',
        type: 'default',
        clone: () => new Response(),
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        blob: () => Promise.resolve(new Blob()),
        formData: () => Promise.resolve(new FormData()),
        json: () => Promise.resolve({}),
        text: () => Promise.resolve('')
      })
    );
    
    // 创建新实例
    watcher = new VersionWatcher();
  });

  afterEach(() => {
    watcher.stop();
    jest.clearAllMocks();
  });

  it('should create instance with default options', () => {
    expect(watcher).toBeInstanceOf(VersionWatcher);
  });

  it('should create instance with custom options', () => {
    const customWatcher = new VersionWatcher({
      checkInterval: 30000,
      messages: {
        title: 'Custom Title',
        message: 'Custom Message',
        buttonText: 'Custom Button'
      }
    });
    expect(customWatcher).toBeInstanceOf(VersionWatcher);
  });

  it('should not check version on localhost', async () => {
    Object.defineProperty(window, 'location', {
      value: {
        hostname: 'localhost',
        pathname: '/'
      }
    });

    watcher.start();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should show notification when version changes', async () => {
    // 第一次调用返回的ETag
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        redirected: false,
        status: 200,
        statusText: 'OK',
        headers: new Headers({
          'etag': 'W/"123"'
        }),
        body: null,
        bodyUsed: false,
        url: '',
        type: 'default',
        clone: () => new Response(),
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        blob: () => Promise.resolve(new Blob()),
        formData: () => Promise.resolve(new FormData()),
        json: () => Promise.resolve({}),
        text: () => Promise.resolve('')
      })
    );

    // 第二次调用返回的新ETag
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        redirected: false,
        status: 200,
        statusText: 'OK',
        headers: new Headers({
          'etag': 'W/"456"'
        }),
        body: null,
        bodyUsed: false,
        url: '',
        type: 'default',
        clone: () => new Response(),
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        blob: () => Promise.resolve(new Blob()),
        formData: () => Promise.resolve(new FormData()),
        json: () => Promise.resolve({}),
        text: () => Promise.resolve('')
      })
    );

    watcher.start();
    
    // 等待两次检查完成
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // 验证通知是否显示
    const notification = document.querySelector('div');
    expect(notification).toBeTruthy();
    expect(notification?.textContent).toContain('New Version Available');
  });
}); 