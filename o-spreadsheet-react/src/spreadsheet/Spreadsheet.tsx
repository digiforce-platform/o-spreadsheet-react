import {
  Component as OwlComponent,
  xml,
  App,
  onError,
  onWillStart,
  onMounted,
  onWillPatch,
  onWillUpdateProps,
  onPatched,
  onRendered,
  onWillUnmount,
  onWillDestroy,
  useExternalListener
} from '@odoo/owl'
import { useEffect, useRef } from 'react'
import { Model, Spreadsheet as SpreadsheetComponent, helpers } from '@digiforce-nc/o-spreadsheet'
import templates from '@digiforce-nc/o-spreadsheet/templates'
import './spreadsheet.scss'

const genId = new helpers.UuidGenerator();
const uuidv4 = () => genId.uuidv4();

export interface SheetProps {
  data?: any;
  mode?: 'normal' | 'readonly' | 'dashboard';
  model?: Model;
  setup?: (ctx: SpreadsheetWrapper) => void;
}

class SpreadsheetWrapper extends OwlComponent {
  static template = xml`<SpreadsheetComponent model="model"/>`;
  static components = { SpreadsheetComponent };
  declare model: Model;
  declare props: any;
  static props: any = {}

  uuidv4() {
    return uuidv4();
  }

  setup() {
    this.model = this.props.model || new Model(this.props.data || {}, {
      external: {},
      custom: {
        menu: {}
      },
      client: { id: this.uuidv4(), name: 'Local' },
      mode: this.props.mode || 'normal'
    });
    this.props.setup?.bind(this)(this);
    useExternalListener(window, "beforeunload", this.model.leaveSession);
    onError((error) => console.error(error.cause || error));
  }

  activateFirstSheet() {
    const sheetId = this.model.getters.getActiveSheetId();
    const firstSheetId = this.model.getters.getSheetIds()[0];
    if (firstSheetId !== sheetId) {
      this.model.dispatch("ACTIVATE_SHEET", { sheetIdFrom: sheetId, sheetIdTo: firstSheetId });
    }
  }

  leaveCollaborativeSession() {
    this.model.leaveSession();
  }
}

function Spreadsheet(props: SheetProps) {
  const spreadsheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (spreadsheetRef.current) {
      const container = spreadsheetRef.current;
      const app = new App(SpreadsheetWrapper, {
        env: {},
        props,
        templates,
      });

      const handleClick = (e: MouseEvent) => {
        const trigger = (e.target as HTMLElement).closest('[data-bs-toggle="collapse"]');
        if (!trigger) return;
      
        const targetSelector = trigger.getAttribute('data-bs-target');
        const target = targetSelector && container.querySelector(targetSelector) as HTMLElement;
        if (!target) return;
      
        const isOpen = target.classList.contains('show');
      
        const complete = () => {
          target.classList.remove('collapsing');
          target.classList.add('collapse', ...(isOpen ? [] : ['show']));
          target.style.height = '';
          target.removeEventListener('transitionend', complete);
        };
      
        target.style.height = `${target.scrollHeight}px`;
        void target.offsetHeight;
      
        target.classList.remove('collapse', 'show');
        target.classList.add('collapsing');
      
        if (isOpen) {
          target.style.height = '0';
          trigger.classList.add('collapsed'); // ✅ add collapsed when closing
        } else {
          target.style.height = '0';
          void target.offsetHeight;
          target.style.height = `${target.scrollHeight}px`;
          trigger.classList.remove('collapsed'); // ✅ remove collapsed when opening
        }
      
        target.addEventListener('transitionend', complete);
      };

      container.addEventListener('click', handleClick);
      
      app.mount(container);
      return () => {
        app.destroy();
        container.removeEventListener('click', handleClick);
      };
    }
  }, []);

  return (<div className="spreadsheet-container" ref={spreadsheetRef}/>);
}

export {
  Spreadsheet,
  onError,
  onWillStart,
  onMounted,
  onWillPatch,
  onWillUpdateProps,
  onPatched,
  onRendered,
  onWillUnmount,
  onWillDestroy,
  useExternalListener,
  uuidv4
};