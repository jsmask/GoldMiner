import { GROUP } from './config';
import Gold from './gold';
const { ccclass, property } = cc._decorator;

@ccclass
export default class Bomb extends cc.Component {

    anim: cc.Animation = null;

    is_open: boolean = false;

    onLoad() {
        this.anim = this.node.getComponent<cc.Animation>(cc.Animation);
    }

    start() {

    }

    onCollisionEnter(other) {
        if (other.node.group === GROUP.HAND && !this.is_open) {
            this.play();
        }
        if(!this.is_open) return;
        if (other.node.group === GROUP.BOMB) {
            let other_bomb_node: cc.Node = other.node;
            let other_bomb = other_bomb_node.getComponent<Bomb>(Bomb);
            other_bomb.play();
        }    
        if (other.node.group === GROUP.GOLD || other.node.group === GROUP.MOUSE) {
            let gold: cc.Node = other.node;
            
            gold.getComponent<Gold>(Gold).hide();
        }
    }

    play() {
        this.is_open = true;
        this.node.getComponent<cc.CircleCollider>(cc.CircleCollider).radius = 120;
        this.anim.play();
        this.anim.on(cc.Animation.EventType.FINISHED, () => {
            this.node.destroy();
        })
    }
    // update (dt) {}
}
