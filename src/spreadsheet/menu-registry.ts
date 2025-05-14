// @ts-ignore
import { registries } from '@odoo/o-spreadsheet/dist/o-spreadsheet.esm';

const { topbarMenuRegistry } = registries;

export type MenuMode = 'normal' | 'readonly' | 'dashboard';

export interface MenuConfig {
  mode: MenuMode;
  displayHeader: boolean;
  onModeChange: (mode: MenuMode) => void;
  onDisplayHeaderChange: (display: boolean) => void;
}

interface MenuDefinition {
  id: string;
  parent?: string[];
  config: {
    name: string | (() => string);
    sequence: number;
    isReadonlyAllowed?: boolean;
    isVisible?: (env: any) => boolean;
    execute?: (env: any) => void;
    icon?: string;
    separator?: boolean;
  };
}

class MenuRegistry {
  private static instance: MenuRegistry;
  private registeredMenus: Map<string, {
    enabled: boolean;
    visible: boolean;
    originalConfig: MenuDefinition['config'];
  }> = new Map();

  private constructor() {}

  public static getRegistry(): MenuRegistry {
    if (!MenuRegistry.instance) {
      MenuRegistry.instance = new MenuRegistry();
    }
    return MenuRegistry.instance;
  }

  public defineMenu(menu: MenuDefinition): void {
    if (this.registeredMenus.has(menu.id)) {
      console.warn(`Menu with id "${menu.id}" is already registered`);
      return;
    }

    const menuState = {
      enabled: false,
      visible: false,
      originalConfig: { ...menu.config }
    };
    this.registeredMenus.set(menu.id, menuState);

    const menuConfig = {
      ...menu.config,
      isVisible: (env: any) => {
        return !!env.model.config.menu[menu.id];
      },
    };

    if (menu.parent) {
      topbarMenuRegistry.addChild(menu.id, menu.parent, menuConfig);
    } else {
      topbarMenuRegistry.add(menu.id, menuConfig);
    }
  }

  public enableMenu(menuId: string): void {
    const menu = this.registeredMenus.get(menuId);
    if (menu) {
      menu.enabled = true;
      console.log(`Menu "${menuId}" enabled`);
    } else {
      console.warn(`Menu "${menuId}" not found`);
    }
  }

  public disableMenu(menuId: string): void {
    const menu = this.registeredMenus.get(menuId);
    if (menu) {
      menu.enabled = false;
      console.log(`Menu "${menuId}" disabled`);
    } else {
      console.warn(`Menu "${menuId}" not found`);
    }
  }

  public showMenu(menuId: string): void {
    const menu = this.registeredMenus.get(menuId);
    if (menu) {
      menu.visible = true;
      if (!menuId.includes('_')) {
        this.showParentMenu(menuId);
      }
      console.log(`Menu "${menuId}" shown`);
    } else {
      console.warn(`Menu "${menuId}" not found`);
    }
  }

  private showParentMenu(menuId: string): void {
    const menu = this.registeredMenus.get(menuId);
    if (menu) {
      menu.visible = true;
    }
  }

  public hideMenu(menuId: string): void {
    const menu = this.registeredMenus.get(menuId);
    if (menu) {
      menu.visible = false;
      console.log(`Menu "${menuId}" hidden`);
    } else {
      console.warn(`Menu "${menuId}" not found`);
    }
  }

  public isMenuRegistered(menuId: string): boolean {
    return this.registeredMenus.has(menuId);
  }

  public isMenuEnabled(menuId: string): boolean {
    return this.registeredMenus.get(menuId)?.enabled ?? false;
  }

  public isMenuVisible(menuId: string): boolean {
    return this.registeredMenus.get(menuId)?.visible ?? false;
  }
}

export const menuRegistry = MenuRegistry.getRegistry(); 