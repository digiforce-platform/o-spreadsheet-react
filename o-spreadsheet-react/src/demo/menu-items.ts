import { menuRegistry } from '../spreadsheet';

// Demo type menu items
menuRegistry.defineMenu({
  id: 'demo',
  parent: ['data'],
  config: {
    name: "Data Demo",
    isReadonlyAllowed: true,
    sequence: 100,
    separator: true,
    icon: "o-spreadsheet-Icon.INSERT_SHEET",
  }
});

menuRegistry.defineMenu({
  id: 'basic_demo',
  parent: ['data', 'demo'],
  config: {
    name: "Basic Demo",
    sequence: 11,
    isReadonlyAllowed: true,
    execute: () => {},
  }
});

menuRegistry.defineMenu({
  id: 'pivot_demo',
  parent: ['data', 'demo'],
  config: {
    name: "Pivot Table",
    sequence: 12,
    isReadonlyAllowed: true,
    execute: () => {},
  }
});

menuRegistry.defineMenu({
  id: 'large_demo',
  parent: ['data', 'demo'],
  config: {
    name: "Large Dataset",
    sequence: 13,
    isReadonlyAllowed: true,
    execute: () => {},
  }
});

// File menu items
menuRegistry.defineMenu({
  id: 'readonly',
  parent: ['file'],
  config: {
    name: "Open in read-only",
    sequence: 11,
    execute: async (env) => {
      await env.model.updateMode('readonly');
    },
    icon: "o-spreadsheet-Icon.OPEN_READ_ONLY",
  }
});

menuRegistry.defineMenu({
  id: 'dashboard',
  parent: ['file'],
  config: {
    name: "Open in dashboard",
    sequence: 12,
    isReadonlyAllowed: true,
    isVisible: () => true,
    execute: async (env: any) => {
      await env.model.updateMode('dashboard');
    },
    icon: "o-spreadsheet-Icon.OPEN_DASHBOARD",
  }
});

menuRegistry.defineMenu({
  id: 'read_write',
  parent: ['file'],
  config: {
    name: "Open with write access",
    sequence: 13,
    isReadonlyAllowed: true,
    execute: async (env: any) => {
      await env.model.updateMode('normal');
    },
    icon: "o-spreadsheet-Icon.OPEN_READ_WRITE",
  }
});
