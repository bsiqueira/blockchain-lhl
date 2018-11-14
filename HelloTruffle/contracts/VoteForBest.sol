pragma solidity ^0.4.22;


contract VoteForBest {
  uint256 RDR2Votes;
  uint256 ACOVotes;

  function getRDR2Votes() public view returns (uint256) {
    return RDR2Votes;
  }

  function getACOVotes() public view returns (uint256) {
    return ACOVotes;
  }

  function voteForRDR2() public {
    RDR2Votes++;
  }

  function voteForACO() public {
    ACOVotes++;
  }
}
