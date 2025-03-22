let notificationTimeout = null;

export default class NotificationService {
  static showNotification(message, type = 'success') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-50 flex items-center gap-3 transition-all duration-500 transform translate-y-20 opacity-0`;
    
    // 设置背景颜色
    if (type === 'success') {
      notification.classList.add('bg-gradient-to-r', 'from-kol-blue', 'to-gradient-end', 'text-white');
    } else if (type === 'error') {
      notification.classList.add('bg-gradient-to-r', 'from-kol-red', 'to-red-700', 'text-white');
    }
    
    // 添加图标
    const icon = document.createElement('div');
    icon.className = 'w-6 h-6 flex-shrink-0';
    if (type === 'success') {
      icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-6 h-6"><path d="M9 12l2 2 4-4"></path><circle cx="12" cy="12" r="10"></circle></svg>`;
    } else {
      icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-6 h-6"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
    }
    
    // 添加文本
    const text = document.createElement('div');
    text.textContent = message;
    
    notification.appendChild(icon);
    notification.appendChild(text);
    
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
      notification.classList.remove('translate-y-20', 'opacity-0');
    }, 10);
    
    // 清除之前的计时器
    if (notificationTimeout) {
      clearTimeout(notificationTimeout);
    }
    
    // 设置自动消失
    notificationTimeout = setTimeout(() => {
      notification.classList.add('translate-y-20', 'opacity-0');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500);
    }, 3000);
  }
  
  static showError(message) {
    this.showNotification(message, 'error');
  }
} 