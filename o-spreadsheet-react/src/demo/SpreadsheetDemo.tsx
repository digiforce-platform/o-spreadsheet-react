import { useEffect } from 'react';
import { Spreadsheet, menuRegistry } from '../spreadsheet';
import { demoData } from './demo-data';
import './menu-items';

export function SpreadsheetDemo() {
  useEffect(() => {
    menuRegistry.showMenu('file');
    menuRegistry.showMenu('readonly');
    menuRegistry.showMenu('dashboard');
    menuRegistry.showMenu('read_write');
  }, []);

  return (
    <Spreadsheet
      data={demoData}
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
