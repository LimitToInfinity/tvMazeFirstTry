const { expect } = chai
const { stub } = sinon

describe("#parseJSON", () => {
    it("calls json()", () => {
        const response = {
            json: stub()
        }
        parseJSON(response)
        expect(response.json).to.have.been.calledOnce
    })
})

describe("#parseAllToJSON", () => {
    it("calls json() on an array of fetch responses", done => {
        const json1 = stub()
        const json2 = stub()
        const responses = [{ json: json1 },{ json: json2 }]
        parseAllToJSON(responses).then(responses => {
            expect(json1).to.have.been.calledOnce
            expect(json2).to.have.been.calledOnce
            done()
        })
    })
})

describe("#flattenResponses", () => {
    it("combines arrays", () => {
        expect(flattenResponses([[1], [2], [3]])).to.deep.equal([1, 2, 3])
    })
})

describe("#createRange", () => {
    it("creates a range", () => {
        expect(createRange(3)).to.deep.equal([0, 1, 2])
    })
})

describe("#makeFetchCalls", () => {
    beforeEach(() => {
        fetchCalls.length = 0
    })
    it("creates an array of fetch calls", () => {
        makeFetchCalls("bojack")
        expect(fetchCalls[0]).to.be.a("promise")
    })
})

describe("#displayShowInfo", () => {
    beforeEach(() => {
        this.$showCard = document.createElement("div")
        this.$showInfo = document.createElement("p")
    })
    context("if the card doesn't have information, it:", () => {
        it("adds info", () => {
            expect(this.$showCard.children).to.be.empty
            displayShowInfo(this.$showCard, this.$showInfo)
            expect(this.$showCard.children).to.not.be.empty
        })
    })
})

describe("#setGenres", () => {
    beforeEach(() => {
        genres.clear()
    })
    it("sets a list of genres", () => {
        const show = {
            genres: ["Sci-Fi", "Comedy"]
        }
        setGenres(show)
        expect(genres).to.have.keys("Sci-Fi", "Comedy")
    })
})
