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
import { Model, Spreadsheet as SpreadsheetComponent } from '@odoo/o-spreadsheet'
import templates from '@odoo/o-spreadsheet/templates'
import './spreadsheet.scss'
// Define the OWL Spreadsheet wrapper component
class SpreadsheetWrapper extends OwlComponent {
  static template = xml`<SpreadsheetComponent model="model"/>`;
  static components = { SpreadsheetComponent };
  declare model: Model;
  static props: any = {}

  setup() {
    onWillStart(async () => {
      const { 
        data = {}, 
        client = { id: crypto.randomUUID(), name: 'Local' },
        mode = 'normal',
        onWillStart,
        menu
      } = this.props;

      try {
        const model = new Model(data, {
          external: {},
          custom: {
            menu
          },
          client,
          mode
        });

        if (onWillStart) {
          await onWillStart(model);
        }

        this.model = model;

        // Activate first sheet if needed
        const activeSheetId = model.getters.getActiveSheetId();
        const firstSheetId = model.getters.getSheetIds()[0];
        if (firstSheetId !== activeSheetId) {
          model.dispatch("ACTIVATE_SHEET", { 
            sheetIdFrom: activeSheetId, 
            sheetIdTo: firstSheetId 
          });
        }
      } catch (error) {
        const { onError } = this.props;
        if (onError) {
          onError(error);
        } else {
          console.error('Failed to initialize spreadsheet:', error);
        }
      }
    });

    onMounted(() => {
      const { onMounted } = this.props;
      if (onMounted) {
        onMounted();
      }
    });

    onWillUnmount(() => {
      const { onWillUnmount } = this.props;
      if (this.model) {
        this.model.leaveSession();
      }
      if (onWillUnmount) {
        onWillUnmount();
      }
    });

    useExternalListener(window, 'beforeunload', () => {
      const { onBeforeUnload } = this.props;
      if (this.model) {
        this.model.leaveSession();
      }
      if (onBeforeUnload) {
        onBeforeUnload();
      }
    });

    useExternalListener(window, 'unhandledrejection', () => {
      const { onUnhandledRejection } = this.props;
      if (onUnhandledRejection) {
        onUnhandledRejection();
      }
    });

    onError((error) => {
      const { onError } = this.props;
      if (onError) {
        onError(error);
      }
    });

    onWillPatch(() => {
      if (this.props.onWillPatch) {
        this.props.onWillPatch();
      }
    });

    onPatched(() => {
      if (this.props.onPatched) {
        this.props.onPatched();
      }
    });

    onRendered(() => {
      if (this.props.onRendered) {
        this.props.onRendered();
      }
    });

    onWillUpdateProps((props) => {
      if (this.props.onWillUpdateProps) {
        this.props.onWillUpdateProps(props);
      }
    });
    
    onWillDestroy(() => {
      if (this.props.onWillDestroy) {
        this.props.onWillDestroy();
      }
    });
    
    onWillUnmount(() => {
      if (this.props.onWillUnmount) {
        this.props.onWillUnmount();
      }
    });
  }
}

export interface SheetProps {
  client?: {
    id: string;
    name: string;
  };
  menu?: any;
  data?: any;
  collaborative?: boolean;
  websocketUrl?: string;
  mode?: 'normal' | 'readonly' | 'dashboard';
  onError?: (error: any) => void;
  onWillStart?: (model: Model) => Promise<void>;
  onMounted?: () => void;
  onWillUnmount?: () => void;
  onBeforeUnload?: () => void;
  onUnhandledRejection?: () => void;
  onStateChanged?: (state: any) => void;
}

function Spreadsheet(props: SheetProps) {
  const spreadsheetRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<App | null>(null);

  useEffect(() => {
    if (spreadsheetRef.current) {
      const app = new App(SpreadsheetWrapper, {
        env: {},
        props,
        templates,
      });
      
      app.mount(spreadsheetRef.current);
      appRef.current = app;
    }

    return () => {
      if (appRef.current) {
        appRef.current.destroy();
        appRef.current = null;
      }
    };
  }, []);

  return (
    <div
      className="spreadsheet-container"
      ref={spreadsheetRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        position: 'relative'
      }} 
    />
  );
}

export { Spreadsheet };