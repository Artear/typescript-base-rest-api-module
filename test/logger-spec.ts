import {expect} from "chai";
import * as sinon from "sinon";
import LogHandler from "../src/helper/logger/LogHandler";
import LogBuilder from "../src/helper/logger/LogBuilder";
import ServerLogger from "../src/helper/logger/ServerLogger";

describe("Logger Test", () => {

    let log: LogHandler;

    before(() => {
        log = (new LogBuilder)
            .withLogger(new ServerLogger())
            .withLevel("debug")
            .build();
    });

    it("Should be instance of LogHandler", () => {
        expect(log).to.be.an.instanceof(LogHandler);
    });

    it("Should have info, debug, warn, error", () => {
        expect(log).to.respondTo("info");
        expect(log).to.respondTo("debug");
        expect(log).to.respondTo("warn");
        expect(log).to.respondTo("error");
    });

    it("Should info return string info", () => {

        let message: string = "info";

        sinon.stub(log, "info").returns(message);

        expect(log.info(message)).to.be.a("string");
        expect(log.info(message)).to.be.equal(message);

        sinon.restore(log);
    });

    it("Should error return string error", () => {

        let message: string = "error";

        sinon.stub(log, "error").returns(message);

        expect(log.error(message)).to.be.a("string");
        expect(log.error(message)).to.be.equal(message);

        sinon.restore(log);
    });

    it("Should debug return string debug", () => {

        let message: string = "debug";

        sinon.stub(log, "debug").returns(message);

        expect(log.debug(message)).to.be.a("string");
        expect(log.debug(message)).to.be.equal(message);

        sinon.restore(log);
    });

    it("Should warn return string warn", () => {

        let message: string = "warn";

        sinon.stub(log, "warn").returns(message);

        expect(log.warn(message)).to.be.a("string");
        expect(log.warn(message)).to.be.equal(message);

        sinon.restore(log);
    });
});
