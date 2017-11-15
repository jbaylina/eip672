pragma solidity ^0.4.18;

import "./EIP672.sol";

contract Implementer is EIP672 {

    function Implementer() public {
        setInterfaceImplementation("IExample", address(this));
    }
}


contract Checker is EIP672 {

    function Checker() public{
    }

    function implements(address a, string iFace) public constant returns(address) {
        return interfaceAddr(a, iFace);
    }
}
