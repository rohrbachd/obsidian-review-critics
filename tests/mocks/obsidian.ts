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
}

export class ItemView {
  leaf: any;
  contentEl = document.createElement('div');
  constructor(leaf: any) {
    this.leaf = leaf;
  }
}

export interface App {}
export interface WorkspaceLeaf {}
export interface MarkdownPostProcessorContext {}
