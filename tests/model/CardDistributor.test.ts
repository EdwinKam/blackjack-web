import { Card } from "../../src/model/Card";
import { CardDistributor } from "../../src/model/CardDistributor";

describe("Card distributor test", () => {
  it("test get running count", () => {
    const cardDistributor = new CardDistributor(0.75, 2);
    const card1 = new Card(2);
    const card2 = new Card(3);
    const card3 = new Card(4);
    const card4 = new Card(5);
    const card5 = new Card(6);
    const card6 = new Card(2);

    const cards = [card1, card2, card3, card4, card5, card6];
    setCardForTesting(cardDistributor, cards, 2);

    for (let i = 0; i < cards.length; i++) {
      cardDistributor.dealCard();
    }

    expect(cardDistributor.getRunningCount()).toBe(6);
  });

  it("test get running count negative", () => {
    const cardDistributor = new CardDistributor(0.75, 2);
    const card1 = new Card(1);
    const card2 = new Card(1);
    const card3 = new Card(10);
    const card4 = new Card(11);
    const card5 = new Card(12);
    const card6 = new Card(13);

    const cards = [card1, card2, card3, card4, card5, card6];
    setCardForTesting(cardDistributor, cards, 2);

    for (let i = 0; i < cards.length; i++) {
      cardDistributor.dealCard();
    }

    expect(cardDistributor.getRunningCount()).toBe(-6);
  });

  it("test get running count mix", () => {
    const cardDistributor = new CardDistributor(0.75, 2);
    const card1 = new Card(1);
    const card2 = new Card(1);
    const card3 = new Card(10);
    const card4 = new Card(11);
    const card5 = new Card(12);
    const card6 = new Card(13);
    const card7 = new Card(6);
    const card8 = new Card(2);

    const cards = [card1, card2, card3, card4, card5, card6, card7, card8];
    setCardForTesting(cardDistributor, cards, 2);
    for (let i = 0; i < cards.length; i++) {
      cardDistributor.dealCard();
    }

    expect(cardDistributor.getRunningCount()).toBe(-4);
  });
});

function setCardForTesting(
  cardDistributor: CardDistributor,
  cards: Card[],
  numOfDeck: number
): void {
  const newCards = [...cards];
  for (let i = cards.length; i < numOfDeck * 52; i++) {
    newCards.push(new Card(Math.ceil(Math.random() * 13)));
  }
  cardDistributor.setDeckForTesting(newCards);
}
