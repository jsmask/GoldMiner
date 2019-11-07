const { ccclass, property } = cc._decorator;

@ccclass
export default class EnableCollider extends cc.Component {

    @property(Boolean)
    is_enbale: boolean = true;

    @property(Boolean)
    is_debug: boolean = true;

    onLoad() {
        if (!this.is_enbale) return;
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        if (!this.is_debug) return;
        manager.enabledDebugDraw = true;
    }

    start() {

    }

    // update (dt) {}
}
