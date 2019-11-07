import Rope from './rope';
import { GROUP, ROPETYPE } from './config';
import Gold from './gold';
const { ccclass, property } = cc._decorator;

@ccclass
export default class Hand extends cc.Component {

    rope: Rope = null;

    // onLoad () {}

    start() {

    }

    onCollisionEnter(other) {
        if (other.node.group === GROUP.BOMB || other.node.group === GROUP.WALL) {
            this.rope.change_statue_back();
            return;
        }
        if (other.node.group === GROUP.GOLD || other.node.group === GROUP.MOUSE) {
            let gold: cc.Node = other.node;
            if (!gold.getComponent<Gold>(Gold).is_open) return false;      
            gold.setPosition(cc.v2(0, -this.rope.hand.node.height / 2));
            gold.setParent(this.rope.hand.node);
            this.rope.change_statue_target();
            if (this.rope.status !== ROPETYPE.Target) return;
            this.rope.setGold(other);
        }
        
    }

    // update (dt) {}
}
