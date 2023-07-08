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
        bool inBattle;
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
            strength: strength,
            inBattle: false
        });

        cards[cardId] = newCard;
    }

    function startBattle(uint256 card1Id, uint256 card2Id) external {
        require(cards[card1Id].attack > 0, "Card 1 does not exist");
        require(cards[card2Id].attack > 0, "Card 2 does not exist");
        require(!cards[card1Id].inBattle, "Card 1 is already in battle");
        require(!cards[card2Id].inBattle, "Card 2 is already in battle");

        cards[card1Id].inBattle = true;
        cards[card2Id].inBattle = true;

        uint256 card1Score = calculateScore(cards[card1Id]);
        uint256 card2Score = calculateScore(cards[card2Id]);

        if (card1Score > card2Score) {
            emit Battle(card1Id, card2Id, card1Id);
            transferCard(card2Id, msg.sender, card1Id);
        } else if (card2Score > card1Score) {
            emit Battle(card1Id, card2Id, card2Id);
            transferCard(card1Id, msg.sender, card2Id);
        } else {
            revert("It's a draw!");
        }

        cards[card1Id].inBattle = false;
        cards[card2Id].inBattle = false;
    }

    function calculateScore(Card memory card) internal pure returns (uint256) {
        return card.attack.add(card.defense).add(card.dribble).add(card.strength);
    }

    function transferCard(
        uint256 cardId,
        address winner,
        uint256 loserCardId
    ) internal {
        // Implemente a lógica de transferência da carta usando o contrato ERC1155 ou o padrão adequado

        // Exemplo simplificado:
        balances[winner][cardId] += 1;
        balances[msg.sender][loserCardId] -= 1;
    }
}

