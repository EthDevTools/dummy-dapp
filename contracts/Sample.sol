pragma solidity ^0.5.0;

/**
 * The Sample contract does this and that...
 */
contract Sample {
    constructor() public {}

    uint public pokes;

    event Poked(uint);

    function poke() public {
        pokes = pokes + 1;
        emit Poked(pokes);
    }

    function getPokes() public view returns(uint) {
        return pokes;
    }
}
