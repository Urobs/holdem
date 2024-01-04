import { Engine, Loader, DisplayMode, PointerScope, Color } from "excalibur";
import { Resources } from "./resources";
import logo from "./images/Top-Down/Chips/ChipsA_Flat-64x72.png";
import { PlayScene } from "./scene";
import { LoginScene } from "./loginScene";

class Game extends Engine {
  constructor() {
    super({
      width: 800,
      height: 600,
      displayMode: DisplayMode.FillScreen
      /**
       * Specify our custom canvas element so Excalibur doesn't make one
       */,
      canvasElementId: "game",
      /**
       * Specify pointer scope to ensure that excalibur won't capture the mouse input
       * meant to be captured by HTML GUI
       */
      pointerScope: PointerScope.Canvas,
    });
  }
  initialize() {
    this.addScene("playLevel", new PlayScene());
    this.addScene("login", new LoginScene((data: any) => {
      this.goToScene("playLevel", data);
    }))
    this.backgroundColor = Color.fromHex("#006400");
    this.startCustomLoader().then(() => {
      this.goToScene("login");
    });
  }

  public startCustomLoader(): Promise<void> {
    const loader: Loader = new Loader([...Object.values(Resources.Cards)]);
    loader.playButtonText = "Start";
    loader.logo = logo;
    loader.logoHeight = 144;
    loader.logoWidth = 320;
    loader.backgroundColor = "#006400";

    return this.start(loader);
  }
}

export const game = new Game();
game.initialize();
