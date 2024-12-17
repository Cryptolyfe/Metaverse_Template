// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Land is ERC721 {
    uint256 public cost;
    uint256 public maxSupply = 5;
    uint256 public totalSupply = 0;

    struct Building {
        string name;
        address owner;
        int256 posX;
        int256 posY;
        int256 posZ;
        uint256 sizeX;
        uint256 sizeY;
        uint256 sizeZ;
    }

    Building[] public buildings;

    constructor(string memory _name, string memory _symbol, uint256 _cost) ERC721(_name, _symbol) {
        cost = _cost;
        buildings.push(Building("City Hall", address(0), 0, 0, 0, 10, 10, 10));
        buildings.push(Building("Stadium", address(0), 0, 10, 0, 10, 5, 3));
        buildings.push(Building("University", address(0), 0, -10, 0, 10, 5, 3));
        buildings.push(Building("Shopping Plaza 1", address(0), 10, 0, 0, 5, 25, 5));
        buildings.push(Building("Shopping Plaza 2", address(0), -10, 0, 0, 5, 25, 5));
    }

    function mint(uint256 _id) public payable {
        uint256 supply = totalSupply;
        require(_id > 0 && _id <= maxSupply, "Invalid token ID");
        require(supply < maxSupply, "Max supply reached");
        require(buildings[_id - 1].owner == address(0), "Building already owned");
        require(msg.value >= cost, "Not enough ETH to purchase");

        buildings[_id - 1].owner = msg.sender;
        totalSupply = totalSupply + 1;
        _safeMint(msg.sender, _id);
    }

    function transferFrom(address from, address to, uint256 tokenId) public override {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: not owner nor approved");
        buildings[tokenId - 1].owner = to;
        _transfer(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) public override {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: not owner nor approved");
        buildings[tokenId - 1].owner = to;
        _safeTransfer(from, to, tokenId, "");
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public override {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: not owner nor approved");
        buildings[tokenId - 1].owner = to;
        _safeTransfer(from, to, tokenId, data);
    }

    function getBuildings() public view returns (Building[] memory) {
        return buildings;
    }

    function getBuilding(uint256 _id) public view returns (Building memory) {
        require(_id > 0 && _id <= buildings.length, "Invalid building ID");
        return buildings[_id - 1];
    }
}
