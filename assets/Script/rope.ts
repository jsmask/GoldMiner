import Hand from './hand';
import Gold from './gold';
import { ROPETYPE, GAME } from './config';
const { ccclass, property } = cc._decorator;


const LES_DERGEE = -75;
const RHS_DERGEE = 75;

const ROPE_LEN = 100;

@ccclass
export default class Rope extends cc.Component {

    @property(Hand)
    hand: Hand = null;

    @property(Number)
    speed: number = 100;

    now_degree: number = 0;

    status: Number = ROPETYPE.Normal;

    gold: Gold = null;

    friction: number = 0;

    onLoad() {
        this.status = ROPETYPE.Normal;
        this.node.height = ROPE_LEN;
        this.hand.rope = this;
    }

    start() {

    }

    update(dt) {
        if (this.status === ROPETYPE.Normal) {
            this.normal_update(dt);
        }
        if (this.status === ROPETYPE.Throw) {
            this.throw_update(dt);
        }
        if (this.status === ROPETYPE.Back) {
            this.black_update(dt);
        }
        if (this.status === ROPETYPE.Target) {
            this.target_update(dt);
        }
        if (this.status === ROPETYPE.Stop) {
            this.stop_update(dt);
        }
    }

    stop() {
        if (this.hand.node.childrenCount > 0) this.hand.node.children[0].destroy();
        this.gold = null;
        this.friction = 0;
        this.change_statue_stop();
    }

    normal_update(dt) {
        this.now_degree += this.speed * dt;
        this.node.rotation = this.now_degree;
        if (this.now_degree < LES_DERGEE && this.speed < 0) {
            this.speed *= -1;
        }
        if (this.now_degree > RHS_DERGEE && this.speed > 0) {
            this.speed *= -1;
        }
    }

    throw_update(dt) {
        this.node.height += Math.abs(this.speed * 2 * dt);
        this.hand.node.y = -(this.node.height + this.hand.node.height / 2);
    }

    black_update(dt) {
        this.node.height -= Math.abs(this.speed * 5 * dt);
        this.hand.node.y = -(this.node.height + this.hand.node.height / 2);
        if (this.node.height <= ROPE_LEN) {
            this.node.height = ROPE_LEN;
            this.hand.node.y = -(this.node.height + this.hand.node.height / 2);
            this.status = ROPETYPE.Normal;
        }
    }

    target_update(dt) {
        this.node.height -= Math.abs(this.speed * (3 - this.friction) * dt);
        this.hand.node.y = -(this.node.height + this.hand.node.height / 2);


        if (this.node.height <= ROPE_LEN - 100) {
            this.node.height = ROPE_LEN - 100;
            this.hand.node.y = -(this.node.height + this.hand.node.height / 2);
            this.status = ROPETYPE.Stop;
            GAME.score += this.gold.score;
            this.gold.node.destroy();
            this.gold = null;
            this.friction = 0;
        }
    }

    stop_update(dt) {
        this.node.height += Math.abs(this.speed * 3 * dt);
        this.hand.node.y = -(this.node.height + this.hand.node.height / 2);
        if (this.node.height >= ROPE_LEN) {
            this.node.height = ROPE_LEN;
            this.hand.node.y = -(this.node.height + this.hand.node.height / 2);
            this.status = ROPETYPE.Normal;
        }
    }

    setGold(gold: Gold) {
        this.gold = gold.node.getComponent<Gold>(Gold);
        this.friction = Math.min(2.9, this.gold.weight);
    }

    change_statue_throw() {
        if (GAME.time <= 0) return;
        if (this.status === ROPETYPE.Normal)
            this.status = ROPETYPE.Throw;
    }

    change_statue_back() {
        this.status = ROPETYPE.Back;
    }

    change_statue_target() {
        this.status = ROPETYPE.Target;
    }

    change_statue_stop() {
        this.status = ROPETYPE.Stop;
    }

}
