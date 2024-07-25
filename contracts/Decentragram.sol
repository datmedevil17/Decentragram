// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Decentragram {
    string public name;
    uint public imageCount = 0;
    mapping(uint => Image) public images;

    struct Image {
        uint id;
        string hash;
        string description;
        uint tipAmount;
        address payable author;
    }

    event ImageCreated(
        uint id,
        string hash,
        string description,
        uint tipAmount,
        address payable author
    );

    event ImageTipped(
        uint id,
        string hash,
        string description,
        uint tipAmount,
        address payable author
    );

    constructor() {
        name = "Decentragram";
    }

    function uploadImage(string memory _imgHash, string memory _description) public {
        require(bytes(_imgHash).length > 0);
        require(bytes(_description).length > 0);
        require(msg.sender != address(0));

        imageCount++;

        images[imageCount] = Image(imageCount, _imgHash, _description, 0, payable(msg.sender));
        emit ImageCreated(imageCount, _imgHash, _description, 0, payable(msg.sender));
    }

    function tipImageOwner(uint _id) public payable {
        require(_id > 0 && _id <= imageCount);
        Image memory _image = images[_id];
        address payable _author = _image.author;
        _author.transfer(msg.value);
        _image.tipAmount = _image.tipAmount + msg.value;
        images[_id] = _image;

        emit ImageTipped(_id, _image.hash, _image.description, _image.tipAmount, _author);
    }
}//0x65491F47F19A02f477409CAc3a41c7D1AEcc77e5
