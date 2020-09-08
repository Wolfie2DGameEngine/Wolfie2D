import Scene from "./Scene";
import ResourceManager from "../ResourceManager/ResourceManager";
import Viewport from "../SceneGraph/Viewport";
import GameLoop from "../Loop/GameLoop";

export default class SceneManager{

	private currentScene: Scene;
	private viewport: Viewport;
	private resourceManager: ResourceManager;
	private game: GameLoop;

	constructor(viewport: Viewport, game: GameLoop){
		this.resourceManager = ResourceManager.getInstance();
		this.viewport = viewport;
		this.game = game;
	}

	public addScene<T extends Scene>(constr: new (...args: any) => T): void {
		let scene = new constr(this.viewport, this, this.game);
		this.currentScene = scene;

		// Enqueue all scene asset loads
		scene.loadScene();

		// Load all assets
		this.resourceManager.loadResourcesFromQueue(() => {
			scene.startScene();
			scene.setRunning(true);
		});
	}

	public changeScene<T extends Scene>(constr: new (...args: any) => T): void {
		// unload current scene
		this.currentScene.unloadScene();

		this.resourceManager.unloadAllResources();

		this.viewport.setPosition(0, 0);

		this.addScene(constr);
	}

	public render(ctx: CanvasRenderingContext2D){
		this.currentScene.render(ctx);
	}

	public update(deltaT: number){
		if(this.currentScene.isRunning()){
			this.currentScene.update(deltaT);
		}
	}
}