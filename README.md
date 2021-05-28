# kickstart_clone

<b>
This is based off tutorial on https://www.udemy.com/course/ethereum-and-solidity-the-complete-developers-guide/ with just slight adjustments. 

Learning Solidity/Block Technology
  
Contract:
  
https://rinkeby.etherscan.io/address/0x3D70ec25eD3523f7F9f466b966Be9735C9122e25
</b>


Project aims to create a KickStarter clone that is deployed on Rinkeby test network, trying to add control to how contributed currency can be used in each project.  

This is achieved by:

1) Once a campaign is created by manager, users can contribute to the project with ETH and be a shareholder of the project.

2) Campaign manager has to raise a request whenever he wants to use the balance that is contributed, stating the purpose and also the address of the receipient. 

3) Contributors are then able to vote on whether the request is valid.

4) Only when majority of contributors approve the request, the manager can finalize the transaction to the receipient. 


### Libraries, tools used:

Solidity, ReactJS, nextJS, Web3, Mocha 
