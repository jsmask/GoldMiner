import Main from './main';
import { GAME } from './config';
const { ccclass, property } = cc._decorator;

@ccclass
export default class End extends cc.Component {

    @property(cc.Label)
    title: cc.Label = null;

    @property(cc.Label)
    gold: cc.Label = null;

    @property(cc.Label)
    target: cc.Label = null;

    @property(cc.Node)
    btn: cc.Node = null;

    main: Main = null;

    key: number = 0;

    // onLoad () {}

    start() {
        this.gold.string = `${GAME.score}`;
        this.target.string = `${GAME.target}`;
        this.btn.on(cc.Node.EventType.TOUCH_END, () => {
            this.changScore();
            this.main && this.main.restart();
            this.node.destroy();
        }, this);
    }

    setTitle(key) {
        let btn_label = this.btn.getChildByName("Background").getChildByName("Label").getComponent<cc.Label>(cc.Label);
        this.key = key;
        switch (this.key) {
            case 0:
                this.title.string = `GAME OVER`;
                btn_label.string = `Restart`;
                break;
            case 1:
                this.title.string = `YOU WIN`;
                btn_label.string = `Next Level`;
                break;
            default:
                break;
        }
    }

    changScore() {
        switch (this.key) {
            case 0:
                GAME.level = 1;
                GAME.score = 0;
                break;
            case 1:
                GAME.level += 1;
                GAME.level = Math.min(Object.keys(this.main.data).length, GAME.level);
                GAME.score -= GAME.target;
                break;
            default:
                break;
        }

    }

    // update (dt) {}
}
