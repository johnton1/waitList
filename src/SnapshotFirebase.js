import React, {useState, useEffect} from "react";
import firebase from "./firebase.js";
import "firebase/firestore";
import { Dropdown, Option } from "./Dropdown.js";
//import { View, Button, StyleSheet } from "react-native";


function SnapshotFirebase() {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [service, setService] = useState("");
  const ref = firebase.firestore().collection("customer");
  const timeStamp = firebase.firestore.FieldValue.serverTimestamp();
  
  const pastCustomer = firebase.firestore().collection("pastCustomer");
  const handleSelect = (e) => {
    setService(e.target.value);
  }
  //real time get function setLoading(true);setLoading(false); 
 function getCustomers() {
    
    ref
    .orderBy("timeStamp")
    .onSnapshot((querySnapshot) => {
      const q = [];
      querySnapshot.forEach((doc) => {
        q.push(doc.data());
       
      });
      setCustomers(q); 
    });
    

  }  

  useEffect(() => {
    getCustomers();
  }); 



  function addCustomer() {
    const newCustomer = {
      
      name,
      phoneNumber,
      service,
      timeStamp,
    }

     ref 
      .doc(newCustomer.phoneNumber)
      .set(newCustomer)  
      .catch((err) => {
        console.error(err);
      }); 

      pastCustomer.doc(newCustomer.phoneNumber)
      .set(newCustomer).catch((err) => {
        console.error(err);
      });
  }
 
      

  //delete function
  function deleteCustomer(customer) {
    ref
      .doc(customer.phoneNumber)
      
      .delete()
      .catch((err) => {
        console.error(err);
      });

  } 
  

  function sendSMS(customer) {
      ref.doc(customer.phoneNumber);
    const data = {
      to: customer.phoneNumber,
      body: 'Please review us on Facebook or Yelp!',
    }
    /* setTimeout(() => {
        }, 15000)
    */
 
   setTimeout(() => {
     fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then((resp) => {
      if (resp.ok) {
        return resp.json();
        
      }
      if (resp.status === 401) {
        throw new Error('Invalid PhoneNumber');
      } else {
        throw new Error('Unexpected Error. Please check the logs.')
      };
    });
   }, 7200000); //send 2 hour after check out

    
  
  }

  const onSubmit = async(e) => {
    e.preventDefault();
        setName('')
        setPhoneNumber('')
  };

  async function deleteSend(customer) {
    
    let result = null;
    try {
      result = await Promise.all([deleteCustomer(customer), sendSMS(customer)]);
      console.log('success >>', result);
    } catch (error) {
      console.log("Failed >>", result, error); 
    }
  }
  
   //{loading ? <h1> Loading...</h1> : null }
    //<button onClick={() => addCustomer()}> Check In </button>



  return (
    
    <form onSubmit={onSubmit}>
      <h1> Customers Check-in</h1>
      <div className="inputBox">
        <p> Please type your name and phone number!</p>
        <table>
          <tbody>
            <tr>
            <td>
              <input 
                placeholder="Your name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}/> 
            </td>
            <td>
              <input placeholder="+1 XXX XXX XXXX " value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} type="tel" name="to" id="to"/>
            </td>
            <td>
              <Dropdown 
              onChange={handleSelect}
              >
                <Option selected value="Choose your service"/>
                <Option value="Option 1"/>
                <Option value="Option 2"/>
              </Dropdown>
              <button onClick={() => addCustomer()}> Check In </button>
        
            </td>
              
              
              
            
            
          </tr>
          </tbody>
          
        </table>

      </div>
      <hr />
         
      <h1> Waitlist </h1>    
      {customers.map((customer) => (
        <div className="customer" key={customer.phoneNumber}>
          <table>
        <tbody>
        <tr>
          <th> Customer: </th>
          <td> {customer.name} </td>
          <th> Tel: </th>
          <td> {customer.phoneNumber} </td>
          <td>
            <button type="submit" onClick={() => deleteSend(customer)}> Checkout </button>
          </td>
        </tr>
        </tbody> 
          </table>
        </div>
      ))}
    
 
   
  </form>
  );

}

export default SnapshotFirebase;
