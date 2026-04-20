if (typeof document !== 'undefined') {
  const proto = HTMLElement.prototype as any;
  if (!proto.empty) {
    proto.empty = function (): void {
      this.innerHTML = '';
    };
  }
  if (!proto.addClass) {
    proto.addClass = function (cls: string): void {
      this.classList.add(cls);
    };
  }
  if (!proto.createEl) {
    proto.createEl = function (tag: string, options?: any): HTMLElement {
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
      this.appendChild(element);
      return element;
    };
  }
  if (!proto.createDiv) {
    proto.createDiv = function (options?: any): HTMLDivElement {
      return (this as any).createEl('div', options) as HTMLDivElement;
    };
  }
  if (!proto.createSpan) {
    proto.createSpan = function (options?: any): HTMLSpanElement {
      return (this as any).createEl('span', options) as HTMLSpanElement;
    };
  }
}

export class Notice {
  constructor(_message: string) {}
}

export class MarkdownView {
  editor?: any;
}

export class TFile {
  extension = 'md';
  path = '';
}

export class Plugin {
  app: any;
  constructor(app: any) {
    this.app = app;
  }
  async loadData(): Promise<any> {
    return {};
  }
  async saveData(): Promise<void> {}
  registerView(): void {}
  registerMarkdownPostProcessor(): void {}
  registerEditorExtension(): void {}
  addSettingTab(): void {}
  addCommand(): void {}
  registerEvent(): void {}
  addStatusBarItem(): HTMLElement {
    return document.createElement('div');
  }
}

export class PluginSettingTab {
  app: any;
  plugin: any;
  containerEl = document.createElement('div');
  constructor(app: any, plugin: any) {
    this.app = app;
    this.plugin = plugin;
  }
}

export class Setting {
  constructor(_containerEl: HTMLElement) {}
  setName(): this {
    return this;
  }
  setDesc(): this {
    return this;
  }
  addText(cb: (input: any) => void): this {
    cb({
      setPlaceholder: () => ({
        setValue: () => ({
          onChange: () => {},
        }),
      }),
      setValue: () => ({
        onChange: () => {},
      }),
    });
    return this;
  }
  addToggle(cb: (toggle: any) => void): this {
    cb({
      setValue: () => ({
        onChange: () => {},
      }),
    });
    return this;
  }
  addDropdown(cb: (dropdown: any) => void): this {
    cb({
      addOption: () => {},
      setValue: () => ({
        onChange: () => {},
      }),
    });
    return this;
  }
  addButton(cb: (button: any) => void): this {
    cb({
      setButtonText: () => ({
        onClick: () => {},
      }),
    });
    return this;
  }
}

export class ItemView {
  leaf: any;
  contentEl = document.createElement('div');
  constructor(leaf: any) {
    this.leaf = leaf;
  }
}

export interface App {}
export interface MarkdownPostProcessorContext {}

export class WorkspaceLeaf {
  view: any = { getViewType: () => 'markdown' };
  async setViewState(): Promise<void> {}
  async openFile(): Promise<void> {}
}
