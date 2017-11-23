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

contract Releaser is Implementer {
    function Releaser() public {
        releaseRootNodeOwnership(msg.sender);
    }

    function rootNode() constant returns (bytes32) {
        return rootNodeForAddress(address(this));
    }
}

contract NameSetter is EIP672 {
    function setName(string _name) {
        setReverseName(_name);
    }
}
