import React, { Component } from 'react';
//import './SMSForm.css';

import * as SnapshotFirebase from './SnapshotFirebase.js';

class SMSForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: {
        to: '',
        body: 'Please review us on Facebook or Yelp!'
      },
      submitting: false,
      error: false
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onHandleChange = this.onHandleChange.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();
    this.setState({ submitting: true });
    fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state.message)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          this.setState({
            error: false,
            submitting: false,
            message: {
              to: '',
              body: ''
            }
          });
        } else {
          this.setState({
            error: true,
            submitting: false
          });
        }
      });
  }

  onHandleChange(event) {
    const name = event.target.getAttribute('name');
    this.setState({
      message: { ...this.state.message, [name]: event.target.value }
    });
  }

  render() {
    
    return (
      <form
        onSubmit={this.onSubmit}
        className={this.state.error}
      >
        <div>
        <table>
          <tbody>
            <tr>
              <td>
                <label htmlFor="to">To:</label>
                <input
                  type="tel"
                  name="to"
                  id="to"
                  value={this.state.message.to}
                  onChange={this.onHandleChange}
                />
              </td>
              <td>
                <div>
                <label htmlFor="body">Message:</label>
                <textarea
                  name="body"
                  id="body"
                  value={this.state.message.body}
                  onChange={this.onHandleChange}
                />
                </div>
              </td>
              <td>
                <button type="submit" disabled={this.state.submitting}>
                  Send message
                </button>
              </td>
            </tr>
          </tbody>
        </table>
          
          
        </div>
        
      </form>
    );
  }
 
}

export default SMSForm;
