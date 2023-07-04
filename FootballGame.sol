// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract FootballGame is ERC1155 {
    uint256 public constant PLAYER_CARD_TYPE = 1;
    uint256 public constant MAX_CARDS_PER_PLAYER = 10;
    uint256 public constant ATTRIBUTES_COUNT = 4;

    struct Card {
        uint256 playerId;
        uint256[ATTRIBUTES_COUNT] attributes;
        bool exists;
    }

    mapping(address => Card[]) private playerCards;
    mapping(address => uint256) private playerScore;

    constructor() ERC1155("") {
        // Defina o URI base para as NFTs ERC1155
        _setURI("https://api.example.com/token/");
    }

    function registerPlayerCard(
        address player,
        uint256 playerId,
        uint256[ATTRIBUTES_COUNT] memory attributes
    ) external {
        require(playerCards[player].length < MAX_CARDS_PER_PLAYER, "Exceeded maximum cards per player");
        
        Card memory card = Card({
            playerId: playerId,
            attributes: attributes,
            exists: true
        });
        
        playerCards[player].push(card);
        
        // Emitir evento para indicar que uma nova carta de jogador foi registrada
        emit PlayerCardRegistered(player, playerId, playerCards[player].length - 1);
    }

    function selectPlayerCard(address player, uint256 cardIndex) external {
        require(cardIndex < playerCards[player].length, "Invalid card index");
        
        // Lógica para selecionar uma carta de jogador, por exemplo, definir uma variável de estado do contrato
    }

    function battle(address player, uint256 opponentCardIndex) external view returns (address) {
        require(playerCards[player].length > 0, "Player has no cards");
        require(opponentCardIndex < playerCards[player].length, "Invalid opponent card index");
        
        Card storage playerCard = playerCards[player][0];
        Card storage opponentCard = playerCards[player][opponentCardIndex];

        // Lógica para comparar os atributos das cartas e determinar o vencedor
        uint256 playerScore = calculateScore(playerCard);
        uint256 opponentScore = calculateScore(opponentCard);
        
        if (playerScore > opponentScore) {
            return player;
        } else {
            return address(this);
        }
    }

    function transferNFT(address recipient, uint256 tokenId) external {
        // Lógica para transferir a NFT ERC1155 para o vencedor da batalha
        _safeTransferFrom(address(this), recipient, tokenId, 1, "");
    }

    function getPlayerCards(address player) external view returns (Card[] memory) {
        return playerCards[player];
    }

    function getPlayerScore(address player) external view returns (uint256) {
        return playerScore[player];
    }

    function calculateScore(Card storage card) private view returns (uint256) {
        uint256 score = 0;
        
        for (uint256 i = 0; i < ATTRIBUTES_COUNT; i++) {
            score += card.attributes[i];
        }
        
        return score;
    }

}
