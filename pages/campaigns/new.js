import React, {Component} from 'react';
import Layout from '../../components/Layout';
import { Button, Form, Input, Message} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';


class CampaignNew extends Component{
  state = {
    minimumContribution: '',
    errorMessage: '',
    loading: false
  };

  onSubmit = async (event) => {
    //keep browser from submitting form
    event.preventDefault();

    this.setState({loading: true, errorMessage: ''});
    try{
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createCampaign(this.state.minimumContribution).send({
        //metamask automatically calculate gas needed, so no need specify gas
        from: accounts[0]
      });

      Router.pushRoute('/');
    }catch (err){
      this.setState({errorMessage: err.message});
    }
    this.setState({loading: false});
  };

  render() {
    return (
      <Layout>
        <h3>Create a new Campaign</h3>       
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input 
            label="wei" 
            labelPosition="right"
            value={this.state.minimumContribution}
            onChange={event=>this.setState({minimumContribution: event.target.value})}
            />
          </Form.Field>
          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button primary loading={this.state.loading}>Create Campaign</Button>
        </Form>
      </Layout>
    );
  }
}

export default CampaignNew;