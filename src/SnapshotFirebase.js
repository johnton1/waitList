import React, {useState, useEffect, Fragment} from "react";
import firebase from "./firebase.js";
import "firebase/firestore";


function SnapshotFirebase() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const ref = firebase.firestore().collection("customer");
  const timeStamp = firebase.firestore.FieldValue.serverTimestamp();



  
  const onSubmit = async(e) => {
    e.preventDefault();
    ref
      .add({
        name,
        phoneNumber: parseInt(phoneNumber)
      })
      .then(() => {
        setName('')
        setPhoneNumber('')
      })

  };

  //real time get function
 function getCustomers() {
    setLoading(true);
    
    ref
    .orderBy("timeStamp")
    .onSnapshot((querySnapshot) => {
      const q = [];
      querySnapshot.forEach((doc) => {
        q.push(doc.data());
       
      });
      setCustomers(q);
      setLoading(false);  
    });

   
     
  }  

 

  useEffect(() => {
    getCustomers();
  }, []); 



  function addCustomer() {
    const newCustomer = {
      
      name,
      phoneNumber,
      timeStamp,
    }

     ref 
      .doc(newCustomer.phoneNumber)
      .set(newCustomer)  
      .catch((err) => {
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



   

  return (
    
    <form onSubmit={onSubmit}>
      <h1> Customers Checkin</h1>
      <div className="inputBox">
        <h3> Please type your name and phone number! </h3>
        <table>
          <tbody>
            <tr>
            <td>
              <label> Name: </label>
              <input 
                placeholder="Your name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}/> 
            </td>
            <td>
              <label>Phone Number: </label>
              <input placeholder="+1 XXX XXX XXXX " value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} type="tel" name="to" id="to"/>
              <button onClick={() => addCustomer()}> Check In </button>
            </td>
          </tr>
          </tbody>
          
        </table>

      </div>
      <hr />
      <table>
        
      </table>
      {loading ? <h1> Loading...</h1> : null }
      <h1> Waitlist </h1>
      {customers.map((customer) => (
        <div className="customer" key={customer.phoneNumber}>
          <table>
            <tbody>
              <tr>
                <th> Customer </th>
                
                <th> Phone number </th>
              </tr>
              <tr>
                <td> {customer.name} </td>
                
                <td> {customer.phoneNumber} </td>
              <td> </td>
              <td>
                <div>

                   <button type="submit" onClick={() => {deleteCustomer(customer)}}> Checkout </button>
              
                  
                </div>
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
