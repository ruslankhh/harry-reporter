import { Attempt } from 'src/store/modules/tests/types';

export interface ControlsProps {
  isGui: boolean;
  isOpenedBrowser: boolean;
  data: Attempt;
  handleViewChange: (e: string) => void;
  onToggle: () => any;
  onAccept: () => any;
  viewType: string;
  url: string;
  gitUrl?: string;
}
