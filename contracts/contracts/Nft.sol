// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";


contract NFTM is ERC721 {
  uint256 private _currentTokenId;  // Declare the token ID counter
  mapping(uint256 => string) private _tokenURIs;  // Declare the mapping for token URIs

  constructor() ERC721("NFTap Memories", "NFTM") {
    _currentTokenId = 0;  // Initialize token ID counter
  }

  function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
    _tokenURIs[tokenId] = _tokenURI;
  }

  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    require(ownerOf(tokenId) != address(0), "ERC721Metadata: URI query for nonexistent token");
    string memory _tokenURI = _tokenURIs[tokenId];
    return _tokenURI;
  }

  function mint(address recipient, string memory uri) public returns (uint256) {
    _currentTokenId++;  // Manually increment the token ID
    uint256 newItemId = _currentTokenId;
    
    _mint(recipient, newItemId);  // Mint the new token
    _setTokenURI(newItemId, uri);  // Set the token URI for the newly minted token
    
    return newItemId;  // Return the new token ID
  }
}