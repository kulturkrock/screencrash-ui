import * as React from "react";
import { IEmpty } from "types";

import style from "../less/shortcutView.module.less";
import { IShortcut } from "./types";

interface IProps {
  shortcuts: IShortcut[];
  onTriggerPredefinedActions: (actions: string[]) => void;
}

class ShortcutView extends React.PureComponent<IProps, IEmpty> {
  public render(): JSX.Element {
    return (
      <div className={style.container}>
        {this.props.shortcuts.map((shortcut, i) => (
          <div key={`shortcut_${i}`} className={style.shortcut}>
            <div className={style.shortcutTitle} title={shortcut.hotkey || ""}>
              {shortcut.title}
            </div>
            <button onClick={this.triggerActions.bind(this, shortcut.actions)}>
              Trigger
            </button>
          </div>
        ))}
      </div>
    );
  }

  private triggerActions(actions: string[]): void {
    this.props.onTriggerPredefinedActions(actions);
  }
}

export { ShortcutView };
