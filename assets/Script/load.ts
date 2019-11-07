
const { ccclass, property } = cc._decorator;

@ccclass
export default class Load extends cc.Component {

    @property(cc.ProgressBar)
    bar: cc.ProgressBar = null;

    // onLoad () {}

    start() {

    }

    setBar(num: number = 0) {
        this.bar.progress = Math.min(num, 1);
        if (num >= 1) {
            this.node.destroy();
        }
    }

    // update (dt) {}
}


