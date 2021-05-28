import React, {Component} from 'react'
import Layout from '../../components/Layout'
import Campaign from '../../ethereum/campaign';
import 'semantic-ui-css/semantic.min.css';
import { Card, Grid, Button } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/Contributeform';
import { Link } from '../../routes';



class CampaignShow extends Component{
    // props.query.address is the address
    static async getInitialProps(props){
        const campaign = Campaign(props.query.address);
        const summary = await campaign.methods.getSummary().call();
        return {
            address: props.query.address,
            minimumContribution: summary[0],
            balance: summary[1],
            requestsCount: summary[2],
            approversCount: summary[3],
            manager: summary[4]
        };
      }
    
    renderCards() {
        const {
            balance, manager, minimumContribution, requestsCount, approversCount
        } = this.props;

        const items = [
            {
                header: manager,
                meta: 'Address of Manager',
                description : 'Manager created this campaign and can create requests to withdraw money',
                style: {overflowWrap: 'break-word'}
            },
            {
                header: minimumContribution,
                meta: 'Minimum Contribution (wei)',
                description: 'You must contribute this amount of wei for be involved'
            },
            {
                header: requestsCount,
                meta: 'Number of Requests',
                description: 'Request tries to withdraw balance. Must be approved by approvers'
            },
            {
                header: approversCount,
                meta: 'Number of approvers',
                description: 'Number of contributers'
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Campaign Balance(ether)',
                description: 'Total money left in campaign'
            }
        ];

        return <Card.Group items={items} />;
    }
    
    render(){
        return (
            <Layout>
                <h3>Campaign Show</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={12}>
                            {this.renderCards()}
                        </Grid.Column>

                        <Grid.Column width={4}>
                        <ContributeForm address={this.props.address} />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                        <Link route={`/campaigns/${this.props.address}/requests`}>
                                    <a>
                                        <Button primary> View Requests </Button>
                                    </a>
                                </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        
        );
    }
}

export default CampaignShow;