if (typeof document !== 'undefined') {
  const globalAny = globalThis as any;

  if (!globalAny.createEl) {
    globalAny.createEl = (tag: string, options?: any): HTMLElement => {
      const element = document.createElement(tag);
      if (options?.text) {
        element.textContent = options.text;
      }
      if (options?.cls) {
        element.className = options.cls;
      }
      if (options?.attr) {
        Object.entries(options.attr).forEach(([key, value]) => {
          element.setAttribute(key, String(value));
        });
      }
      return element;
    };
  }

  if (!globalAny.createSpan) {
    globalAny.createSpan = (options?: any): HTMLSpanElement =>
      globalAny.createEl('span', options) as HTMLSpanElement;
  }

  if (!globalAny.createFragment) {
    globalAny.createFragment = (): DocumentFragment => document.createDocumentFragment();
  }
}
