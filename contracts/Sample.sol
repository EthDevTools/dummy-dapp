pragma solidity ^0.5.0;

/**
 * The Sample contract does this and that...
 */
contract Sample {
    constructor() public {}

    uint public pokes;

    event Poked(uint pppp);

    function poke() public {
        pokes = pokes + 1;
        emit Poked(pokes);
    }

    function poke2(uint p) public {
        pokes = p;
        emit Poked(pokes);
    }

    function getPokes() public view returns(uint ppp) {
        return pokes;
    }
    
    function getPokes2(uint p) public pure returns(uint pp) {
        return p;
    }
}
