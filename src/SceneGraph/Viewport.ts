import Vec2 from "../DataTypes/Vec2";
import Vec4 from "../DataTypes/Vec4";
import GameNode from "../Nodes/GameNode";
import MathUtils from "../Utils/MathUtils";

export default class Viewport{
	private position: Vec2;
	private size: Vec2;
	private bounds: Vec4;
	private following: GameNode;

    constructor(){
        this.position = new Vec2(0, 0);
        this.size = new Vec2(0, 0);
        this.bounds = new Vec4(0, 0, 0, 0);
    }

    getPosition(): Vec2 {
        return this.position;
    }

    setPosition(vecOrX: Vec2 | number, y: number = null): void {
		if(vecOrX instanceof Vec2){
			this.position.set(vecOrX.x, vecOrX.y);
		} else {
			this.position.set(vecOrX, y);
		}
    }

    getSize(): Vec2{
        return this.size;
    }
    
    setSize(vecOrX: Vec2 | number, y: number = null): void {
		if(vecOrX instanceof Vec2){
			this.size.set(vecOrX.x, vecOrX.y);
		} else {
			this.size.set(vecOrX, y);
		}
    }
    
    includes(node: GameNode): boolean {
        let nodePos = node.getPosition();
        let nodeSize = node.getSize();
        if(nodePos.x + nodeSize.x > this.position.x && nodePos.x < this.position.x + this.size.x){
            if(nodePos.y + nodeSize.y > this.position.y && nodePos.y < this.position.y + this.size.y){
                return true;
            }
        }

        return false;
    }

	// TODO: Put some error handling on this for trying to make the bounds too small for the viewport
	// TODO: This should probably be done automatically, or should consider the aspect ratio or something
    setBounds(lowerX: number, lowerY: number, upperX: number, upperY: number): void {
        this.bounds = new Vec4(lowerX, lowerY, upperX, upperY);
    }

    follow(node: GameNode): void {
        this.following = node;
    }

    update(deltaT: number): void {
        if(this.following){
            this.position.x = this.following.getPosition().x - this.size.x/2;
            this.position.y = this.following.getPosition().y - this.size.y/2;
            let [min, max] = this.bounds.split();
            this.position.x = MathUtils.clamp(this.position.x, min.x, max.x - this.size.x/2);
            this.position.y = MathUtils.clamp(this.position.y, min.y, max.y - this.size.y/2);
        }
    }
}