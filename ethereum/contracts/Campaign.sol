pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        address newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}

contract Campaign{
    
    struct Request{
        string description;
        uint value;
        address recipient;
        bool complete;
        mapping(address=>bool) approvals;
        uint approvalCount;
    }
    
    address public manager;
    uint public minimumContribution;
    mapping(address=>uint) public approvers;
    uint public approversCount;
    Request[] public requests;
    
    modifier managerOnly(){
        require(msg.sender == manager);
        _;
    }
    
    modifier requestNotComplete(uint request_num){
        require(!requests[request_num].complete);
        _;
    }

    function Campaign(uint minimum, address creator) public{
        require(minimum > 0);
        manager = creator;
        minimumContribution = minimum;
        approversCount = 0;
    }    
    
    function contribute() public payable{
        require(msg.value >= minimumContribution);
        if(approvers[msg.sender]> 0){
            //do nth
        }else{
            approversCount++;
        }
        approvers[msg.sender] += msg.value;
        
    }
    
    function createRequest(string description, uint value, address recipient) public managerOnly{
        Request memory new_request = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });
        requests.push(new_request);
    }
    
    function approveRequest(uint request_num) public requestNotComplete(request_num){
        Request storage req = requests[request_num];
        require(approvers[msg.sender] > 0);
        require(!req.approvals[msg.sender]);
        require(request_num < requests.length);
        req.approvals[msg.sender] = true;
        req.approvalCount ++;
    }
    
    function finalizeRequest(uint request_num) public managerOnly requestNotComplete(request_num){
        Request storage req = requests[request_num];
        require(req.approvalCount > (approversCount/2));
        req.complete = true;
        req.recipient.transfer(req.value);
    }

    function getSummary() public view returns(uint, uint, uint, uint, address){
        return (
            minimumContribution,
            this.balance, 
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns(uint){
        return requests.length;
    }
    
}