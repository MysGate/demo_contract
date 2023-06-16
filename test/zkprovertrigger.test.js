"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var _a = require("chai"), expect = _a.expect, assert = _a.assert;
var _b = require("hardhat"), ethers = _b.ethers, upgrades = _b.upgrades;
var path = require("path");
var cls = require("circomlibjs");
describe("zkbridge", function () {
    it("Should verify the proof", function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, porter, bob, bob1, bob2, addrs, CrossController, PorterPoolFactory, PorterPool, CC, PF, _b, _c, porterPoolAddr, porterPool, _d, poseidonHash, C6, poseidonContract, bridgeFactory, bridge, _e, _f, supply, tokenMock, mysUSDT, amount, tx, _g, _h, _j, _k, txadd;
            return __generator(this, function (_l) {
                switch (_l.label) {
                    case 0: return [4 /*yield*/, ethers.getSigners()];
                    case 1:
                        _a = _l.sent(), porter = _a[0], bob = _a[1], bob1 = _a[2], bob2 = _a[3], addrs = _a.slice(4);
                        return [4 /*yield*/, ethers.getContractFactory("CrossController")];
                    case 2:
                        CrossController = _l.sent();
                        return [4 /*yield*/, ethers.getContractFactory("PorterPoolFactory")];
                    case 3:
                        PorterPoolFactory = _l.sent();
                        return [4 /*yield*/, ethers.getContractFactory("PorterPool")];
                    case 4:
                        PorterPool = _l.sent();
                        return [4 /*yield*/, CrossController.deploy()];
                    case 5:
                        CC = _l.sent();
                        return [4 /*yield*/, CC.deployed()];
                    case 6:
                        _l.sent();
                        return [4 /*yield*/, CC.initialize(porter.address)];
                    case 7:
                        _l.sent();
                        console.log("CrossController Addr: ", CC.address);
                        return [4 /*yield*/, PorterPoolFactory.deploy(CC.address)];
                    case 8:
                        PF = _l.sent();
                        return [4 /*yield*/, PF.deployed()];
                    case 9:
                        _l.sent();
                        return [4 /*yield*/, CC.setPorterFactory(PF.address)];
                    case 10:
                        _l.sent();
                        console.log("porter factory Addr: ", PF.address);
                        _b = expect;
                        return [4 /*yield*/, CC.porterFactory()];
                    case 11:
                        _b.apply(void 0, [_l.sent()]).to.equal(PF.address);
                        return [4 /*yield*/, CC.setFloatFee(2)];
                    case 12:
                        _l.sent();
                        _c = expect;
                        return [4 /*yield*/, CC.floatFee()];
                    case 13:
                        _c.apply(void 0, [_l.sent()]).to.equal(2);
                        return [4 /*yield*/, PF.createPorterPool("0x")];
                    case 14:
                        _l.sent();
                        return [4 /*yield*/, PF.porterPools(porter.address)];
                    case 15:
                        porterPoolAddr = _l.sent();
                        console.log("porterPool Addr: ", porterPoolAddr);
                        return [4 /*yield*/, PorterPool.attach(porterPoolAddr)];
                    case 16:
                        porterPool = _l.sent();
                        return [4 /*yield*/, porterPool.setFixedFee(10000)];
                    case 17:
                        _l.sent();
                        _d = expect;
                        return [4 /*yield*/, porterPool.fixedFee()];
                    case 18:
                        _d.apply(void 0, [_l.sent()]).to.equal(10000);
                        return [4 /*yield*/, cls.buildPoseidonReference()];
                    case 19:
                        poseidonHash = _l.sent();
                        C6 = new ethers.ContractFactory(cls.poseidonContract.generateABI(2), cls.poseidonContract.createCode(2), porter);
                        return [4 /*yield*/, C6.deploy()];
                    case 20:
                        poseidonContract = _l.sent();
                        console.log("poseidon Address:", poseidonContract.address);
                        return [4 /*yield*/, ethers.getContractFactory("Bridge")];
                    case 21:
                        bridgeFactory = _l.sent();
                        return [4 /*yield*/, bridgeFactory.deploy(poseidonContract.address, CC.address)];
                    case 22:
                        bridge = _l.sent();
                        return [4 /*yield*/, bridge.deployed()];
                    case 23:
                        _l.sent();
                        console.log("Bridge Addr: ", bridge.address);
                        return [4 /*yield*/, CC.setZkVerifier(bridge.address)];
                    case 24:
                        _l.sent();
                        _e = expect;
                        return [4 /*yield*/, CC.zkVerifier()];
                    case 25:
                        _e.apply(void 0, [_l.sent()]).to.equal(bridge.address);
                        return [4 /*yield*/, CC.enableZkVerifier(true)];
                    case 26:
                        _l.sent();
                        _f = expect;
                        return [4 /*yield*/, CC.enable()];
                    case 27:
                        _f.apply(void 0, [_l.sent()]).to.equal(true);
                        supply = ethers.utils.parseUnits("100000000", "ether");
                        return [4 /*yield*/, ethers.getContractFactory("TokenMock")];
                    case 28:
                        tokenMock = _l.sent();
                        return [4 /*yield*/, upgrades.deployProxy(tokenMock, ['mys USDT', 'mysUSDT', supply])];
                    case 29:
                        mysUSDT = _l.sent();
                        return [4 /*yield*/, mysUSDT.deployed()];
                    case 30:
                        _l.sent();
                        console.log("mysUSDT deployed to:", mysUSDT.address);
                        amount = ethers.utils.parseUnits("90", "ether");
                        return [4 /*yield*/, mysUSDT.transfer(bob.address, amount)];
                    case 31:
                        tx = _l.sent();
                        return [4 /*yield*/, tx.wait()];
                    case 32:
                        _l.sent();
                        _g = expect;
                        return [4 /*yield*/, mysUSDT.balanceOf(bob.address)];
                    case 33:
                        _g.apply(void 0, [_l.sent()]).to.equal(amount);
                        // generate proof verify it
                        console.log("mysUSDT transfer to bob tx:", tx.hash);
                        console.log("===addCommitment===");
                        _j = (_h = console).log;
                        _k = ["root before operation: "];
                        return [4 /*yield*/, bridge.getRoot()];
                    case 34:
                        _j.apply(_h, _k.concat([_l.sent()]));
                        return [4 /*yield*/, CC.addCommitment(tx.hash)];
                    case 35:
                        txadd = _l.sent();
                        return [4 /*yield*/, txadd.wait()];
                    case 36:
                        _l.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
});
