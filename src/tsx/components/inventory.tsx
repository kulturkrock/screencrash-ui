import * as React from "react";
import { IComponentState, IEmpty } from "../types";

import style from "../../less/components/inventory.module.less";
import { OnTheFlyAction } from "../coreMessages";

interface IProps {
  inventory: IComponentState;
  onOnTheFlyAction: (action: OnTheFlyAction) => void;
}

interface IItem {
  name: string;
  description: string;
  cost: number;
}

interface IAchievement {
  title: string;
  desc: string;
  name: string;
  reuse: boolean;
}

interface IConfiguration {
  achievements: IAchievement[];
  items: IItem[];
}

class InventoryView extends React.PureComponent<IProps, IEmpty> {
  public render(): JSX.Element {
    const {
      configuration,
      money,
      currency,
      itemCount,
      achievementsReached,
      achievementNames,
    } = this._prepareData();

    return (
      <div className={style.container}>
        {achievementsReached
          .filter((achievement) => !achievementNames.includes(achievement.name))
          .map((achievement) => (
            <div key={achievement.name} className={style.achievement}>
              <div className={style.achievementInfo}>
                <div className={style.achievementName}>{achievement.title}</div>
                <div className={style.achievementDesc}>{achievement.desc}</div>
              </div>
              <button
                onClick={this.enableAchievement.bind(this, achievement.name)}
              >
                Enable
              </button>
            </div>
          ))}

        <div className={style.money}>
          <div className={style.header}>Money</div>
          <div className={style.moneyButtons}>
            <button onClick={this.changeMoney.bind(this, -10)}>-10</button>
            <button onClick={this.changeMoney.bind(this, -5)}>-5</button>
            <button onClick={this.changeMoney.bind(this, -1)}>-1</button>
            <div>{money}</div>
            <button onClick={this.changeMoney.bind(this, +1)}>+1</button>
            <button onClick={this.changeMoney.bind(this, +5)}>+5</button>
            <button onClick={this.changeMoney.bind(this, +10)}>+10</button>
          </div>
        </div>
        <div className={style.items}>
          <div className={style.header}>Items</div>
          {configuration.items.map((item) => (
            <div key={item.name} className={style.item}>
              <div>
                <span className={style.itemCount}>
                  {itemCount[item.name] || 0}
                </span>{" "}
                {item.description}{" "}
                {item.cost !== 0 ? `(${item.cost} ${currency})` : ""}
              </div>
              <button onClick={this.removeItem.bind(this, item.name)}>-</button>
              <button onClick={this.addItem.bind(this, item.name)}>+</button>
              {item.cost != 0 ? (
                <button onClick={this.buyItem.bind(this, item.name)}>
                  Buy
                </button>
              ) : (
                ""
              )}
            </div>
          ))}
        </div>
        <div className={style.achievements}>
          <div className={style.header}>Achievements</div>
          {configuration.achievements.map((achievement) => (
            <div key={achievement.name} className={style.achievement}>
              <div className={style.achievementInfo}>
                <div className={style.achievementName}>{achievement.title}</div>
                <div className={style.achievementDesc}>{achievement.desc}</div>
              </div>
              {achievementNames.includes(achievement.name) &&
              !achievement.reuse ? (
                ""
              ) : (
                <button
                  onClick={this.enableAchievement.bind(this, achievement.name)}
                >
                  Enable
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  _prepareData(): {
    configuration: IConfiguration;
    money: number;
    currency: string;
    itemCount: { [index: string]: number };
    achievementsReached: IAchievement[];
    achievementNames: string[];
  } {
    console.log(this.props.inventory.state);
    const configuration = (this.props.inventory.state.configuration || {
      items: [],
      achievements: [],
    }) as IConfiguration;

    configuration.items.sort((item1, item2) => {
      if (item1.cost !== 0 && item2.cost === 0) return -1;
      else if (item1.cost === 0 && item2.cost !== 0) return 1;
      return item1.description.localeCompare(item2.description);
    });

    const achievementsReached = (this.props.inventory.state
      .achievementsReached || []) as IAchievement[];

    const money = (this.props.inventory.state.money || 0) as number;
    const currency = (this.props.inventory.state.currency || "money") as string;
    const itemCount: { [index: string]: number } = {};
    const items = (this.props.inventory.state.items || []) as string[];
    for (const item of items) {
      itemCount[item] = (itemCount[item] || 0) + 1;
    }
    const achievements = (this.props.inventory.state.achievements ||
      []) as IAchievement[];
    const achievementNames = achievements.map((ach) => ach.name);

    return {
      configuration,
      money,
      currency,
      itemCount,
      achievementsReached,
      achievementNames,
    };
  }

  _sendItemCommand(cmd: string, item: string): void {
    const action: OnTheFlyAction = {
      messageType: "component-action",
      target_component: "inventory",
      cmd: cmd,
      assets: [],
      params: {
        item: item,
      },
    };
    this.props.onOnTheFlyAction(action);
  }

  addItem(itemName: string): void {
    this._sendItemCommand("add", itemName);
  }

  removeItem(itemName: string): void {
    this._sendItemCommand("remove", itemName);
  }

  buyItem(itemName: string): void {
    this._sendItemCommand("buy", itemName);
  }

  changeMoney(amount: number): void {
    const action: OnTheFlyAction = {
      messageType: "component-action",
      target_component: "inventory",
      cmd: "change_money",
      assets: [],
      params: {
        amount: amount,
      },
    };
    this.props.onOnTheFlyAction(action);
  }

  enableAchievement(achievement: string): void {
    const action: OnTheFlyAction = {
      messageType: "component-action",
      target_component: "inventory",
      cmd: "enable_achievement",
      assets: [],
      params: {
        achievement: achievement,
      },
    };
    this.props.onOnTheFlyAction(action);
  }
}

export { InventoryView };
