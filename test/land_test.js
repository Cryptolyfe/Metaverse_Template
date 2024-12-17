const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Land Contract", function () {
  let Land, land;
  let owner, addr1, addr2;
  const cost = ethers.parseEther("1"); // 1 ETH

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    Land = await ethers.getContractFactory("Land");
    land = await Land.deploy("TestLand", "TLAND", cost);
    await land.waitForDeployment();
  });

  it("Should have correct initial parameters", async function () {
    const maxSupply = await land.maxSupply();
    expect(maxSupply).to.equal(5);

    const totalSupply = await land.totalSupply();
    expect(totalSupply).to.equal(0);

    const contractCost = await land.cost();
    expect(contractCost).to.equal(cost);

    // Check buildings initialized correctly
    const buildings = await land.getBuildings();
    expect(buildings.length).to.equal(5);
    for (let b of buildings) {
      expect(b.owner).to.equal(ethers.ZeroAddress);
    }
  });

  it("Should not allow minting without enough ETH", async function () {
    await expect(
      land.connect(addr1).mint(1, { value: ethers.parseEther("0.5") })
    ).to.be.revertedWith("Not enough ETH to purchase");
  });

  it("Should allow minting with correct payment", async function () {
    await land.connect(addr1).mint(1, { value: cost });
    const newOwner = await land.ownerOf(1);
    expect(newOwner).to.equal(addr1.address);

    const updatedBuilding = await land.getBuilding(1);
    expect(updatedBuilding.owner).to.equal(addr1.address);

    const totalSupply = await land.totalSupply();
    expect(totalSupply).to.equal(1);
  });

  it("Should not allow minting of already owned building", async function () {
    await land.connect(addr1).mint(1, { value: cost });
    await expect(
      land.connect(addr2).mint(1, { value: cost })
    ).to.be.revertedWith("Building already owned");
  });

  it("Should not allow minting beyond max supply", async function () {
    // Mint all buildings
    for (let i = 1; i <= 5; i++) {
      await land.connect(addr1).mint(i, { value: cost });
    }
    await expect(
      land.connect(addr2).mint(6, { value: cost })
    ).to.be.revertedWith("Invalid token ID");
  });

  it("Should allow transferFrom and update building owner", async function () {
    await land.connect(addr1).mint(1, { value: cost });

    // addr1 transfers token 1 to addr2
    await land.connect(addr1).transferFrom(addr1.address, addr2.address, 1);
    
    const tokenOwner = await land.ownerOf(1);
    expect(tokenOwner).to.equal(addr2.address);

    const updatedBuilding = await land.getBuilding(1);
    expect(updatedBuilding.owner).to.equal(addr2.address);
  });

  it("Should allow safeTransferFrom and update building owner", async function () {
    await land.connect(addr1).mint(1, { value: cost });

    // addr1 safe transfers token 1 to addr2
    await land
      .connect(addr1)
      ["safeTransferFrom(address,address,uint256)"](
        addr1.address,
        addr2.address,
        1
      );

    const tokenOwner = await land.ownerOf(1);
    expect(tokenOwner).to.equal(addr2.address);

    const updatedBuilding = await land.getBuilding(1);
    expect(updatedBuilding.owner).to.equal(addr2.address);
  });

  it("Should return a specific building's details", async function () {
    const building = await land.getBuilding(1);
    expect(building.name).to.equal("City Hall");
    expect(building.owner).to.equal(ethers.ZeroAddress);
  });
});
