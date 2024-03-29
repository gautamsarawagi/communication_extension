import { JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';

import { IThemeManager } from '@jupyterlab/apputils';

/**
 * Initialization data for the jupyterlab-iframe-bridge-example extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-iframe-bridge-example:plugin',
  autoStart: true,
  requires: [IThemeManager],
  activate: (app: JupyterFrontEnd, themeManager: IThemeManager) => {
    console.log('JupyterLab extension jupyterlab-iframe-bridge-example is activated!');

    /* Incoming messages management */
    window.addEventListener('message', (event) => {
      if (event.data.type === 'from-host-to-iframe') {
        console.log('Message received in the iframe:', event.data);

        if (themeManager.theme === 'JupyterLab Dark') {
          themeManager.setTheme('JupyterLab Light');
        } else {
          themeManager.setTheme('JupyterLab Dark');
        }
      }
    });

    /* Outgoing messages management */
    const notifyThemeChanged = (): void => {
      const message = { type: 'from-iframe-to-host', theme: themeManager.theme };
      window.parent.postMessage(message, '*');
      console.log('Message sent to the host:', message);
    };
    themeManager.themeChanged.connect(notifyThemeChanged);
  },
};

export default plugin;