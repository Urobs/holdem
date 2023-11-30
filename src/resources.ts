import { ImageSource } from "excalibur";
import clubs from "./images/Top-Down/Cards/Clubs-88x124.png"
import diamonds from "./images/Top-Down/Cards/Diamonds-88x124.png"
import hearts from "./images/Top-Down/Cards/Hearts-88x124.png"
import spades from "./images/Top-Down/Cards/Spades-88x124.png"

let Resources = {
  Cards: {
    Clubs: new ImageSource(clubs),
    Diamonds: new ImageSource(diamonds),
    Hearts: new ImageSource(hearts),
    Spades: new ImageSource(spades),
  }
};

export { Resources }; 