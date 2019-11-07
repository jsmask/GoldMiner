import Rope from './rope';
import { GAME } from './config';
import Gold from './gold';
import Load from './load';
import End from './end';
const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    @property(cc.Prefab)
    loadPreb: cc.Prefab = null;

    @property(cc.Prefab)
    endPreb: cc.Prefab = null;

    @property(Rope)
    rope: Rope = null;

    load_view: cc.Node = null;

    end_view: cc.Node = null;

    time: cc.Label = null;

    score: cc.Label = null;

    level: cc.Label = null;

    target: cc.Label = null;

    stage: cc.Node = null;

    cycle: number = 0;

    is_end: boolean = false;
    is_start: boolean = false;

    data: any = null;

    onLoad() {
        const ui = this.node.getChildByName("ui");
        this.time = ui.getChildByName("time").getComponent<cc.Label>(cc.Label);
        this.score = ui.getChildByName("score").getComponent<cc.Label>(cc.Label);
        this.target = ui.getChildByName("target").getComponent<cc.Label>(cc.Label);
        this.level = ui.getChildByName("level").getComponent<cc.Label>(cc.Label);
        this.stage = this.node.getChildByName("stage");
        this.beginGame();
    }

    start() {

    }

    createLoad() {
        if (this.loadPreb) {
            this.load_view = cc.instantiate(this.loadPreb);
            this.load_view.setParent(this.node);
        }
    }

    createEnd(type: number = 0) {
        if (this.endPreb) {
            this.end_view = cc.instantiate(this.endPreb);
            this.end_view.setParent(this.node);
            let end = this.end_view.getComponent<End>(End);
            end.main = this;
            end.setTitle(type);
        }
    }

    beginGame() {
        this.createLoad();
        this.getData()
            .then(res => {
                this.data = res;
                let levelData = this.data[`level${GAME.level}`];
                return this.loadData(levelData);
            })
            .then(res => {
                this.is_end = false;
                this.is_start = true;
                this.node.on(cc.Node.EventType.TOUCH_END, e => this.rope.change_statue_throw(), this);
            })
    }

    getData() {
        return new Promise((resolve, reject) => {
            cc.loader.loadRes("/data", (error, res) => {
                if (error) reject(error);
                resolve(res.json);
            });
        })
    }

    loadData(data) {
        const { target, time, gold } = data;
        GAME.target = target;
        GAME.time = time;
        const total = gold.length;
        let n = 0;
        let _load = this.load_view.getComponent<Load>(Load);

        this.label_update();
        return new Promise((resolve, reject) => {
            // this.getTestData();
            // resolve();
            gold.map(item => {
                cc.loader.loadRes("/preb/" + item.name, (error, res) => {
                    if (error) reject(error);
                    this.createGold(res, item);
                    n++;
                    _load.setBar(n / total);
                    if (n >= total) {
                        resolve();
                    }
                });
            })
        })
    }

    getTestData() {
        let level = {
            target: 0,
            time: 60,
            gold: []
        }
        this.stage.children.map(item => {
            level.gold.push({
                name: item.name,
                x: item.x,
                y: item.y,
                child: []
            })
        });
        cc.log(JSON.stringify(level));
    }

    createGold(preb: cc.Prefab, item: any) {
        const gold = cc.instantiate(preb).getComponent<Gold>(Gold);
        gold.node.x = item.x;
        gold.node.y = item.y;
        gold.node.setParent(this.stage);
        gold.show();
        if (item.child && item.child.length > 0) {
            cc.loader.loadRes("/preb/" + item.child[0], (error, res) => {
                if (error) return;
                let node: cc.Node = cc.instantiate(res);
                let child_gold = node.getComponent<Gold>(Gold);
                child_gold.changeChild(gold);
            });
        }
    }

    label_update() {
        this.time.string = `${GAME.time}`;
        this.score.string = `${GAME.score}`;
        this.level.string = `${GAME.level}`;
        this.target.string = `${GAME.target}`;
    }

    update(dt) {
        if (!this.is_start) return;
        if (this.is_end) return;
        this.cycle += dt;
        if (this.cycle >= 1) {
            this.cycle -= 1;
            GAME.time -= 1;
            this.label_update();
        }
        if (GAME.time <= 0) {
            this.is_end = true;
            this.rope.stop();
            if (GAME.score >= GAME.target) {
                this.createEnd(1);
            } else {
                this.createEnd(0);
            }
            this.stage.children.map((item: cc.Node) => item.getComponent<Gold>(Gold).hide());
        }
    }

    restart() {
        this.createLoad();
        let levelData = this.data[`level${GAME.level}`];
        this.stage.children.map((item: cc.Node) => item.destroy());
        this.loadData(levelData)
            .then(res => {
                this.is_end = false;
                this.is_start = true;
            })
    }
}


