import { GROUP } from './config';
const { ccclass, property } = cc._decorator;

const Direction = {
    RIGHT: 1,
    LEFT: -1
}

@ccclass
export default class Mouse extends cc.Component {

    @property(Number)
    speed: number = 80;

    is_move: boolean = false;

    direction: number = Direction.LEFT;

    anim: cc.Animation = null;

    onLoad() {
        this.is_move = true;
        this.anim = this.node.getComponent<cc.Animation>(cc.Animation);
        if (this.is_move) {
            this.anim.play();
        }
    }

    start() {

    }


    onCollisionEnter(other) {
        if (other.node.group !== GROUP.HAND) {
            if (other.node.parent === this.node) return;
            this.speed *= -1;
            this.node.scaleX *= -1;
        } else {
            this.is_move = false;
        }
    }

    update(dt) {
        if (!this.is_move) {
            this.anim.stop();
            return;
        }
        this.node.x += dt * this.speed * this.direction;
    }

}
