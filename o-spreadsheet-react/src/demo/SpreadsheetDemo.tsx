import { Spreadsheet } from '../spreadsheet';
import { demoData } from './demo-data';
import './menu-items';
import { Model } from '@digiforce-nc/o-spreadsheet';
export function SpreadsheetDemo() {
  const model = new Model(demoData, {
    external: {},
    custom: {},
    client: { id: '1', name: 'Demo User' },
    mode: 'normal'
  });
  function setup(ctx: any) {
    console.log('setup', ctx.uuidv4());
  }
  return (
    <Spreadsheet model={model} setup={setup} />
  );
}
