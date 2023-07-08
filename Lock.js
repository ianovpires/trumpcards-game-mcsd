// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract FootballBattle {
    using SafeMath for uint256;

    struct Card {
        uint256 attack;
        uint256 defense;
        uint256 dribble;
        uint256 strength;
    }

    mapping(uint256 => Card) public cards;
    mapping(address => mapping(uint256 => uint256)) public balances;

    uint256 public constant CARD_TYPE = 0;

    event Battle(uint256 card1Id, uint256 card2Id, uint256 winnerId);

    constructor() {
        // Adicione aqui os atributos de cada carta no construtor, conforme necessário
    }

    function addCard(
        uint256 cardId,
        uint256 attack,
        uint256 defense,
        uint256 dribble,
        uint256 strength
    ) external {
        require(cards[cardId].attack == 0, "Card already exists");

        Card memory newCard = Card({
            attack: attack,
            defense: defense,
            dribble: dribble,
            strength: strength
        });

        cards[cardId] = newCard;
    }

    function startBattle(uint256 card1Id, uint256 card2Id) external {
        require(cards[card1Id].attack > 0, "Card 1 does not exist");
        require(cards[card2Id].attack > 0, "Card 2 does not exist");

        uint256 card1Score = calculateScore(cards[card1Id]);
        uint256 card2Score = calculateScore(cards[card2Id]);

        if (card1Score > card2Score) {
            emit Battle(card1Id, card2Id, card1Id);
            transferCard(msg.sender, card2Id, card1Id);
        } else if (card2Score > card1Score) {
            emit Battle(card1Id, card2Id, card2Id);
            transferCard(msg.sender, card1Id, card2Id);
        } else {
            revert("It's a draw!");
        }
    }

    function transferCard(address recipient, uint256 fromCardId, uint256 toCardId) internal {
        require(balances[msg.sender][fromCardId] > 0, "Sender does not own the card");
        require(cards[fromCardId].attack > 0, "Card does not exist");

        balances[msg.sender][fromCardId] = balances[msg.sender][fromCardId].sub(1);
        balances[recipient][toCardId] = balances[recipient][toCardId].add(1);
    }

    function calculateScore(Card memory card) internal pure returns (uint256) {
        return card.attack.add(card.defense).add(card.dribble).add(card.strength);
    }
}

