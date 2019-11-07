import { GROUP } from './config';
import Mouse from './mouse';
const { ccclass, property } = cc._decorator;

@ccclass
export default class Gold extends cc.Component {

    @property(Number)
    score: number = 100;

    @property(Number)
    weight: number = 0.1;

    mouse: Mouse = null;

    is_open: boolean = true;

    onLoad() {
        if (this.node.group === GROUP.GOLD) {
            this.node.rotation = 360 * Math.random();
            let anim = this.node.getComponent<cc.Animation>(cc.Animation);
            this.scheduleOnce(() => {
                anim && anim.play();
            }, 10 * Math.random());
        }
    }

    start() {

    }

    changeChild(parent:Gold){
        this.node.setParent(parent.node);
        this.node.x = 0;
        this.node.y = -this.node.height / 2;
        this.is_open=false;
        parent.score += this.score;
        parent.weight += this.weight;  
    }

    show() {
        this.node.opacity = 0;
        this.node.runAction(cc.fadeIn(.25));
    }

    hide() {
        this.node.runAction(
            cc.sequence(
                cc.fadeOut(.2),
                cc.callFunc(() => {
                    this.node.destroy();
                })
            )
        )
    }

}
