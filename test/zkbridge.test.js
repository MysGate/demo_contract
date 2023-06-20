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
var utils = require("../src/utils");
describe("zkbridge", function () {
    it("Should verify the proof", function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, porter, bob, bob1, bob2, addrs, CrossController, PorterPoolFactory, PorterPool, CC, PF, _b, _c, porterPoolAddr, porterPool, _d, poseidonHash, C6, poseidonContract, bridgeFactory, bridge, _e, _f, supply, tokenMock, mysUSDT, amount, tx, _g, _h, _j, _k, txadd, _l, _m, _o, path2RootPos, cmtIdx, _p, a, b, c, publicInfo, _q, tx1, _r, _s, _t, _u, txadd1, _v, _w, _x, path2RootPos1, cmtIdx1, _y, a1, b1, c1, publicInfo1, _z, tx2, _0, _1, _2, _3, txadd2, _4, _5, _6, path2RootPos2, cmtIdx2, _7, a2, b2, c2, publicInfo2, _8;
            return __generator(this, function (_9) {
                switch (_9.label) {
                    case 0: return [4 /*yield*/, ethers.getSigners()];
                    case 1:
                        _a = _9.sent(), porter = _a[0], bob = _a[1], bob1 = _a[2], bob2 = _a[3], addrs = _a.slice(4);
                        return [4 /*yield*/, ethers.getContractFactory("CrossController")];
                    case 2:
                        CrossController = _9.sent();
                        return [4 /*yield*/, ethers.getContractFactory("PorterPoolFactory")];
                    case 3:
                        PorterPoolFactory = _9.sent();
                        return [4 /*yield*/, ethers.getContractFactory("PorterPool")];
                    case 4:
                        PorterPool = _9.sent();
                        return [4 /*yield*/, CrossController.deploy()];
                    case 5:
                        CC = _9.sent();
                        return [4 /*yield*/, CC.deployed()];
                    case 6:
                        _9.sent();
                        return [4 /*yield*/, CC.initialize(porter.address)];
                    case 7:
                        _9.sent();
                        console.log("CrossController Addr: ", CC.address);
                        return [4 /*yield*/, PorterPoolFactory.deploy(CC.address)];
                    case 8:
                        PF = _9.sent();
                        return [4 /*yield*/, PF.deployed()];
                    case 9:
                        _9.sent();
                        return [4 /*yield*/, CC.setPorterFactory(PF.address)];
                    case 10:
                        _9.sent();
                        console.log("porter factory Addr: ", PF.address);
                        _b = expect;
                        return [4 /*yield*/, CC.porterFactory()];
                    case 11:
                        _b.apply(void 0, [_9.sent()]).to.equal(PF.address);
                        return [4 /*yield*/, CC.setFloatFee(2)];
                    case 12:
                        _9.sent();
                        _c = expect;
                        return [4 /*yield*/, CC.floatFee()];
                    case 13:
                        _c.apply(void 0, [_9.sent()]).to.equal(2);
                        return [4 /*yield*/, PF.createPorterPool("0x")];
                    case 14:
                        _9.sent();
                        return [4 /*yield*/, PF.porterPools(porter.address)];
                    case 15:
                        porterPoolAddr = _9.sent();
                        console.log("porterPool Addr: ", porterPoolAddr);
                        return [4 /*yield*/, PorterPool.attach(porterPoolAddr)];
                    case 16:
                        porterPool = _9.sent();
                        return [4 /*yield*/, porterPool.setFixedFee(10000)];
                    case 17:
                        _9.sent();
                        _d = expect;
                        return [4 /*yield*/, porterPool.fixedFee()];
                    case 18:
                        _d.apply(void 0, [_9.sent()]).to.equal(10000);
                        return [4 /*yield*/, cls.buildPoseidonReference()];
                    case 19:
                        poseidonHash = _9.sent();
                        C6 = new ethers.ContractFactory(cls.poseidonContract.generateABI(2), cls.poseidonContract.createCode(2), porter);
                        return [4 /*yield*/, C6.deploy()];
                    case 20:
                        poseidonContract = _9.sent();
                        console.log("poseidon Address:", poseidonContract.address);
                        return [4 /*yield*/, ethers.getContractFactory("Bridge")];
                    case 21:
                        bridgeFactory = _9.sent();
                        return [4 /*yield*/, bridgeFactory.deploy(poseidonContract.address, CC.address)];
                    case 22:
                        bridge = _9.sent();
                        return [4 /*yield*/, bridge.deployed()];
                    case 23:
                        _9.sent();
                        console.log("Bridge Addr: ", bridge.address);
                        return [4 /*yield*/, CC.setZkVerifier(bridge.address)];
                    case 24:
                        _9.sent();
                        _e = expect;
                        return [4 /*yield*/, CC.zkVerifier()];
                    case 25:
                        _e.apply(void 0, [_9.sent()]).to.equal(bridge.address);
                        return [4 /*yield*/, CC.enableZkVerifier(true)];
                    case 26:
                        _9.sent();
                        _f = expect;
                        return [4 /*yield*/, CC.enable()];
                    case 27:
                        _f.apply(void 0, [_9.sent()]).to.equal(true);
                        supply = ethers.utils.parseUnits("100000000", "ether");
                        return [4 /*yield*/, ethers.getContractFactory("TokenMock")];
                    case 28:
                        tokenMock = _9.sent();
                        return [4 /*yield*/, upgrades.deployProxy(tokenMock, ['mys USDT', 'mysUSDT', supply])];
                    case 29:
                        mysUSDT = _9.sent();
                        return [4 /*yield*/, mysUSDT.deployed()];
                    case 30:
                        _9.sent();
                        console.log("mysUSDT deployed to:", mysUSDT.address);
                        amount = ethers.utils.parseUnits("90", "ether");
                        return [4 /*yield*/, mysUSDT.transfer(bob.address, amount)];
                    case 31:
                        tx = _9.sent();
                        return [4 /*yield*/, tx.wait()];
                    case 32:
                        _9.sent();
                        _g = expect;
                        return [4 /*yield*/, mysUSDT.balanceOf(bob.address)];
                    case 33:
                        _g.apply(void 0, [_9.sent()]).to.equal(amount);
                        // generate proof verify it
                        console.log("mysUSDT transfer to bob tx:", tx.hash);
                        console.log("===addCommitment===");
                        _j = (_h = console).log;
                        _k = ["root before operation: "];
                        return [4 /*yield*/, bridge.getRoot()];
                    case 34:
                        _j.apply(_h, _k.concat([_9.sent()]));
                        return [4 /*yield*/, CC.addCommitment(tx.hash)];
                    case 35:
                        txadd = _9.sent();
                        return [4 /*yield*/, txadd.wait()];
                    case 36:
                        _9.sent();
                        _m = (_l = console).log;
                        _o = ["root after operation: "];
                        return [4 /*yield*/, bridge.getRoot()];
                    case 37:
                        _m.apply(_l, _o.concat([_9.sent()]));
                        path2RootPos = [0, 0, 0, 0, 0, 0, 0, 0];
                        cmtIdx = utils.Bits2Num(8, path2RootPos);
                        console.log("cmtIdx", cmtIdx);
                        return [4 /*yield*/, utils.generateProof(bridge, cmtIdx, tx.hash)];
                    case 38:
                        _p = _9.sent(), a = _p[0], b = _p[1], c = _p[2], publicInfo = _p[3];
                        console.log("===verify===", publicInfo);
                        _q = expect;
                        return [4 /*yield*/, bridge.verify(a, b, c, publicInfo)];
                    case 39: return [4 /*yield*/, (_9.sent())];
                    case 40:
                        _q.apply(void 0, [_9.sent()]).to.equal(true);
                        // porter transfer 100token to bob1
                        amount = ethers.utils.parseUnits("100", "ether");
                        return [4 /*yield*/, mysUSDT.transfer(bob1.address, amount)];
                    case 41:
                        tx1 = _9.sent();
                        _r = expect;
                        return [4 /*yield*/, mysUSDT.balanceOf(bob1.address)];
                    case 42:
                        _r.apply(void 0, [_9.sent()]).to.equal(amount);
                        return [4 /*yield*/, tx1.wait()];
                    case 43:
                        _9.sent();
                        console.log("mysUSDT transfer to bob1 tx:", tx1.hash);
                        console.log("===addCommitment===");
                        _t = (_s = console).log;
                        _u = ["root before operation: "];
                        return [4 /*yield*/, bridge.getRoot()];
                    case 44:
                        _t.apply(_s, _u.concat([_9.sent()]));
                        return [4 /*yield*/, CC.addCommitment(tx1.hash)];
                    case 45:
                        txadd1 = _9.sent();
                        return [4 /*yield*/, txadd1.wait()];
                    case 46:
                        _9.sent();
                        _w = (_v = console).log;
                        _x = ["root after operation: "];
                        return [4 /*yield*/, bridge.getRoot()];
                    case 47:
                        _w.apply(_v, _x.concat([_9.sent()]));
                        path2RootPos1 = [1, 0, 0, 0, 0, 0, 0, 0];
                        cmtIdx1 = utils.Bits2Num(8, path2RootPos1);
                        console.log("cmtIdx", cmtIdx1);
                        return [4 /*yield*/, utils.generateProof(bridge, cmtIdx1, tx1.hash)];
                    case 48:
                        _y = _9.sent(), a1 = _y[0], b1 = _y[1], c1 = _y[2], publicInfo1 = _y[3];
                        console.log("===verify===", publicInfo1);
                        _z = expect;
                        return [4 /*yield*/, bridge.verify(a1, b1, c1, publicInfo1)];
                    case 49: return [4 /*yield*/, (_9.sent())];
                    case 50:
                        _z.apply(void 0, [_9.sent()]).to.equal(true);
                        // porter transfer 800token to bob2
                        amount = ethers.utils.parseUnits("80", "ether");
                        return [4 /*yield*/, mysUSDT.transfer(bob2.address, amount)];
                    case 51:
                        tx2 = _9.sent();
                        _0 = expect;
                        return [4 /*yield*/, mysUSDT.balanceOf(bob2.address)];
                    case 52:
                        _0.apply(void 0, [_9.sent()]).to.equal(amount);
                        // generate proof verify it
                        return [4 /*yield*/, tx2.wait()];
                    case 53:
                        // generate proof verify it
                        _9.sent();
                        console.log("mysUSDT transfer to bob2 tx:", tx2.hash);
                        console.log("===addCommitment===");
                        _2 = (_1 = console).log;
                        _3 = ["root before operation: "];
                        return [4 /*yield*/, bridge.getRoot()];
                    case 54:
                        _2.apply(_1, _3.concat([_9.sent()]));
                        return [4 /*yield*/, CC.addCommitment(tx2.hash)];
                    case 55:
                        txadd2 = _9.sent();
                        return [4 /*yield*/, txadd2.wait()];
                    case 56:
                        _9.sent();
                        _5 = (_4 = console).log;
                        _6 = ["root after operation: "];
                        return [4 /*yield*/, bridge.getRoot()];
                    case 57:
                        _5.apply(_4, _6.concat([_9.sent()]));
                        path2RootPos2 = [0, 1, 0, 0, 0, 0, 0, 0];
                        cmtIdx2 = utils.Bits2Num(8, path2RootPos2);
                        console.log("cmtIdx", cmtIdx2);
                        return [4 /*yield*/, utils.generateProof(bridge, cmtIdx2, tx2.hash)];
                    case 58:
                        _7 = _9.sent(), a2 = _7[0], b2 = _7[1], c2 = _7[2], publicInfo2 = _7[3];
                        console.log("===verify===", a2, b2, c2, publicInfo2);
                        _8 = expect;
                        return [4 /*yield*/, bridge.verify(a2, b2, c2, publicInfo2)];
                    case 59: return [4 /*yield*/, (_9.sent())];
                    case 60:
                        _8.apply(void 0, [_9.sent()]).to.equal(true);
                        return [2 /*return*/];
                }
            });
        });
    });
});
