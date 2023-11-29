import { ImageSource } from "excalibur";
import sword from "./images/sword.png";
import clubs from "./images/Top-Down/Cards/Clubs-88x124.png"
import diamonds from "./images/Top-Down/Cards/Diamonds-88x124.png"
import hearts from "./images/Top-Down/Cards/Hearts-88x124.png"
import spades from "./images/Top-Down/Cards/Spades-88x124.png"

let Resources = {
  Sword: new ImageSource(sword),
  Cards: {
    Clubs: new ImageSource(clubs),
    Diamonds: new ImageSource(diamonds),
    hearts: new ImageSource(hearts),
    spades: new ImageSource(spades)
  }
};

export { Resources };