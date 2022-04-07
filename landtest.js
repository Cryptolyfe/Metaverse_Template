const Land = artificacts.require("./Land")

contract("Land", () =>v {
    const NAME = "KRBYLAND UNIVERSITY"
    const SYMBOL = "KUNI"
    const COST = web3.utils.toWei('1','ether')

    let land, result

    beforeEach( async () => {
        land = await Land.new(NAME, SYMBOL, COST)
    })

    describe("Deployment", () => {
        it("returns the contract name", async ()  => {
            result = await land.name()
        })
    })
})