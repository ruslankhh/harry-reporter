import runGui from '../gui';
import Api from '../gui/api';
import commandList from './index';
import {IGuiCommandOptions} from './types';
import {IPluginOpts, IHermioneConfig} from '../types';

// args: comander, config, hermione
export default (program: any, pluginConfig: IPluginOpts, hermione: IHermioneConfig) => {
  // must be executed here because it adds `gui` field in `gemini` and `hermione tool`,
  // which is available to other plugins and is an API for interacting with the current plugin
  const guiApi = new Api(hermione);

  program
    .command(`${commandList.GUI} [paths...]`)
    .allowUnknownOption()
    .description('update the changed screenshots or gather them if they does not exist')
    .option('-p, --port <port>', 'Port to launch server on', 8000)
    .option('--hostname <hostname>', 'Hostname to launch server on', 'localhost')
    .option('-a, --auto-run', 'auto run immediately')
    .option('-O, --no-open', 'not to open a browser window after starting the server')
    .action((paths: string, options: IGuiCommandOptions) => {
      runGui({ paths, hermione, guiApi, configs: { options, program, pluginConfig } });
    });
};
