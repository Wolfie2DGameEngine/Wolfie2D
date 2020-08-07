import Receiver from "../Events/Receiver";
import Map from "../DataTypes/Map";
import Vec2 from "../DataTypes/Vec2";
import EventQueue from "../Events/EventQueue";

export default class InputReceiver{
	private static instance: InputReceiver = null;

	private mousePressed: boolean;
	private mouseJustPressed: boolean;
	private keyJustPressed: Map<boolean>;
	private keyPressed: Map<boolean>;
	private mousePressPosition: Vec2;
	private eventQueue: EventQueue;
	private receiver: Receiver;

	private constructor(){
		this.mousePressed = false;
		this.mouseJustPressed = false;
		this.receiver = new Receiver();
		this.keyJustPressed = new Map<boolean>();
		this.keyPressed = new Map<boolean>();
		this.mousePressPosition = null;

		this.eventQueue = EventQueue.getInstance();
		this.eventQueue.subscribe(this.receiver, ["mouse_down", "mouse_up", "key_down", "key_up"]);
	}

	static getInstance(): InputReceiver{
		if(this.instance === null){
			this.instance = new InputReceiver();
		}
		return this.instance;
	}

	update(deltaT: number): void {
		// Reset the justPressed values to false
		this.mouseJustPressed = false;
		this.keyJustPressed.forEach((key: string) => this.keyJustPressed.set(key, false));

		while(this.receiver.hasNextEvent()){
			let event = this.receiver.getNextEvent();
			if(event.type === "mouse_down"){
				this.mouseJustPressed = true;
				this.mousePressed = true;
				this.mousePressPosition = event.data.get("position");	
			}

			if(event.type === "mouse_up"){
				this.mousePressed = false;
			}

			if(event.type === "key_down"){
				let key = event.data.get("key")
				this.keyJustPressed.set(key, true);
				this.keyPressed.set(key, true);
			}

			if(event.type === "key_up"){
				let key = event.data.get("key")
				this.keyPressed.set(key, false);
			}
		}
	}

	isJustPressed(key: string): boolean {
		if(this.keyJustPressed.has(key)){
			return this.keyJustPressed.get(key)
		} else {
			return false;
		}
	}

	isPressed(key: string): boolean {
		if(this.keyPressed.has(key)){
			return this.keyPressed.get(key)
		} else {
			return false;
		}
	}

	isMouseJustPressed(): boolean {
		return this.mouseJustPressed;
	}

	isMousePressed(): boolean {
		return this.mousePressed;
	}

	getMousePressPosition(): Vec2 {
		return this.mousePressPosition;
	}
}