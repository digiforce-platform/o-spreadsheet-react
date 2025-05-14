import React, { useState, useEffect } from 'react';
import { Spreadsheet } from './Spreadsheet';
import { demoData, pivotData, createLargeDataset } from './data';
import { menuRegistry } from './menu-registry';
import './menu-items';
const DEMO_TYPES = {
  BASIC: 'basic',
  PIVOT: 'pivot',
  LARGE: 'large'
} as const;

type DemoType = typeof DEMO_TYPES[keyof typeof DEMO_TYPES];

export function SpreadsheetDemo() {
  const [demoType, setDemoType] = useState<DemoType>(DEMO_TYPES.BASIC);
  const [rows, setRows] = useState(1000);
  const [cols, setCols] = useState(10);

  useEffect(() => {
    menuRegistry.showMenu('file');
    menuRegistry.showMenu('readonly');
    menuRegistry.showMenu('dashboard');
    menuRegistry.showMenu('read_write');
  }, []);

  const getDemoData = () => {
    switch (demoType) {
      case DEMO_TYPES.PIVOT:
        return pivotData;
      case DEMO_TYPES.LARGE:
        return createLargeDataset(rows, cols);
      default:
        return demoData;
    }
  };

  return (
    <Spreadsheet
      data={getDemoData()}
      client={{ id: '1', name: 'Demo User' }}
      onError={(error) => console.error('Spreadsheet error:', error)}
      menu={{
        readonly: true,
        dashboard: true,
        read_write: true,
        demo: true,
        basic_demo: true,
        pivot_demo: true,
        large_demo: true,
      }}
    />
  );
}
